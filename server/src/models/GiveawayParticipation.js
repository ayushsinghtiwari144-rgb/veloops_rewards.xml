const mongoose = require('mongoose');

const giveawayParticipationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    giveawayId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Giveaway',
      required: true,
      index: true
    },
    prizeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prize',
      default: null
    },
    entryCurrency: {
      type: String,
      default: 'VELOOP Points'
    },
    entryAmount: {
      type: Number,
      required: true,
      min: 0
    },
    deviceHash: {
      type: String,
      default: null,
      index: true
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'COMPLETED', 'BLOCKED', 'CANCELLED'],
      default: 'ACTIVE',
      index: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GiveawayEntryTransaction',
      default: null
    }
  },
  {
    timestamps: true
  }
);

// CRITICAL SECURITY INDEX: Enforces ONE PARTICIPATION PER USER PER GIVEAWAY at DB level
giveawayParticipationSchema.index({ userId: 1, giveawayId: 1 }, { unique: true });

module.exports = mongoose.model('GiveawayParticipation', giveawayParticipationSchema);
