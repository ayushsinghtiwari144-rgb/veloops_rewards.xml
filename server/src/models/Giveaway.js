const mongoose = require('mongoose');

const giveawaySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Giveaway title is required'],
      trim: true
    },
    slug: {
      type: String,
      required: [true, 'Giveaway slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    description: {
      type: String,
      required: [true, 'Giveaway description is required']
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'ENDED', 'UPCOMING'],
      default: 'UPCOMING',
      index: true
    },
    startDate: {
      type: Date,
      required: true,
      index: true
    },
    endDate: {
      type: Date,
      required: true,
      index: true
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
    eligibility: {
      type: String,
      default: 'Open to all verified platform accounts.'
    },
    rules: {
      type: [String],
      default: []
    },
    terms: {
      type: String,
      default: 'Standard VELOOP Rewards terms and conditions apply.'
    },
    winnerCount: {
      type: Number,
      default: 1,
      min: 1
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index for querying active giveaways within dates
giveawaySchema.index({ status: 1, isActive: 1, startDate: 1, endDate: 1 });

module.exports = mongoose.model('Giveaway', giveawaySchema);
