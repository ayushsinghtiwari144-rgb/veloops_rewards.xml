const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Achievement title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Achievement description is required'],
      trim: true
    },
    badgeKey: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    icon: {
      type: String,
      default: 'Award'
    },
    pointsReward: {
      type: Number,
      default: 100
    },
    requirementType: {
      type: String,
      enum: ['REWARDS_REDEEMED', 'STREAK_DAYS', 'POINTS_EARNED', 'CHALLENGES_COMPLETED'],
      required: true
    },
    requirementValue: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Achievement', achievementSchema);
