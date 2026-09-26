const mongoose = require('mongoose');
const { getDbStatus } = require('../config/db');
const {
  Giveaway,
  GiveawayWinner,
  PrizeClaim,
  Prize,
  AuditLog
} = require('../models');
const { createAuditLog } = require('./auditService');
const { AppError } = require('../middleware/errorMiddleware');

/**
 * Validate Claim Form Fields server-side according to Prize Type
 */
const validateClaimPayload = (prizeType, claimData) => {
  const { name, phone, address, city, state, pinCode, email } = claimData || {};

  if (prizeType === 'PHYSICAL') {
    if (!name || typeof name !== 'string' || !name.trim()) {
      throw new AppError('Full name is required for physical prize delivery.', 'INVALID_REQUEST', 400);
    }
    if (!phone || typeof phone !== 'string' || !/^[0-9+()\s-]{7,15}$/.test(phone.trim())) {
      throw new AppError('A valid contact phone number is required.', 'INVALID_REQUEST', 400);
    }
    if (!address || typeof address !== 'string' || address.trim().length < 5) {
      throw new AppError('A valid street address is required.', 'INVALID_REQUEST', 400);
    }
    if (!city || typeof city !== 'string' || !city.trim()) {
      throw new AppError('City is required.', 'INVALID_REQUEST', 400);
    }
    if (!state || typeof state !== 'string' || !state.trim()) {
      throw new AppError('State/Province is required.', 'INVALID_REQUEST', 400);
    }
    if (!pinCode || typeof pinCode !== 'string' || !/^[a-zA-Z0-9\s-]{3,10}$/.test(pinCode.trim())) {
      throw new AppError('A valid Postal / PIN code is required.', 'INVALID_REQUEST', 400);
    }
  } else {
    // GIFT_CARD or DIGITAL
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      throw new AppError('A valid delivery email address is required for digital prizes.', 'INVALID_REQUEST', 400);
    }
  }
};

/**
 * Submit Prize Claim securely
 */
const submitClaim = async ({ user, giveawayIdentifier, claimData }) => {
  if (getDbStatus() !== 'connected') {
    throw new AppError('Database connection unavailable. Please ensure MongoDB service is started.', 'DATABASE_UNAVAILABLE', 503);
  }

  // 1. Resolve Giveaway
  let giveaway;
  if (mongoose.Types.ObjectId.isValid(giveawayIdentifier)) {
    giveaway = await Giveaway.findById(giveawayIdentifier);
  } else {
    giveaway = await Giveaway.findOne({ slug: giveawayIdentifier.toLowerCase() });
  }

  if (!giveaway) {
    throw new AppError('Giveaway not found.', 'GIVEAWAY_NOT_FOUND', 404);
  }

  // 2. Verify Giveaway has Ended
  const now = new Date();
  const isEnded = giveaway.status === 'ENDED' || new Date(giveaway.endDate) <= now;
  if (!isEnded) {
    throw new AppError('Prize claim submission is available after the giveaway ends.', 'GIVEAWAY_NOT_ENDED', 400);
  }

  // 3. Find Winner Record for Authenticated User (Security Rule: authenticated user == winner.userId)
  const winner = await GiveawayWinner.findOne({
    giveawayId: giveaway._id,
    userId: user._id
  });

  if (!winner) {
    throw new AppError('You are not authorized to submit a prize claim for this giveaway.', 'CLAIM_NOT_ALLOWED', 403);
  }

  // 4. Duplicate Claim Prevention
  const existingClaim = await PrizeClaim.findOne({ winnerId: winner._id });
  if (existingClaim) {
    throw new AppError('Your prize claim has already been submitted.', 'CLAIM_ALREADY_SUBMITTED', 400);
  }

  // 5. Fetch Prize Type
  const prize = await Prize.findById(winner.prizeId);
  const prizeType = prize ? prize.prizeType : 'PHYSICAL';

  // 6. Server-Side Input Validation
  validateClaimPayload(prizeType, claimData);

  // 7. Create PrizeClaim Record
  const newClaim = await PrizeClaim.create({
    giveawayId: giveaway._id,
    prizeId: winner.prizeId,
    winnerId: winner._id,
    userId: user._id,
    prizeType,
    claimStatus: 'SUBMITTED',
    name: claimData.name ? claimData.name.trim() : null,
    phone: claimData.phone ? claimData.phone.trim() : null,
    address: claimData.address ? claimData.address.trim() : null,
    city: claimData.city ? claimData.city.trim() : null,
    state: claimData.state ? claimData.state.trim() : null,
    pinCode: claimData.pinCode ? claimData.pinCode.trim() : null,
    email: claimData.email ? claimData.email.trim() : user.email,
    submittedAt: new Date()
  });

  // 8. Update Winner Status
  winner.status = 'CLAIMED';
  await winner.save();

  // 9. Audit Log (Safe metadata ONLY - NO sensitive claim data stored in audit!)
  await createAuditLog({
    userId: user._id,
    giveawayId: giveaway._id,
    action: 'CLAIM_SUBMITTED',
    metadata: {
      winnerId: winner._id,
      prizeType,
      claimStatus: 'SUBMITTED'
    }
  });

  return {
    claimId: newClaim._id.toString(),
    claimStatus: 'SUBMITTED',
    submittedAt: newClaim.submittedAt
  };
};

/**
 * Fetch authenticated user's own claim status
 */
const getMyClaim = async (userId, giveawayIdentifier) => {
  if (getDbStatus() !== 'connected') {
    return { claimed: false };
  }

  let giveawayId = giveawayIdentifier;
  if (!mongoose.Types.ObjectId.isValid(giveawayIdentifier)) {
    const gw = await Giveaway.findOne({ slug: giveawayIdentifier.toLowerCase() });
    if (!gw) return { claimed: false };
    giveawayId = gw._id;
  }

  const claim = await PrizeClaim.findOne({
    userId,
    giveawayId
  });

  if (!claim) {
    return { claimed: false };
  }

  return {
    claimed: true,
    claimStatus: claim.claimStatus,
    submittedAt: claim.submittedAt
  };
};

module.exports = {
  validateClaimPayload,
  submitClaim,
  getMyClaim
};
