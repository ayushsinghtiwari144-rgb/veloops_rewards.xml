const mongoose = require('mongoose');

const rewardRedemptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    rewardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reward',
      required: true,
      index: true
    },
    pointsSpent: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'FULFILLED', 'CANCELLED'],
      default: 'FULFILLED',
      index: true
    },
    shippingAddress: {
      type: String,
      trim: true
    },
    digitalCode: {
      type: String,
      trim: true
    },
    notes: {
      type: String,
      trim: true
    },
    redeemedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('RewardRedemption', rewardRedemptionSchema);
