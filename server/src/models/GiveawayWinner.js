const mongoose = require('mongoose');

const giveawayWinnerSchema = new mongoose.Schema(
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
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    selectionMethod: {
      type: String,
      enum: ['RANDOM', 'ADMIN'],
      default: 'RANDOM'
    },
    selectedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['SELECTED', 'CLAIMED', 'FULFILLED', 'DISQUALIFIED'],
      default: 'SELECTED',
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Unique compound index to prevent duplicate winner records per giveaway & user
giveawayWinnerSchema.index({ giveawayId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('GiveawayWinner', giveawayWinnerSchema);
