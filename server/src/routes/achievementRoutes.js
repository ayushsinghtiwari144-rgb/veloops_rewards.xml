const express = require('express');
const achievementController = require('../controllers/achievementController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', requireAuth, achievementController.getAchievements);

module.exports = router;
