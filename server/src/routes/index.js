const express = require('express');
const healthRoutes = require('./healthRoutes');
const authRoutes = require('./authRoutes');
const giveawayRoutes = require('./giveawayRoutes');
const adminRoutes = require('./adminRoutes');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/giveaways', giveawayRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
