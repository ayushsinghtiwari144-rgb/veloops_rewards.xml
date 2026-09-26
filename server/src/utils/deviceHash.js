const crypto = require('crypto');
const config = require('../config/env');

/**
 * Generate a safe, anonymized SHA-256 device/request fingerprint
 */
const generateDeviceHash = (req) => {
  if (!req) return 'unknown';

  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
  const userAgent = req.headers['user-agent'] || 'unknown-ua';
  const acceptLanguage = req.headers['accept-language'] || '';
  const salt = config.jwtSecret || 'veloop_device_salt';

  const rawFingerprint = `${ip}|${userAgent}|${acceptLanguage}|${salt}`;
  
  return crypto.createHash('sha256').update(rawFingerprint).digest('hex').substring(0, 32);
};

module.exports = {
  generateDeviceHash
};
