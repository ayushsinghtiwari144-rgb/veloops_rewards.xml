const bcrypt = require('bcryptjs');
const { User, PointsTransaction, Notification } = require('../models');
const { getDbStatus } = require('../config/db');
const { AppError } = require('../middleware/errorMiddleware');
const { generateAccessToken, generateRefreshToken } = require('../utils/tokenUtils');

/**
 * Register a new user
 */
const registerUser = async ({ name, email, password }) => {
  if (getDbStatus() !== 'connected') {
    throw new AppError('Database connection unavailable. Please ensure MongoDB service is started.', 'DATABASE_UNAVAILABLE', 503);
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Check for duplicate email
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new AppError('An account with this email address already exists.', 'EMAIL_ALREADY_EXISTS', 400);
  }

  // Hash password using bcrypt salt factor 10
  const passwordHash = await bcrypt.hash(password, 10);

  // Create user with 500 starter points
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    role: 'USER',
    status: 'ACTIVE',
    pointsBalance: 500,
    level: 1,
    xp: 100,
    streakDays: 1,
    lastLoginDate: new Date()
  });

  // Log initial starter points transaction
  await PointsTransaction.create({
    userId: user._id,
    type: 'DAILY_BONUS',
    amount: 500,
    balanceAfter: 500,
    description: 'Welcome Bonus: 500 VE Points'
  });

  // Welcome Notification
  await Notification.create({
    userId: user._id,
    title: '🎉 Welcome to VELOOP Rewards Hub!',
    message: 'Your account is ready with +500 starter VE Points! Explore rewards, complete daily challenges, and rank on the leaderboard.',
    type: 'SYSTEM'
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    user: user.toSafeObject(),
    accessToken,
    refreshToken
  };
};

/**
 * Authenticate existing user login with daily streak check
 */
const loginUser = async ({ email, password }) => {
  if (getDbStatus() !== 'connected') {
    throw new AppError('Database connection unavailable. Please ensure MongoDB service is started.', 'DATABASE_UNAVAILABLE', 503);
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');
  
  if (!user) {
    throw new AppError('Invalid email or password.', 'INVALID_CREDENTIALS', 401);
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new AppError('Invalid email or password.', 'INVALID_CREDENTIALS', 401);
  }

  if (user.status === 'BLOCKED') {
    throw new AppError('Your account has been suspended or blocked.', 'ACCOUNT_BLOCKED', 403);
  }

  // Check login streak
  const now = new Date();
  const lastLogin = new Date(user.lastLoginDate || now);
  const diffDays = Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 3600 * 24));

  if (diffDays === 1) {
    user.streakDays += 1;
  } else if (diffDays > 1) {
    user.streakDays = 1;
  }
  user.lastLoginDate = now;
  await user.save();

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    user: user.toSafeObject(),
    accessToken,
    refreshToken
  };
};

/**
 * Fetch current authenticated user by ID
 */
const getCurrentUser = async (userId) => {
  if (getDbStatus() !== 'connected') {
    throw new AppError('Database connection unavailable. Please ensure MongoDB service is started.', 'DATABASE_UNAVAILABLE', 503);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found.', 'INVALID_REQUEST', 404);
  }

  if (user.status === 'BLOCKED') {
    throw new AppError('Your account has been suspended or blocked.', 'ACCOUNT_BLOCKED', 403);
  }

  return user.toSafeObject();
};

/**
 * Update user profile
 */
const updateUserProfile = async (userId, { name, avatarUrl }) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found.', 'INVALID_REQUEST', 404);
  }

  if (name) user.name = name.trim();
  if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
  await user.save();

  return user.toSafeObject();
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  updateUserProfile
};
