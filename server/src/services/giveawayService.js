const mongoose = require('mongoose');
const { getDbStatus } = require('../config/db');
const { Giveaway, Prize, GiveawayPrize, GiveawayWinner, GiveawayParticipation } = require('../models');

/**
 * Service to fetch all active giveaways currently running in MongoDB
 */
const getCurrentGiveaways = async () => {
  if (getDbStatus() !== 'connected') {
    return [];
  }

  const giveaways = await Giveaway.find({
    status: 'ACTIVE',
    isActive: true
  }).sort({ endDate: 1 });

  return giveaways;
};

/**
 * Service to fetch all completed/ended giveaways
 */
const getPreviousGiveaways = async () => {
  if (getDbStatus() !== 'connected') {
    return [];
  }

  const giveaways = await Giveaway.find({
    status: 'ENDED',
    isActive: true
  }).sort({ endDate: -1 });

  return giveaways;
};

/**
 * Service to fetch giveaway by ID or unique slug with attached prize details
 */
const getGiveawayByIdOrSlug = async (identifier) => {
  if (getDbStatus() !== 'connected') {
    return null;
  }

  let query;
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    query = { _id: identifier };
  } else {
    query = { slug: identifier.toLowerCase() };
  }

  const giveaway = await Giveaway.findOne(query);
  if (!giveaway) {
    return null;
  }

  // Fetch attached prize relations
  const prizes = await GiveawayPrize.find({ giveawayId: giveaway._id })
    .populate('prizeId')
    .sort({ position: 1 });

  return {
    giveaway,
    prizes
  };
};

/**
 * Service to fetch winners for a concluded giveaway
 */
const getGiveawayWinners = async (giveawayId) => {
  if (getDbStatus() !== 'connected') {
    return [];
  }

  const winners = await GiveawayWinner.find({ giveawayId })
    .populate('userId', 'username')
    .populate('prizeId', 'name image prizeType');

  return winners;
};

/**
 * Service to fetch all historical public winners (Anonymized)
 */
const getPreviousWinners = async () => {
  if (getDbStatus() !== 'connected') {
    return [];
  }

  const winners = await GiveawayWinner.find({ status: 'CLAIMED' })
    .populate('userId', 'username')
    .populate('prizeId', 'name image')
    .populate('giveawayId', 'title slug')
    .sort({ selectedAt: -1 })
    .limit(20);

  return winners;
};

module.exports = {
  getCurrentGiveaways,
  getPreviousGiveaways,
  getGiveawayByIdOrSlug,
  getGiveawayWinners,
  getPreviousWinners
};
