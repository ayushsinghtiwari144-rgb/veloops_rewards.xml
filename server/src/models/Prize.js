const mongoose = require('mongoose');

const prizeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Prize name is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Prize description is required']
    },
    image: {
      type: String,
      required: [true, 'Prize image or visual identifier is required']
    },
    prizeType: {
      type: String,
      enum: ['PHYSICAL', 'GIFT_CARD', 'DIGITAL'],
      default: 'PHYSICAL',
      index: true
    },
    value: {
      type: Number,
      default: 0,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Prize', prizeSchema);
