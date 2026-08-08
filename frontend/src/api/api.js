import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API Functions connecting to Express Backend
export const getUsers = () => api.get('/users');
export const getUser = (id) => api.get(`/users/${id}`);
export const getChallenges = (track = 'Full Stack Development') => api.get(`/challenges/${encodeURIComponent(track)}`);
export const getDayChallenge = (track = 'Full Stack Development', day = 1) => api.get(`/challenges/${encodeURIComponent(track)}/${day}`);
export const submitChallenge = (data) => api.post('/submit', data);
export const getTracks = () => api.get('/tracks');
export const getLeaderboard = () => api.get('/users/leaderboard/top');

// Fallback Mock Data in case backend is offline
export const getMockUser = () => {
  return {
    id: 'user_1',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    college: 'IIT Bombay',
    track: 'Full Stack Development',
    currentStreak: 12,
    longestStreak: 15,
    totalDaysCompleted: 12,
    totalDays: 60,
    startDate: '2024-01-15',
    lastSubmitted: '2024-01-27',
    submissions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    achievements: [
      {
        id: 'first_week',
        name: 'First Week Complete',
        description: 'Completed 7 days of coding',
        icon: '🌟',
        unlockedAt: '2024-01-22'
      },
      {
        id: 'double_digit',
        name: 'Double Digits',
        description: 'Reached 10+ day streak',
        icon: '🔥',
        unlockedAt: '2024-01-25'
      }
    ]
  };
};

export const fetchUserWithFallback = async (userId = 'user_1') => {
  try {
    const response = await getUser(userId);
    return response.data.user || response.data;
  } catch (error) {
    console.warn('API call failed, fallback to mock user data:', error.message);
    return getMockUser();
  }
};

export const fetchChallengesWithFallback = async (track = 'Full Stack Development') => {
  try {
    const response = await getChallenges(track);
    return response.data.days || response.data;
  } catch (error) {
    console.warn('API call failed, fallback to mock challenges:', error.message);
    return [];
  }
};

export const fetchChallengeWithFallback = async (track = 'Full Stack Development', day = 1) => {
  try {
    const response = await getDayChallenge(track, day);
    return response.data;
  } catch (error) {
    console.warn('API call failed, fallback to mock single day challenge:', error.message);
    return {
      day: parseInt(day, 10),
      title: `Day ${day}: Build Your Portfolio Website`,
      description: 'Create a responsive web application and submit your proof of work.',
      requirements: ['Implement responsive layout', 'Add interactive elements', 'Deploy to GitHub'],
      resources: ['https://developer.mozilla.org']
    };
  }
};

export default api;