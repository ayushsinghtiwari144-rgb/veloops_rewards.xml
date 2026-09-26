/**
 * Standard API Success Response Helper
 */
const successResponse = (res, data = null, message = 'Operation successful', statusCode = 200, extra = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...extra
  });
};

/**
 * Standard API Error Response Helper
 */
const errorResponse = (res, message = 'An error occurred', code = 'SERVER_ERROR', statusCode = 400, errors = null) => {
  const response = {
    success: false,
    message,
    code
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  successResponse,
  errorResponse
};
