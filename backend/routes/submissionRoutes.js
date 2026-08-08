const express = require('express');
const {
  submitChallenge,
  getUserSubmissions,
} = require('../controllers/submissionController');

const router = express.Router();

router.post('/submit', submitChallenge);
router.get('/submissions/user/:userId', getUserSubmissions);

module.exports = router;
