const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const USERS_PATH = path.join(DATA_DIR, 'users.json');
const CHALLENGES_PATH = path.join(DATA_DIR, 'challenges.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Default Seed Data
const DEFAULT_USERS = {
  users: [
    {
      id: "user_1",
      name: "Priya Sharma",
      email: "priya@example.com",
      college: "IIT Bombay",
      track: "Full Stack Development",
      currentStreak: 12,
      longestStreak: 15,
      totalDaysCompleted: 12,
      totalDays: 60,
      startDate: "2024-01-15",
      lastSubmitted: "2024-01-27",
      submissions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      achievements: [
        {
          id: "first_week",
          name: "First Week Complete",
          description: "Completed 7 days of coding",
          icon: "🌟",
          unlockedAt: "2024-01-22"
        },
        {
          id: "double_digit",
          name: "Double Digits",
          description: "Reached 10+ day streak",
          icon: "🔥",
          unlockedAt: "2024-01-25"
        }
      ]
    }
  ]
};

const DEFAULT_CHALLENGES = {
  challenges: {
    "Full Stack Development": {
      days: [
        {
          day: 1,
          title: "Build Your Personal Portfolio Website",
          description: "Create a responsive personal portfolio website using HTML, CSS, and JavaScript.",
          requirements: ["Semantic HTML5", "Flexbox/Grid layout", "JS Interactive element"],
          resources: ["https://developer.mozilla.org"],
          difficulty: "Beginner",
          estimatedTime: "2-3 hours"
        },
        {
          day: 12,
          title: "Build a REST API with Express",
          description: "Create a clean REST API with Node.js and Express.",
          requirements: ["Implement GET and POST endpoints", "Validate JSON payload"],
          resources: ["https://expressjs.com"],
          difficulty: "Intermediate",
          estimatedTime: "3-4 hours"
        }
      ]
    }
  }
};

// Safely read JSON file with auto-seeding
const readJSON = (filePath, defaultData = null) => {
  try {
    if (!fs.existsSync(filePath)) {
      if (defaultData) {
        writeJSON(filePath, defaultData);
        return defaultData;
      }
      return null;
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`[StorageService] Error reading file ${filePath}:`, error.message);
    if (defaultData) {
      writeJSON(filePath, defaultData);
      return defaultData;
    }
    return null;
  }
};

// Safely write JSON file
const writeJSON = (filePath, data) => {
  try {
    const tempPath = `${filePath}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tempPath, filePath);
    return true;
  } catch (error) {
    console.error(`[StorageService] Error writing file ${filePath}:`, error.message);
    return false;
  }
};

// User data methods
const getUsersData = () => {
  const data = readJSON(USERS_PATH, DEFAULT_USERS);
  return data ? data.users : DEFAULT_USERS.users;
};

const saveUsersData = (users) => {
  return writeJSON(USERS_PATH, { users });
};

const getUserById = (id) => {
  const users = getUsersData();
  return users.find((u) => u.id === id || u.email === id);
};

const saveUser = (userData) => {
  const users = getUsersData();
  const index = users.findIndex((u) => u.id === userData.id);
  if (index !== -1) {
    users[index] = { ...users[index], ...userData };
  } else {
    users.push(userData);
  }
  saveUsersData(users);
  return userData;
};

// Challenge data methods
const getChallengesData = () => {
  const data = readJSON(CHALLENGES_PATH, DEFAULT_CHALLENGES);
  return data ? data.challenges : DEFAULT_CHALLENGES.challenges;
};

const getTrackChallenges = (track) => {
  const challenges = getChallengesData();
  return challenges[track] || null;
};

const getDayChallenge = (track, day) => {
  const trackData = getTrackChallenges(track);
  if (!trackData || !trackData.days) return null;
  return trackData.days.find((d) => d.day === parseInt(day, 10));
};

module.exports = {
  USERS_PATH,
  CHALLENGES_PATH,
  readJSON,
  writeJSON,
  getUsersData,
  saveUsersData,
  getUserById,
  saveUser,
  getChallengesData,
  getTrackChallenges,
  getDayChallenge,
};
