// ABTALKS 2.0 LocalStorage Persistence Layer with Midnight 12:00 AM Unlock System
import { INITIAL_USER_PROFILE, CHALLENGES, ACHIEVEMENTS } from '../data/mockData';

const STORAGE_KEY = 'ABTALKS_2_0_USER_PROGRESS';

export function getUserProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data?.profile && data.profile.name !== 'Arvind') {
        data.profile.name = 'Arvind';
      }
      
      // Calculate actual completed count from submitted challenges (e.g. 11)
      if (data.challenges && Array.isArray(data.challenges)) {
        const actualSubmitted = data.challenges.filter(c => c.submitted).length;
        data.profile.completedDaysCount = actualSubmitted;
      }

      const evaluated = evaluateAchievements(data);
      if (!data.profile.startDate) {
        const defaultStart = new Date();
        defaultStart.setDate(defaultStart.getDate() - 11);
        evaluated.profile.startDate = defaultStart.toISOString();
      }
      saveUserProgress(evaluated);
      return evaluated;
    }
  } catch (err) {
    console.error('Error loading progress from localStorage:', err);
  }

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 11);

  const defaultData = evaluateAchievements({
    profile: { 
      ...INITIAL_USER_PROFILE, 
      startDate: startDate.toISOString() 
    },
    challenges: [...CHALLENGES],
    achievements: [...ACHIEVEMENTS]
  });

  saveUserProgress(defaultData);
  return defaultData;
}

export function evaluateAchievements(data) {
  if (!data || !data.profile || !data.achievements) return data;

  const currentStreak = data.profile.currentStreak || 0;
  const completedDaysCount = data.profile.completedDaysCount || 0;
  const linkedinPostsCount = data.profile.linkedinPostsCount || 0;
  const githubProofsCount = data.profile.githubProofsCount || 0;

  // Merge any new default achievements into stored list if missing
  const existingIds = data.achievements.map(a => a.id);
  ACHIEVEMENTS.forEach(defaultAch => {
    if (!existingIds.includes(defaultAch.id)) {
      data.achievements.push({ ...defaultAch });
    }
  });

  data.achievements = data.achievements.map(ach => {
    const defaultMatch = ACHIEVEMENTS.find(a => a.id === ach.id);
    const updatedTitle = defaultMatch ? defaultMatch.title : ach.title;

    let shouldUnlock = false;

    if (ach.id === 'streak-7') shouldUnlock = currentStreak >= 7;
    if (ach.id === 'builds-10') shouldUnlock = completedDaysCount >= 10;
    if (ach.id === 'posts-10') shouldUnlock = linkedinPostsCount >= 10;
    if (ach.id === 'milestone-15') shouldUnlock = completedDaysCount >= 15;
    if (ach.id === 'milestone-30') shouldUnlock = completedDaysCount >= 30;
    if (ach.id === 'milestone-45') shouldUnlock = completedDaysCount >= 45;
    if (ach.id === 'github-builder') shouldUnlock = githubProofsCount >= 40;
    if (ach.id === 'mastery-60') shouldUnlock = completedDaysCount >= 60;

    return { 
      ...ach, 
      title: updatedTitle,
      unlocked: shouldUnlock,
      claimed: shouldUnlock ? Boolean(ach.claimed) : false
    };
  });

  return data;
}

export function saveUserProgress(data) {
  try {
    const evaluated = evaluateAchievements(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(evaluated));
  } catch (err) {
    console.error('Error saving progress to localStorage:', err);
  }
}

/**
 * Returns the highest completed day number (e.g., 12)
 */
export function getLastCompletedDay() {
  const current = getUserProgress();
  const completedDays = current.challenges
    .filter(c => c.submitted)
    .map(c => c.day);

  if (completedDays.length === 0) return 0;
  return Math.max(...completedDays);
}

/**
 * Calculates max unlocked day based on start date and completed days.
 * Day N unlocks at 12:00 AM Midnight after Day N-1 is completed.
 */
export function getMaxUnlockedDay() {
  const current = getUserProgress();
  const start = new Date(current.profile?.startDate || Date.now());
  const now = new Date();

  // Midnight-based days elapsed since challenge start date
  const diffTime = Math.max(0, now.getTime() - start.getTime());
  const daysElapsedByTime = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const lastCompleted = getLastCompletedDay();

  // If user completed up to lastCompleted (e.g. Day 11),
  // Day 12 unlocks at 12:00 AM Midnight (daysElapsedByTime > lastCompleted).
  if (daysElapsedByTime > lastCompleted) {
    return Math.min(60, lastCompleted + 1);
  }

  // Otherwise, Day 12 remains locked until 12:00 AM Midnight tonight!
  return Math.max(1, lastCompleted);
}

/**
 * Checks if a specific day level is unlocked.
 * Level 1 is always unlocked.
 * Level N (N > 1) unlocks at 12:00 AM Midnight only after Level N-1 is completed.
 */
export function isDayUnlocked(dayNum) {
  const num = Number(dayNum);
  if (num === 1) return true;

  const current = getUserProgress();
  const prevChallenge = current.challenges.find(c => c.day === num - 1);
  
  // Requires previous level to be submitted
  const prevSubmitted = prevChallenge ? prevChallenge.submitted : false;
  const maxUnlocked = getMaxUnlockedDay();

  return prevSubmitted && num <= maxUnlocked;
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

export function claimAchievement(achievementId) {
  const current = getUserProgress();
  const index = current.achievements.findIndex(a => a.id === achievementId);

  if (index !== -1 && current.achievements[index].unlocked) {
    current.achievements[index].claimed = true;
    current.achievements[index].claimedAt = new Date().toLocaleDateString();
    
    // Add XP points to profile
    const pts = current.achievements[index].points || 150;
    current.profile.totalXp = (current.profile.totalXp || 1250) + pts;
    
    saveUserProgress(current);
  }
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
