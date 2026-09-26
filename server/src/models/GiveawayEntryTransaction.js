const mongoose = require('mongoose');

const giveawayEntryTransactionSchema = new mongoose.Schema(
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
    participationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GiveawayParticipation',
      default: null
    },
    currency: {
      type: String,
      default: 'VELOOP Points'
    },
    amount: {
      type: Number,
      required: true
    },
    transactionType: {
      type: String,
      enum: ['ENTRY_FEE_DEDUCTED', 'ENTRY_REFUNDED'],
      required: true
    },
    status: {
      type: String,
      enum: ['PENDING', 'COMPLETED', 'FAILED'],
      default: 'PENDING',
      index: true
    },
    requestId: {
      type: String,
      default: null,
      index: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('GiveawayEntryTransaction', giveawayEntryTransactionSchema);
