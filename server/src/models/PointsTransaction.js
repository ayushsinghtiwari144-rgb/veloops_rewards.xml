const mongoose = require('mongoose');

const pointsTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ['EARNED', 'REDEEMED', 'DAILY_BONUS', 'CHALLENGE_REWARD', 'ACHIEVEMENT_REWARD', 'ADMIN_ADJUSTMENT'],
      required: true,
      index: true
    },
    amount: {
      type: Number,
      required: true
    },
    balanceAfter: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    referenceId: {
      type: String
    },
    referenceType: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('PointsTransaction', pointsTransactionSchema);
