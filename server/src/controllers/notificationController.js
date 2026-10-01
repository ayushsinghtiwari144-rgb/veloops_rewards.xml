const notificationService = require('../services/notificationService');
const { successResponse } = require('../utils/apiResponse');

/**
 * GET /api/notifications
 * Fetch user notifications and unread count
 */
const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const data = await notificationService.getUserNotifications(userId);
    return successResponse(res, data, 'Notifications retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/notifications/:id/read
 * Mark single notification as read
 */
const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const notification = await notificationService.markAsRead(id, userId);
    return successResponse(res, notification, 'Notification marked as read');
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/notifications/read-all
 * Mark all user notifications as read
 */
const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user._id;
    await notificationService.markAllAsRead(userId);
    return successResponse(res, { success: true }, 'All notifications marked as read');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead
};
