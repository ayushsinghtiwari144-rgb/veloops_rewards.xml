const { verifyAccessToken } = require('../utils/tokenUtils');
const { User } = require('../models');
const { errorResponse } = require('../utils/apiResponse');

/**
 * requireAuth Middleware
 * Verifies JWT token, fetches user from DB, checks status, attaches req.user
 */
const requireAuth = async (req, res, next) => {
  let token = null;

  // Read Bearer token from Authorization Header
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return errorResponse(res, 'Authentication required', 'LOGIN_REQUIRED', 401);
  }

  try {
    const decoded = verifyAccessToken(token);
    
    // Server-side database user lookup (Do NOT trust JWT payload alone)
    const user = await User.findById(decoded.userId);
    if (!user) {
      return errorResponse(res, 'User account no longer exists', 'TOKEN_INVALID', 401);
    }

    if (user.status === 'BLOCKED') {
      return errorResponse(res, 'Your account has been suspended or blocked', 'ACCOUNT_BLOCKED', 403);
    }

    // Attach authenticated user to request
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return errorResponse(res, 'Authentication token has expired', 'TOKEN_EXPIRED', 401);
    }
    return errorResponse(res, 'Invalid authentication token', 'TOKEN_INVALID', 401);
  }
};

/**
 * Optional authentication helper
 */
const optionalAuth = async (req, res, next) => {
  let token = null;
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (token) {
    try {
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.userId);
      if (user && user.status === 'ACTIVE') {
        req.user = user;
      }
    } catch (err) {
      // Ignore token verification errors for optional auth
    }
  }

  next();
};

module.exports = {
  requireAuth,
  optionalAuth
};
