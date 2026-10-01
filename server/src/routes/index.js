const express = require('express');
const healthRoutes = require('./healthRoutes');
const authRoutes = require('./authRoutes');
const giveawayRoutes = require('./giveawayRoutes');
const adminRoutes = require('./adminRoutes');

const giveawayController = require('../controllers/giveawayController');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'VELOOP Rewards API Gateway',
    endpoints: {
      health: '/api/health',
      currentGiveaways: '/api/giveaways/current',
      previousWinners: '/api/giveaways/previous/winners',
      seedDatabase: '/api/seed'
    }
  });
});

router.all('/seed', giveawayController.seedDatabase);
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/giveaways', giveawayRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
