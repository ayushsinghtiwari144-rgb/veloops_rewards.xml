const mongoose = require('mongoose');

const userAchievementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    achievementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Achievement',
      required: true,
      index: true
    },
    unlocked: {
      type: Boolean,
      default: false
    },
    unlockedAt: {
      type: Date
    },
    progress: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

userAchievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });

module.exports = mongoose.model('UserAchievement', userAchievementSchema);
