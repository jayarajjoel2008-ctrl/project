const express = require('express');
const { getTracks } = require('../controllers/trackController');

const router = express.Router();

router.get('/', getTracks);

module.exports = router;
