const { AuditLog } = require('../models');

/**
 * Audit Logging Service
 */
const createAuditLog = async ({ userId, giveawayId, action, requestId, metadata = {} }, session = null) => {
  try {
    const opts = session ? { session } : {};
    
    // Create Audit Log record
    const logEntries = await AuditLog.create(
      [
        {
          userId: userId || null,
          giveawayId: giveawayId || null,
          action,
          requestId: requestId || null,
          metadata: {
            ...metadata,
            loggedAt: new Date()
          }
        }
      ],
      opts
    );

    return logEntries[0];
  } catch (err) {
    // Non-critical secondary audit failure should be logged without throwing
    console.error(`[AUDIT_LOG_ERROR] Action: ${action}, Error: ${err.message}`);
    return null;
  }
};

module.exports = {
  createAuditLog
};
