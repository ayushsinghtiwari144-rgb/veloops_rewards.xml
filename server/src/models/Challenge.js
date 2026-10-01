const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Challenge title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Challenge description is required'],
      trim: true
    },
    category: {
      type: String,
      enum: ['DAILY', 'WEEKLY', 'SPECIAL'],
      default: 'DAILY',
      index: true
    },
    pointsReward: {
      type: Number,
      required: [true, 'Points reward is required'],
      min: [1, 'Points reward must be at least 1']
    },
    actionType: {
      type: String,
      enum: ['LOGIN', 'PROFILE_UPDATE', 'REFERRAL', 'COMMUNITY', 'REDEEM_REWARD', 'DAILY_ACTIVITY'],
      required: true
    },
    targetCount: {
      type: Number,
      default: 1
    },
    icon: {
      type: String,
      default: 'Zap'
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Challenge', challengeSchema);
