const config = require('../config/env');

/**
 * Custom Application Error Class
 */
class AppError extends Error {
  constructor(message, code = 'SERVER_ERROR', statusCode = 400) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Centralized Error Handling Middleware
 */
const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || res.statusCode;
  if (statusCode === 200) statusCode = 500;

  let message = err.message || 'Internal Server Error';
  let code = err.code || 'SERVER_ERROR';

  // Mongoose Invalid ObjectId CastError
  if (err.name === 'CastError') {
    message = `Invalid ${err.path}: ${err.value}`;
    code = 'INVALID_REQUEST';
    statusCode = 400;
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map(val => val.message).join(', ');
    code = 'VALIDATION_ERROR';
    statusCode = 400;
  }

  // Mongo Duplicate Key Error (Code 11000)
  if (err.code === 11000) {
    message = 'Duplicate record attempt detected in system';
    code = 'DUPLICATE_ENTRY';
    statusCode = 409;
  }

  console.error(`[ApiError] ${code} (${statusCode}): ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
    code,
    ...(config.nodeEnv === 'development' && { stack: err.stack })
  });
};

module.exports = {
  AppError,
  errorMiddleware
};
