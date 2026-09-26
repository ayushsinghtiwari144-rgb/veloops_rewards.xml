const mongoose = require('mongoose');

const fraudEventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    giveawayId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Giveaway',
      default: null,
      index: true
    },
    deviceHash: {
      type: String,
      default: null,
      index: true
    },
    riskScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      index: true
    },
    reason: {
      type: String,
      required: true
    },
    signals: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    action: {
      type: String,
      enum: ['ALLOW', 'FLAG', 'BLOCK'],
      default: 'ALLOW',
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index for querying fraud logs by user and date
fraudEventSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('FraudEvent', fraudEventSchema);
