const storageService = require('../services/storageService');

// @desc    Get all users
// @route   GET /api/users
// @access  Public
const getUsers = (req, res, next) => {
  try {
    const users = storageService.getUsersData();
    const sanitizedUsers = users.map(({ password, ...u }) => u);
    res.json(sanitizedUsers);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Public
const getUserById = (req, res, next) => {
  try {
    const user = storageService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { password, ...sanitizedUser } = user;
    res.json(sanitizedUser);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Public/Private
const updateUser = (req, res, next) => {
  try {
    const user = storageService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const { name, college, track } = req.body;
    if (name) user.name = name;
    if (college) user.college = college;
    if (track) user.track = track;

    storageService.saveUser(user);
    const { password, ...sanitizedUser } = user;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: sanitizedUser,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get leaderboard
// @route   GET /api/users/leaderboard/top
// @access  Public
const getLeaderboard = (req, res, next) => {
  try {
    const users = storageService.getUsersData();
    const sorted = users
      .map(({ password, ...u }) => u)
      .sort((a, b) => {
        if (b.currentStreak !== a.currentStreak) {
          return b.currentStreak - a.currentStreak;
        }
        return b.totalDaysCompleted - a.totalDaysCompleted;
      });

    res.json({
      success: true,
      count: sorted.length,
      leaderboard: sorted,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  getLeaderboard,
};
