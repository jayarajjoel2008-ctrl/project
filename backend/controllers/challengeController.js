const storageService = require('../services/storageService');

// @desc    Get all challenges grouped by track
// @route   GET /api/challenges
// @access  Public
const getAllChallenges = (req, res, next) => {
  try {
    const data = storageService.getChallengesData();
    // Support frontend expecting array of challenges default to Full Stack
    const defaultTrack = req.query.track || 'Full Stack Development';
    if (data[defaultTrack]) {
      return res.json(data[defaultTrack].days);
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
};

// @desc    Get challenges for a specific track
// @route   GET /api/challenges/:track
// @access  Public
const getChallengesByTrack = (req, res, next) => {
  try {
    const { track } = req.params;
    const trackData = storageService.getTrackChallenges(track);

    if (trackData) {
      res.json(trackData);
    } else {
      res.status(404).json({ error: 'Track not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get specific day challenge for a track
// @route   GET /api/challenges/:track/:day
// @access  Public
const getDayChallenge = (req, res, next) => {
  try {
    const { track, day } = req.params;
    const challenge = storageService.getDayChallenge(track, day);

    if (challenge) {
      res.json(challenge);
    } else {
      res.status(404).json({ error: 'Day challenge not found' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllChallenges,
  getChallengesByTrack,
  getDayChallenge,
};
