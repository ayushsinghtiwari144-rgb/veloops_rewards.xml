const express = require('express');
const healthRoutes = require('./healthRoutes');
const authRoutes = require('./authRoutes');
const rewardRoutes = require('./rewardRoutes');
const challengeRoutes = require('./challengeRoutes');
const leaderboardRoutes = require('./leaderboardRoutes');
const achievementRoutes = require('./achievementRoutes');
const transactionRoutes = require('./transactionRoutes');
const notificationRoutes = require('./notificationRoutes');
const adminRoutes = require('./adminRoutes');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'VELOOP Rewards Hub API Gateway',
    endpoints: {
      health: '/api/health',
      rewards: '/api/rewards',
      challenges: '/api/challenges',
      leaderboard: '/api/leaderboard',
      achievements: '/api/achievements',
      transactions: '/api/transactions',
      notifications: '/api/notifications',
      admin: '/api/admin'
    }
  });
});

// Seed shortcut route
router.all('/seed', async (req, res, next) => {
  try {
    const { runSeeder } = require('../../seed/seedHubData');
    const result = await runSeeder();
    return res.json({
      success: true,
      message: 'VELOOP Rewards Hub seeded successfully!',
      data: result
    });
  } catch (err) {
    next(err);
  }
});

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/rewards', rewardRoutes);
router.use('/challenges', challengeRoutes);
router.use('/leaderboard', leaderboardRoutes);
router.use('/achievements', achievementRoutes);
router.use('/transactions', transactionRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
