const mongoose = require('mongoose');
const { errorResponse } = require('../utils/apiResponse');

/**
 * Middleware to validate Mongoose ObjectId route parameters
 */
const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    
    // Allow non-ObjectId query strings if slug fallback search is enabled,
    // but check valid 24-char hex string if checking direct mongo ID
    if (id && !mongoose.Types.ObjectId.isValid(id) && id.length === 24) {
      return errorResponse(res, `Invalid ID format provided: ${id}`, 'INVALID_REQUEST', 400);
    }

    next();
  };
};

/**
 * Middleware to strip or sanitize untrusted client fields
 */
const sanitizeClientInput = (req, res, next) => {
  if (req.body) {
    // Explicitly delete frontend-supplied fields that must be determined by backend authority
    delete req.body.userId;
    delete req.body.userBalance;
    delete req.body.pointsBalance;
    delete req.body.entryAmount;
    delete req.body.winnerStatus;
    delete req.body.prizeValue;
  }
  next();
};

module.exports = {
  validateObjectId,
  sanitizeClientInput
};
