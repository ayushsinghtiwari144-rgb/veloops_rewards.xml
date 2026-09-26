const crypto = require('crypto');

/**
 * Middleware to ensure every API request has a unique requestId
 */
const requestIdMiddleware = (req, res, next) => {
  const clientReqId = req.headers['x-request-id'];

  // Validate or generate requestId
  if (clientReqId && typeof clientReqId === 'string' && clientReqId.length <= 64 && /^[a-zA-Z0-9_-]+$/.test(clientReqId)) {
    req.requestId = clientReqId;
  } else {
    req.requestId = `req_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  }

  // Attach X-Request-ID header to response
  res.setHeader('X-Request-ID', req.requestId);

  next();
};

module.exports = requestIdMiddleware;
