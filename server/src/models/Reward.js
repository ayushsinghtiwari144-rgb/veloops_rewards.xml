const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Reward title is required'],
      trim: true
    },
    slug: {
      type: String,
      required: [true, 'Reward slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    description: {
      type: String,
      required: [true, 'Reward description is required'],
      trim: true
    },
    category: {
      type: String,
      enum: ['ELECTRONICS', 'GIFT_CARDS', 'WEARABLES', 'AUDIO', 'GAMING', 'OTHER'],
      default: 'ELECTRONICS',
      index: true
    },
    pointsRequired: {
      type: Number,
      required: [true, 'Points required is required'],
      min: [1, 'Points required must be at least 1']
    },
    stock: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative'],
      default: 10
    },
    imageUrl: {
      type: String,
      required: [true, 'Reward image URL is required']
    },
    itemType: {
      type: String,
      enum: ['PHYSICAL', 'DIGITAL'],
      default: 'PHYSICAL'
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'OUT_OF_STOCK', 'INACTIVE'],
      default: 'ACTIVE',
      index: true
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Reward', rewardSchema);
