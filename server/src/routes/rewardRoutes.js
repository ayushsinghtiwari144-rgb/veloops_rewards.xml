const express = require('express');
const rewardController = require('../controllers/rewardController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/rewards - List store rewards
router.get('/', rewardController.getRewards);

// GET /api/rewards/:id - Single reward details
router.get('/:id', rewardController.getRewardById);

// POST /api/rewards/:id/redeem - Redeem reward (Server-side validation)
router.post('/:id/redeem', requireAuth, rewardController.redeemReward);

module.exports = router;
