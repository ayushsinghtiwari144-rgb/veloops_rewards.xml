const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['REWARD', 'CHALLENGE', 'POINTS', 'ACHIEVEMENT', 'SYSTEM'],
      default: 'SYSTEM',
      index: true
    },
    read: {
      type: Boolean,
      default: false,
      index: true
    },
    link: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
