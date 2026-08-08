// ABTALKS 2.0 LocalStorage Persistence Layer
import { INITIAL_USER_PROFILE, CHALLENGES, ACHIEVEMENTS } from '../data/mockData';

const STORAGE_KEY = 'ABTALKS_2_0_USER_PROGRESS';

export function getUserProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error loading progress from localStorage:', err);
  }

  // Initial default state
  const defaultData = {
    profile: { ...INITIAL_USER_PROFILE },
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
