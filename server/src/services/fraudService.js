const { FraudEvent, GiveawayParticipation, AuditLog, User } = require('../models');
const { createAuditLog } = require('./auditService');
const { AppError } = require('../middleware/errorMiddleware');

/**
 * Deterministic Risk Score Calculator
 */
const calculateRiskScore = ({ isBlocked, duplicateAttemptsCount, recentJoinCount, sharedDeviceUsersCount }) => {
  let score = 0;
  const reasons = [];
  const signals = {};

  if (isBlocked) {
    score += 50;
    reasons.push('User account is currently blocked');
    signals.isBlocked = true;
  }

  if (duplicateAttemptsCount > 2) {
    const points = Math.min(30, duplicateAttemptsCount * 10);
    score += points;
    reasons.push(`High number of duplicate participation attempts (${duplicateAttemptsCount})`);
    signals.duplicateAttemptsCount = duplicateAttemptsCount;
  }

  if (recentJoinCount > 5) {
    score += 25;
    reasons.push(`High request frequency (${recentJoinCount} joins in short window)`);
    signals.recentJoinCount = recentJoinCount;
  }

  if (sharedDeviceUsersCount > 3) {
    score += 20;
    reasons.push(`Multiple user accounts sharing device fingerprint (${sharedDeviceUsersCount})`);
    signals.sharedDeviceUsersCount = sharedDeviceUsersCount;
  }

  // Cap score at 100
  const finalScore = Math.min(100, score);

  let riskLevel = 'LOW';
  let action = 'ALLOW';

  if (finalScore >= 80) {
    riskLevel = 'CRITICAL';
    action = 'BLOCK';
  } else if (finalScore >= 60) {
    riskLevel = 'HIGH';
    action = 'BLOCK';
  } else if (finalScore >= 30) {
    riskLevel = 'MEDIUM';
    action = 'FLAG';
  } else {
    riskLevel = 'LOW';
    action = 'ALLOW';
  }

  return {
    riskScore: finalScore,
    riskLevel,
    action,
    reasons,
    signals
  };
};

/**
 * Record Fraud Event Entry
 */
const createFraudEvent = async ({ userId, giveawayId, deviceHash, riskScore, reason, signals, action }) => {
  try {
    const event = await FraudEvent.create({
      userId: userId || null,
      giveawayId: giveawayId || null,
      deviceHash: deviceHash || null,
      riskScore,
      reason,
      signals: signals || {},
      action
    });
    return event;
  } catch (err) {
    console.error(`[FRAUD_EVENT_ERROR] ${err.message}`);
    return null;
  }
};

/**
 * Evaluate real-time participation risk for a user and giveaway
 */
const evaluateParticipationRisk = async (user, giveawayId, deviceHash, requestId) => {
  if (!user) return { action: 'ALLOW', riskScore: 0 };

  const userId = user._id;

  // Check 1: Is Account Blocked
  const isBlocked = user.status === 'BLOCKED';

  // Check 2: Recent duplicate attempts in AuditLog (last 24 hours)
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const duplicateAttemptsCount = await AuditLog.countDocuments({
    userId,
    action: 'DUPLICATE_ATTEMPT',
    timestamp: { $gte: twentyFourHoursAgo }
  });

  // Check 3: Recent joins in last 10 minutes
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  const recentJoinCount = await GiveawayParticipation.countDocuments({
    userId,
    joinedAt: { $gte: tenMinutesAgo }
  });

  // Check 4: Shared device accounts count
  let sharedDeviceUsersCount = 0;
  if (deviceHash && deviceHash !== 'unknown') {
    const distinctUsers = await GiveawayParticipation.distinct('userId', {
      deviceHash,
      joinedAt: { $gte: twentyFourHoursAgo }
    });
    sharedDeviceUsersCount = distinctUsers.length;
  }

  const assessment = calculateRiskScore({
    isBlocked,
    duplicateAttemptsCount,
    recentJoinCount,
    sharedDeviceUsersCount
  });

  // If FLAGGED or BLOCKED, record FraudEvent
  if (assessment.action === 'FLAG' || assessment.action === 'BLOCK') {
    await createFraudEvent({
      userId,
      giveawayId,
      deviceHash,
      riskScore: assessment.riskScore,
      reason: assessment.reasons.join('; ') || 'Automated risk signal threshold exceeded',
      signals: assessment.signals,
      action: assessment.action
    });

    await createAuditLog({
      userId,
      giveawayId,
      action: 'FRAUD_FLAGGED',
      requestId,
      metadata: {
        riskScore: assessment.riskScore,
        riskLevel: assessment.riskLevel,
        action: assessment.action
      }
    });
  }

  if (assessment.action === 'BLOCK') {
    if (isBlocked) {
      throw new AppError('Participation is currently unavailable for this account.', 'PARTICIPATION_BLOCKED', 403);
    }
    throw new AppError('Participation is temporarily unavailable due to risk rules.', 'SUSPICIOUS_ACTIVITY', 403);
  }

  return assessment;
};

module.exports = {
  calculateRiskScore,
  createFraudEvent,
  evaluateParticipationRisk
};
