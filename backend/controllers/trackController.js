const storageService = require('../services/storageService');

// @desc    Get list of available tracks
// @route   GET /api/tracks
// @access  Public
const getTracks = (req, res, next) => {
  try {
    const data = storageService.getChallengesData();
    if (data) {
      res.json(Object.keys(data));
    } else {
      res.status(500).json({ error: 'Failed to fetch tracks' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTracks,
};
