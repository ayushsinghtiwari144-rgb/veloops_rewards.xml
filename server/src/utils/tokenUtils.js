const jwt = require('jsonwebtoken');
const config = require('../config/env');

/**
 * Generate short-lived Access Token (15m expiration)
 * Contains minimal payload: userId, role
 */
const generateAccessToken = (user) => {
  const payload = {
    userId: user._id ? user._id.toString() : user.id,
    role: user.role
  };

  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: '15m'
  });
};

/**
 * Generate longer-lived Refresh Token (7d expiration)
 */
const generateRefreshToken = (user) => {
  const payload = {
    userId: user._id ? user._id.toString() : user.id
  };

  return jwt.sign(payload, config.refreshSecret, {
    expiresIn: '7d'
  });
};

/**
 * Verify Access Token
 */
const verifyAccessToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};

/**
 * Verify Refresh Token
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.refreshSecret);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};
