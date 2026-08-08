const express = require('express');
const {
  getUsers,
  getUserById,
  updateUser,
  getLeaderboard,
} = require('../controllers/userController');

const router = express.Router();

router.get('/', getUsers);
router.get('/leaderboard/top', getLeaderboard);
router.get('/:id', getUserById);
router.put('/:id', updateUser);

module.exports = router;
