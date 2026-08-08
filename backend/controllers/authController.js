const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const storageService = require('../services/storageService');

const JWT_SECRET = process.env.JWT_SECRET || 'abtalks_secret_key_2026_jwt_token_secure';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, college, track } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide name, email, and password' });
    }

    const users = storageService.getUsersData();
    const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: `user_${Date.now()}`,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      college: college || 'Other',
      track: track || 'Full Stack Development',
      currentStreak: 0,
      longestStreak: 0,
      totalDaysCompleted: 0,
      totalDays: 60,
      startDate: new Date().toISOString().split('T')[0],
      lastSubmitted: null,
      submissions: [],
      achievements: [
        {
          id: 'welcome',
          name: 'Joined Challenge',
          description: 'Welcome to the ABTalks 60-Day Challenge!',
          icon: '🚀',
          unlockedAt: new Date().toISOString().split('T')[0],
        },
      ],
    };

    storageService.saveUser(newUser);

    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      token: generateToken(newUser.id),
      user: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide email and password' });
    }

    const users = storageService.getUsersData();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    let isMatch = false;
    if (user.password) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      // Demo fallback for existing users in seed data without hashed password
      isMatch = true;
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      token: generateToken(user.id),
      user: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = storageService.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    const { password: _, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
