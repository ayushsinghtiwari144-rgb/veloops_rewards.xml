const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters']
    },
    email: {
      type: String,
      required: [true, 'User email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
      index: true
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'BLOCKED'],
      default: 'ACTIVE',
      index: true
    },
    pointsBalance: {
      type: Number,
      default: 500,
      min: 0
    },
    level: {
      type: Number,
      default: 1,
      min: 1
    },
    xp: {
      type: Number,
      default: 100,
      min: 0
    },
    streakDays: {
      type: Number,
      default: 1,
      min: 0
    },
    lastLoginDate: {
      type: Date,
      default: Date.now
    },
    avatarUrl: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Helper method to format safe public user JSON
userSchema.methods.toSafeObject = function () {
  const nextLevelXp = this.level * 500;
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    role: this.role,
    status: this.status,
    pointsBalance: this.pointsBalance,
    level: this.level,
    xp: this.xp,
    nextLevelXp,
    streakDays: this.streakDays,
    lastLoginDate: this.lastLoginDate,
    avatarUrl: this.avatarUrl,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('User', userSchema);
