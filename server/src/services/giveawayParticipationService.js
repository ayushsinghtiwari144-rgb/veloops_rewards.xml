const mongoose = require('mongoose');
const { getDbStatus } = require('../config/db');
const {
  User,
  Giveaway,
  GiveawayPrize,
  GiveawayParticipation,
  GiveawayEntryTransaction,
  AuditLog
} = require('../models');
const { AppError } = require('../middleware/errorMiddleware');
const balanceService = require('./balanceService');
const { checkEligibility } = require('./eligibilityService');
const { assessParticipationRisk } = require('./fraudService');

/**
 * Execute giveaway participation flow
 */
const joinGiveaway = async ({ user, giveawayIdentifier, requestId, deviceHash }) => {
  if (getDbStatus() !== 'connected') {
    throw new AppError('Database connection unavailable. Please ensure MongoDB service is started.', 'DATABASE_UNAVAILABLE', 503);
  }

  // 1. Load giveaway by ObjectId or Slug
  let giveaway;
  if (mongoose.Types.ObjectId.isValid(giveawayIdentifier)) {
    giveaway = await Giveaway.findById(giveawayIdentifier);
  } else {
    giveaway = await Giveaway.findOne({ slug: giveawayIdentifier.toLowerCase() });
  }

  if (!giveaway) {
    throw new AppError('Giveaway not found.', 'GIVEAWAY_NOT_FOUND', 404);
  }

  const giveawayId = giveaway._id;
  const userId = user._id;

  // 2. Evaluate Eligibility
  checkEligibility(user, giveaway);

  // 3. Application-level Duplicate Participation Check
  const existingParticipation = await GiveawayParticipation.findOne({
    userId,
    giveawayId
  });

  if (existingParticipation) {
    // Log audit record for duplicate attempt
    await AuditLog.create({
      userId,
      giveawayId,
      action: 'DUPLICATE_ATTEMPT',
      requestId: requestId || null,
      metadata: { attemptedAt: new Date() }
    });

    throw new AppError('You have already participated in this giveaway.', 'ALREADY_PARTICIPATING', 400);
  }

  // 4. Idempotency Check on Request ID
  if (requestId) {
    const existingTx = await GiveawayEntryTransaction.findOne({ requestId });
    if (existingTx && existingTx.status === 'COMPLETED') {
      const existingPart = await GiveawayParticipation.findById(existingTx.participationId);
      if (existingPart) {
        return existingPart;
      }
    }
  }

  // 5. Fraud Assessment
  await assessParticipationRisk(user, giveaway, deviceHash);

  // 6. Balance Check (From Database Authority)
  const entryCurrency = giveaway.entryCurrency || 'VELOOP Points';
  const entryAmount = giveaway.entryAmount || 0;

  if (!balanceService.hasSufficientBalance(user, entryCurrency, entryAmount)) {
    let errorCode = 'INSUFFICIENT_VE_BALANCE';
    if (entryCurrency.includes('SVE')) errorCode = 'INSUFFICIENT_SVE_BALANCE';
    if (entryCurrency.includes('TOKEN')) errorCode = 'INSUFFICIENT_TOKEN_BALANCE';

    await AuditLog.create({
      userId,
      giveawayId,
      action: 'JOIN_REJECTED',
      requestId: requestId || null,
      metadata: { reason: 'INSUFFICIENT_BALANCE', required: entryAmount, balance: user.pointsBalance }
    });

    throw new AppError(`Insufficient ${entryCurrency} balance to join this giveaway. Required: ${entryAmount}, Current: ${user.pointsBalance}`, errorCode, 400);
  }

  // 7. Execute Atomic MongoDB Session Transaction (Fall back gracefully if replica set not enabled)
  let session = null;
  let useTransaction = true;

  try {
    session = await mongoose.startSession();
    session.startTransaction();
  } catch (txErr) {
    // Standalone MongoDB without replica set does not support transactions; proceed with sequential execution
    useTransaction = false;
    if (session) {
      session.endSession();
      session = null;
    }
  }

  try {
    const sessionOpts = useTransaction ? { session } : {};

    // A. Deduct Currency Balance
    await balanceService.deductBalance(userId, entryCurrency, entryAmount, session);

    // B. Create Entry Transaction Record
    const entryTxArray = await GiveawayEntryTransaction.create(
      [
        {
          userId,
          giveawayId,
          currency: entryCurrency,
          amount: entryAmount,
          transactionType: 'ENTRY_FEE_DEDUCTED',
          status: 'COMPLETED',
          requestId: requestId || null
        }
      ],
      sessionOpts
    );
    const entryTx = entryTxArray[0];

    // C. Create Participation Record (Protected by Unique Index userId + giveawayId)
    const participationArray = await GiveawayParticipation.create(
      [
        {
          userId,
          giveawayId,
          entryCurrency,
          entryAmount,
          deviceHash: deviceHash || null,
          status: 'ACTIVE',
          joinedAt: new Date(),
          transactionId: entryTx._id
        }
      ],
      sessionOpts
    );
    const participation = participationArray[0];

    // Update transaction reference
    entryTx.participationId = participation._id;
    await entryTx.save(sessionOpts);

    // D. Increment Giveaway Participant Count
    await Giveaway.findByIdAndUpdate(giveawayId, { $inc: { participants: 1 } }, sessionOpts);

    // E. Create Audit Log Entry
    await AuditLog.create(
      [
        {
          userId,
          giveawayId,
          action: 'JOIN_GIVEAWAY',
          requestId: requestId || null,
          metadata: { entryCurrency, entryAmount, transactionId: entryTx._id }
        }
      ],
      sessionOpts
    );

    // Commit Transaction if active
    if (useTransaction && session) {
      await session.commitTransaction();
      session.endSession();
    }

    return participation;
  } catch (error) {
    // Abort Transaction and Rollback on error
    if (useTransaction && session) {
      await session.abortTransaction();
      session.endSession();
    }

    // Handle Mongo duplicate key error if index caught duplicate
    if (error.code === 11000) {
      throw new AppError('You have already participated in this giveaway.', 'ALREADY_PARTICIPATING', 400);
    }

    throw error;
  }
};

/**
 * Fetch authenticated user's participation status for a specific giveaway
 */
const getMyParticipationStatus = async (userId, giveawayIdentifier) => {
  if (getDbStatus() !== 'connected') {
    return { participated: false };
  }

  let giveawayId = giveawayIdentifier;
  if (!mongoose.Types.ObjectId.isValid(giveawayIdentifier)) {
    const gw = await Giveaway.findOne({ slug: giveawayIdentifier.toLowerCase() });
    if (!gw) return { participated: false };
    giveawayId = gw._id;
  }

  const participation = await GiveawayParticipation.findOne({
    userId,
    giveawayId
  });

  if (!participation) {
    return { participated: false };
  }

  return {
    participated: true,
    status: participation.status,
    joinedAt: participation.joinedAt
  };
};

module.exports = {
  joinGiveaway,
  getMyParticipationStatus
};
