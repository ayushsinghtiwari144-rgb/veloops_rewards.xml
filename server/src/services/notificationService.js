const { Notification } = require('../models');

const getUserNotifications = async (userId) => {
  const notifications = await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .limit(50);
  const unreadCount = await Notification.countDocuments({ userId, read: false });
  return { unreadCount, notifications };
};

const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { read: true },
    { new: true }
  );
  return notification;
};

const markAllAsRead = async (userId) => {
  await Notification.updateMany({ userId, read: false }, { read: true });
  return true;
};

module.exports = {
  getUserNotifications,
  markAsRead,
  markAllAsRead
};
