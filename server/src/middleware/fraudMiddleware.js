const { generateDeviceHash } = require('../utils/deviceHash');
const { evaluateParticipationRisk } = require('../services/fraudService');

/**
 * Middleware to evaluate fraud and security risk before processing giveaway join
 */
const checkGiveawayFraudRisk = async (req, res, next) => {
  try {
    const deviceHash = generateDeviceHash(req);
    req.deviceHash = deviceHash;

    if (req.user && req.params.id) {
      const assessment = await evaluateParticipationRisk(
        req.user,
        req.params.id,
        deviceHash,
        req.requestId
      );
      req.fraud = assessment;
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkGiveawayFraudRisk
};
