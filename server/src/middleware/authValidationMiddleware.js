const { errorResponse } = require('../utils/apiResponse');

/**
 * Validate User Registration Payload
 */
const validateRegisterInput = (req, res, next) => {
  const { name, email, password } = req.body || {};

  // Strip un-trusted client fields
  delete req.body.userId;
  delete req.body.role;
  delete req.body.status;
  delete req.body.pointsBalance;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return errorResponse(res, 'Name is required and must be at least 2 characters long.', 'INVALID_REQUEST', 400);
  }

  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return errorResponse(res, 'A valid email address is required.', 'INVALID_REQUEST', 400);
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return errorResponse(res, 'Password is required and must be at least 6 characters long.', 'INVALID_REQUEST', 400);
  }

  next();
};

/**
 * Validate User Login Payload
 */
const validateLoginInput = (req, res, next) => {
  const { email, password } = req.body || {};

  // Strip un-trusted client fields
  delete req.body.userId;
  delete req.body.role;
  delete req.body.status;

  if (!email || typeof email !== 'string' || !email.trim()) {
    return errorResponse(res, 'Email address is required.', 'INVALID_REQUEST', 400);
  }

  if (!password || typeof password !== 'string' || !password) {
    return errorResponse(res, 'Password is required.', 'INVALID_REQUEST', 400);
  }

  next();
};

module.exports = {
  validateRegisterInput,
  validateLoginInput
};
