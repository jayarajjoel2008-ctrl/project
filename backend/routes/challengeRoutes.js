const express = require('express');
const {
  getAllChallenges,
  getChallengesByTrack,
  getDayChallenge,
} = require('../controllers/challengeController');

const router = express.Router();

router.get('/', getAllChallenges);
router.get('/:track', getChallengesByTrack);
router.get('/:track/:day', getDayChallenge);

module.exports = router;
