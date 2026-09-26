const mongoose = require('mongoose');
const crypto = require('crypto');
const { getDbStatus } = require('../config/db');
const {
  Giveaway,
  GiveawayPrize,
  GiveawayParticipation,
  GiveawayWinner,
  User,
  Prize
} = require('../models');
const { createAuditLog } = require('./auditService');
const { maskUserIdentifier } = require('../utils/maskUtils');
const { AppError } = require('../middleware/errorMiddleware');

/**
 * Fetch eligible participants for a giveaway
 */
const getEligibleParticipants = async (giveawayId) => {
  const participations = await GiveawayParticipation.find({
    giveawayId,
    status: 'ACTIVE'
  }).populate('userId', 'name email status role');

  // Filter out blocked/disqualified accounts
  return participations.filter(p => p.userId && p.userId.status === 'ACTIVE');
};

/**
 * Server-Side Backend-Controlled Cryptographic Winner Selection
 */
const selectWinnersForGiveaway = async (giveawayId, selectionMethod = 'RANDOM', adminUserId = null) => {
  if (getDbStatus() !== 'connected') {
    throw new AppError('Database connection unavailable. Please ensure MongoDB service is started.', 'DATABASE_UNAVAILABLE', 503);
  }

  // 1. Verify giveaway exists
  const giveaway = await Giveaway.findById(giveawayId);
  if (!giveaway) {
    throw new AppError('Giveaway not found.', 'GIVEAWAY_NOT_FOUND', 404);
  }

  // 2. Verify giveaway has ended
  const now = new Date();
  const isEnded = giveaway.status === 'ENDED' || new Date(giveaway.endDate) <= now;
  if (!isEnded) {
    throw new AppError('Winner selection is available after the giveaway ends.', 'GIVEAWAY_NOT_ENDED', 400);
  }

  // 3. Prevent duplicate winner selection
  const existingWinners = await GiveawayWinner.find({ giveawayId });
  if (existingWinners && existingWinners.length > 0) {
    throw new AppError('Winners have already been selected for this giveaway.', 'WINNERS_ALREADY_SELECTED', 400);
  }

  // 4. Fetch associated prize
  const giveawayPrize = await GiveawayPrize.findOne({ giveawayId }).sort({ position: 1 });
  if (!giveawayPrize) {
    throw new AppError('No prize attached to this giveaway.', 'INVALID_REQUEST', 400);
  }

  // 5. Fetch eligible participants
  const eligibleParticipations = await getEligibleParticipants(giveawayId);
  if (!eligibleParticipations || eligibleParticipations.length === 0) {
    throw new AppError('No eligible participants available for winner selection.', 'NO_ELIGIBLE_PARTICIPANTS', 400);
  }

  // 6. Cryptographic Random Selection
  const winnerCount = Math.min(giveaway.winnerCount || 1, eligibleParticipations.length);
  const selectedParticipations = [];
  const pool = [...eligibleParticipations];

  for (let i = 0; i < winnerCount; i++) {
    const randomIndex = crypto.randomInt(0, pool.length);
    selectedParticipations.push(pool[randomIndex]);
    pool.splice(randomIndex, 1);
  }

  // 7. Atomic MongoDB Session Transaction
  let session = null;
  let useTransaction = true;

  try {
    session = await mongoose.startSession();
    session.startTransaction();
  } catch (txErr) {
    useTransaction = false;
    if (session) session.endSession();
    session = null;
  }

  try {
    const sessionOpts = useTransaction ? { session } : {};
    const winnerRecords = [];

    for (const part of selectedParticipations) {
      const winnerArray = await GiveawayWinner.create(
        [
          {
            giveawayId,
            prizeId: giveawayPrize.prizeId,
            userId: part.userId._id,
            selectionMethod,
            selectedAt: new Date(),
            status: 'SELECTED'
          }
        ],
        sessionOpts
      );
      winnerRecords.push(winnerArray[0]);
    }

    // Update giveaway status to ENDED if not set
    giveaway.status = 'ENDED';
    await giveaway.save(sessionOpts);

    // Audit log
    await createAuditLog(
      {
        userId: adminUserId || null,
        giveawayId,
        action: 'WINNER_SELECTED',
        metadata: {
          winnerCount: winnerRecords.length,
          selectionMethod,
          winnerUserIds: winnerRecords.map(w => w.userId)
        }
      },
      session
    );

    if (useTransaction && session) {
      await session.commitTransaction();
      session.endSession();
    }

    return winnerRecords;
  } catch (error) {
    if (useTransaction && session) {
      await session.abortTransaction();
      session.endSession();
    }
    throw error;
  }
};

/**
 * Fetch public winners for a specific giveaway (Masked user identity)
 */
const getGiveawayWinners = async (giveawayId) => {
  if (getDbStatus() !== 'connected') {
    return { isEnded: false, winners: [] };
  }

  let giveaway;
  if (mongoose.Types.ObjectId.isValid(giveawayId)) {
    giveaway = await Giveaway.findById(giveawayId);
  } else {
    giveaway = await Giveaway.findOne({ slug: giveawayId.toLowerCase() });
  }

  if (!giveaway) {
    return { isEnded: false, winners: [] };
  }

  // Rule: ACTIVE giveaway must NEVER return winners
  const now = new Date();
  const isEnded = giveaway.status === 'ENDED' || new Date(giveaway.endDate) <= now;

  if (!isEnded) {
    return {
      isEnded: false,
      winners: [],
      message: 'Winner will be announced after the giveaway ends.'
    };
  }

  const winners = await GiveawayWinner.find({ giveawayId: giveaway._id })
    .populate('userId', 'name email')
    .populate('prizeId', 'name image prizeType');

  // Format safe public representations
  const safeWinners = winners.map(w => ({
    id: w._id.toString(),
    maskedUserId: maskUserIdentifier(w.userId ? (w.userId.email || w.userId.name) : 'ANON'),
    prizeName: w.prizeId ? w.prizeId.name : giveaway.title,
    prizeImage: w.prizeId ? w.prizeId.image : 'default',
    selectedAt: w.selectedAt,
    status: w.status
  }));

  return {
    isEnded: true,
    winners: safeWinners
  };
};

/**
 * Fetch historical previous public winners
 */
const getPreviousWinners = async () => {
  if (getDbStatus() !== 'connected') {
    return [];
  }

  const winners = await GiveawayWinner.find()
    .populate('userId', 'name email')
    .populate('prizeId', 'name image')
    .populate('giveawayId', 'title slug status endDate')
    .sort({ selectedAt: -1 })
    .limit(20);

  // Filter out any active giveaway records and map safe public representations
  const safeWinners = winners
    .filter(w => w.giveawayId && w.giveawayId.status === 'ENDED')
    .map(w => ({
      id: w._id.toString(),
      maskedUserId: maskUserIdentifier(w.userId ? (w.userId.email || w.userId.name) : 'ANON'),
      prizeName: w.prizeId ? w.prizeId.name : 'VELOOP Reward',
      giveawayName: w.giveawayId ? w.giveawayId.title : 'Giveaway',
      announcedDate: w.selectedAt ? new Date(w.selectedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently',
      status: 'Claimed & Verified'
    }));

  return safeWinners;
};

module.exports = {
  getEligibleParticipants,
  selectWinnersForGiveaway,
  getGiveawayWinners,
  getPreviousWinners
};
