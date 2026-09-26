const bcrypt = require('bcryptjs');
const { User } = require('../models');
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

  // Create user
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    role: 'USER',
    status: 'ACTIVE'
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
 * Authenticate existing user login
 */
const loginUser = async ({ email, password }) => {
  if (getDbStatus() !== 'connected') {
    throw new AppError('Database connection unavailable. Please ensure MongoDB service is started.', 'DATABASE_UNAVAILABLE', 503);
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Query user including passwordHash
  const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');
  
  if (!user) {
    // Generic error to prevent email enumeration
    throw new AppError('Invalid email or password.', 'INVALID_CREDENTIALS', 401);
  }

  // Verify password
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new AppError('Invalid email or password.', 'INVALID_CREDENTIALS', 401);
  }

  // Check account status
  if (user.status === 'BLOCKED') {
    throw new AppError('Your account has been suspended or blocked.', 'ACCOUNT_BLOCKED', 403);
  }

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

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser
};
