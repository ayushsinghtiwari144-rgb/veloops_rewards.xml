const express = require('express');
const notificationController = require('../controllers/notificationController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', requireAuth, notificationController.getNotifications);
router.put('/read-all', requireAuth, notificationController.markAllAsRead);
router.put('/:id/read', requireAuth, notificationController.markAsRead);

module.exports = router;
