const mongoose = require('mongoose');

const giveawayPrizeSchema = new mongoose.Schema(
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
      required: true,
      index: true
    },
    position: {
      type: Number,
      default: 1,
      min: 1
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1
    }
  },
  {
    timestamps: true
  }
);

// Compound index to ensure uniqueness per giveaway position
giveawayPrizeSchema.index({ giveawayId: 1, prizeId: 1, position: 1 }, { unique: true });

module.exports = mongoose.model('GiveawayPrize', giveawayPrizeSchema);
