const { errorResponse } = require('../utils/apiResponse');

/**
 * Authorization Role Middleware
 * Enforces role-based permissions on protected routes
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required', 'LOGIN_REQUIRED', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(
        res,
        'You do not have permission to perform this action',
        'FORBIDDEN',
        403
      );
    }

    next();
  };
};

module.exports = {
  requireRole
};
