const storageService = require('../services/storageService');

// Helper to evaluate and add new achievements
const checkAchievements = (user) => {
  const newAchievements = [];
  const currentStreak = user.currentStreak;
  const totalCompleted = user.totalDaysCompleted;
  const unlockedIds = user.achievements.map((a) => a.id);
  const todayStr = new Date().toISOString().split('T')[0];

  if (totalCompleted >= 1 && !unlockedIds.includes('starter')) {
    newAchievements.push({
      id: 'starter',
      name: 'Starter',
      description: 'Completed your first daily challenge',
      icon: '🚀',
      unlockedAt: todayStr,
    });
  }

  if (currentStreak >= 7 && !unlockedIds.includes('first_week')) {
    newAchievements.push({
      id: 'first_week',
      name: 'First Week Complete',
      description: 'Completed 7 consecutive days of coding',
      icon: '🌟',
      unlockedAt: todayStr,
    });
  }

  if (currentStreak >= 10 && !unlockedIds.includes('double_digit')) {
    newAchievements.push({
      id: 'double_digit',
      name: 'Double Digits',
      description: 'Reached 10+ day streak',
      icon: '🔥',
      unlockedAt: todayStr,
    });
  }

  if (currentStreak >= 14 && !unlockedIds.includes('two_weeks')) {
    newAchievements.push({
      id: 'two_weeks',
      name: 'Two Weeks Strong',
      description: 'Maintained streak for 14 days',
      icon: '💪',
      unlockedAt: todayStr,
    });
  }

  if (currentStreak >= 30 && !unlockedIds.includes('one_month')) {
    newAchievements.push({
      id: 'one_month',
      name: 'One Month Warrior',
      description: '30 days of consistent coding',
      icon: '🏆',
      unlockedAt: todayStr,
    });
  }

  if (totalCompleted >= 60 && !unlockedIds.includes('champion')) {
    newAchievements.push({
      id: 'champion',
      name: '60-Day Champion',
      description: 'Completed the entire 60-day challenge!',
      icon: '👑',
      unlockedAt: todayStr,
    });
  }

  return newAchievements;
};

// @desc    Submit daily challenge completion
// @route   POST /api/submit
// @access  Public/Private
const submitChallenge = (req, res, next) => {
  try {
    const { userId, day, githubUrl, linkedinUrl } = req.body;

    if (!userId || day === undefined || !githubUrl || !linkedinUrl) {
      return res.status(400).json({ error: 'Missing required fields: userId, day, githubUrl, linkedinUrl' });
    }

    const numericDay = parseInt(day, 10);
    const users = storageService.getUsersData();
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[userIndex];

    // Check if day already submitted
    if (user.submissions && user.submissions.includes(numericDay)) {
      return res.status(400).json({ error: 'Day already submitted' });
    }

    // Initialize fields if absent
    if (!user.submissions) user.submissions = [];
    if (!user.achievements) user.achievements = [];

    // Add submission
    user.submissions.push(numericDay);
    user.totalDaysCompleted = user.submissions.length;

    // Update streak logic
    const todayStr = new Date().toISOString().split('T')[0];
    const lastSubmitStr = user.lastSubmitted;

    if (!lastSubmitStr) {
      user.currentStreak = 1;
    } else {
      const today = new Date(todayStr);
      const lastSubmit = new Date(lastSubmitStr);
      const diffDays = Math.floor((today - lastSubmit) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Same day submission, streak stays
      } else if (diffDays === 1) {
        user.currentStreak += 1;
      } else {
        user.currentStreak = 1;
      }
    }

    user.lastSubmitted = todayStr;

    if (user.currentStreak > (user.longestStreak || 0)) {
      user.longestStreak = user.currentStreak;
    }

    // Check and grant new achievements
    const newAchievements = checkAchievements(user);
    user.achievements = [...user.achievements, ...newAchievements];

    // Save submission link record
    if (!user.submissionHistory) user.submissionHistory = [];
    user.submissionHistory.push({
      day: numericDay,
      githubUrl,
      linkedinUrl,
      submittedAt: new Date().toISOString(),
    });

    // Save to storage
    const saved = storageService.saveUser(user);
    const { password, ...sanitizedUser } = user;

    if (saved) {
      res.json({
        success: true,
        user: sanitizedUser,
        newAchievements,
        message: 'Submission successful!',
      });
    } else {
      res.status(500).json({ error: 'Failed to save submission' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user submission history
// @route   GET /api/submissions/user/:userId
// @access  Public
const getUserSubmissions = (req, res, next) => {
  try {
    const user = storageService.getUserById(req.params.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      userId: user.id,
      completedDays: user.submissions || [],
      submissionHistory: user.submissionHistory || [],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitChallenge,
  getUserSubmissions,
};
