/**
 * Utility helper functions for the ABTalks application
 */

/**
 * Format a date string to a readable format
 * @param {string} dateString - The date string to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

/**
 * Check if a challenge is overdue
 * @param {string} dueDate - The due date of the challenge
 * @returns {boolean} - True if the challenge is overdue
 */
export const isOverdue = (dueDate) => {
  return new Date(dueDate) < new Date();
};

/**
 * Calculate days remaining until a challenge deadline
 * @param {string} dueDate - The due date of the challenge
 * @returns {number} - Number of days remaining
 */
export const daysRemaining = (dueDate) => {
  const due = new Date(dueDate);
  const today = new Date();
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Get difficulty level color
 * @param {string} difficulty - The difficulty level
 * @returns {string} - Color code for the difficulty
 */
export const getDifficultyColor = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return '#4caf50';
    case 'medium':
      return '#ff9800';
    case 'hard':
      return '#f44336';
    default:
      return '#9e9e9e';
  }
};
