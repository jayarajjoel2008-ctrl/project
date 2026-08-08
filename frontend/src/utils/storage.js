// ABTALKS 2.0 LocalStorage Persistence Layer with Midnight 12:00 AM Unlock System
import { INITIAL_USER_PROFILE, CHALLENGES, ACHIEVEMENTS } from '../data/mockData';

const STORAGE_KEY = 'ABTALKS_2_0_USER_PROGRESS';

export function getUserProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      // Ensure startDate exists
      if (!data.profile.startDate) {
        // Set default start date to 11 days ago so Day 12 is active today
        const defaultStart = new Date();
        defaultStart.setDate(defaultStart.getDate() - 11);
        data.profile.startDate = defaultStart.toISOString();
        saveUserProgress(data);
      }
      return data;
    }
  } catch (err) {
    console.error('Error loading progress from localStorage:', err);
  }

  // Set initial start date to 11 days ago
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 11);

  const defaultData = {
    profile: { 
      ...INITIAL_USER_PROFILE, 
      startDate: startDate.toISOString() 
    },
    challenges: [...CHALLENGES],
    achievements: [...ACHIEVEMENTS]
  };

  saveUserProgress(defaultData);
  return defaultData;
}

export function saveUserProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving progress to localStorage:', err);
  }
}

/**
 * Calculates max unlocked day based on start date and completed days
 */
export function getMaxUnlockedDay() {
  const current = getUserProgress();
  const start = new Date(current.profile.startDate || Date.now());
  const now = new Date();

  // Days elapsed since start date (Midnight based)
  const diffTime = Math.max(0, now.getTime() - start.getTime());
  const daysElapsed = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const maxByTime = daysElapsed + 1;

  // Max by completion (allow opening currentDay or completedDaysCount + 1)
  const maxByCompletion = Math.max(
    current.profile.currentDay || 12,
    (current.profile.completedDaysCount || 0) + 1
  );

  return Math.min(60, Math.max(maxByTime, maxByCompletion));
}

/**
 * Returns live countdown until 12:00 AM midnight tonight
 */
export function getTimeUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0); // 12:00 AM midnight tonight

  const diffMs = Math.max(0, midnight.getTime() - now.getTime());
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  const pad = (n) => String(n).padStart(2, '0');
  const formatted = `${pad(hours)}h : ${pad(minutes)}m : ${pad(seconds)}s`;

  return { hours, minutes, seconds, formatted, diffMs };
}

export function isDayUnlocked(dayNum) {
  const maxUnlocked = getMaxUnlockedDay();
  return Number(dayNum) <= maxUnlocked;
}

export function submitDayProof(dayNum, githubRepo, githubCommit, linkedinUrl) {
  const current = getUserProgress();
  const dayIndex = current.challenges.findIndex(c => c.day === Number(dayNum));

  if (dayIndex !== -1) {
    const challenge = current.challenges[dayIndex];
    challenge.submitted = true;
    challenge.githubRepoUrl = githubRepo;
    challenge.githubCommitUrl = githubCommit;
    challenge.linkedinUrl = linkedinUrl;
    
    // Mark checklist items completed
    challenge.checklist = challenge.checklist.map(item => ({ ...item, completed: true }));
  }

  // Update profile metrics
  current.profile.currentStreak += 1;
  if (current.profile.currentStreak > current.profile.bestStreak) {
    current.profile.bestStreak = current.profile.currentStreak;
  }

  current.profile.completedDaysCount += 1;
  if (githubRepo || githubCommit) current.profile.githubProofsCount += 1;
  if (linkedinUrl) current.profile.linkedinPostsCount += 1;

  // Advance currentDay if completing today's challenge
  if (Number(dayNum) === current.profile.currentDay) {
    current.profile.currentDay = Math.min(60, Number(dayNum) + 1);
  }

  // Recalculate consistency score
  const total = current.profile.totalDays;
  const comp = Math.round((current.profile.completedDaysCount / total) * 100);
  current.profile.consistencyScore = Math.min(98, Math.max(70, comp + 10));

  saveUserProgress(current);
  return current;
}

export function toggleChecklistItem(dayNum, itemId) {
  const current = getUserProgress();
  const dayIndex = current.challenges.findIndex(c => c.day === Number(dayNum));

  if (dayIndex !== -1) {
    const challenge = current.challenges[dayIndex];
    challenge.checklist = challenge.checklist.map(item => {
      if (item.id === itemId) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });
    saveUserProgress(current);
  }
  return current;
}

export function rescueStreak() {
  const current = getUserProgress();
  current.profile.isStreakRescued = true;
  current.profile.currentStreak = (current.profile.currentStreak || 11) + 1;
  saveUserProgress(current);
  return current;
}

export function resetProgressToFirstDay() {
  const current = getUserProgress();
  const startDate = new Date(); // Reset start date to today
  current.profile.startDate = startDate.toISOString();
  current.profile.currentStreak = 0;
  current.profile.completedDaysCount = 0;
  current.profile.githubProofsCount = 0;
  current.profile.linkedinPostsCount = 0;
  current.profile.currentDay = 1;
  current.profile.missedDay = null;
  current.challenges = current.challenges.map(c => ({
    ...c,
    submitted: false,
    githubRepoUrl: '',
    githubCommitUrl: '',
    linkedinUrl: '',
    checklist: c.checklist.map(i => ({ ...i, completed: false }))
  }));
  saveUserProgress(current);
  return current;
}
