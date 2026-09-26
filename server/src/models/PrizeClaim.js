const mongoose = require('mongoose');

const prizeClaimSchema = new mongoose.Schema(
  {
    giveawayId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Giveaway',
      required: true,
      index: true
    },
    prizeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prize',
      required: true
    },
    winnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GiveawayWinner',
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    prizeType: {
      type: String,
      enum: ['PHYSICAL', 'GIFT_CARD', 'DIGITAL'],
      required: true
    },
    claimStatus: {
      type: String,
      enum: ['PENDING', 'SUBMITTED', 'VERIFIED', 'FULFILLED', 'REJECTED'],
      default: 'PENDING',
      index: true
    },
    // Sensitive personal information - MUST BE PROTECTED AND EXCLUDED FROM PUBLIC API
    name: { type: String, select: false },
    phone: { type: String, select: false },
    address: { type: String, select: false },
    city: { type: String, select: false },
    state: { type: String, select: false },
    pinCode: { type: String, select: false },
    email: { type: String, select: false },
    submittedAt: { type: Date, default: null }
  },
  {
    timestamps: true
  }
);

// Prevent multiple claim documents per winner
prizeClaimSchema.index({ winnerId: 1 }, { unique: true });

module.exports = mongoose.model('PrizeClaim', prizeClaimSchema);
