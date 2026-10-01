const express = require('express');
const adminController = require('../controllers/adminController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/authorizationMiddleware');

const router = express.Router();

// Apply auth & admin guard to all admin routes
router.use(requireAuth, requireAdmin);

router.get('/stats', adminController.getAdminStats);
router.post('/rewards', adminController.createReward);
router.put('/rewards/:id', adminController.updateReward);
router.delete('/rewards/:id', adminController.deleteReward);
router.get('/redemptions', adminController.getAllRedemptions);
router.put('/redemptions/:id/status', adminController.updateRedemptionStatus);
router.get('/users', adminController.getAllUsers);
router.post('/users/:id/points', adminController.adjustUserPoints);

module.exports = router;
