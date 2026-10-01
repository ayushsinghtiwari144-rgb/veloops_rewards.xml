const { PointsTransaction, RewardRedemption } = require('../models');

const getUserTransactions = async (userId) => {
  const transactions = await PointsTransaction.find({ userId })
    .sort({ createdAt: -1 })
    .limit(100);
  return transactions;
};

const getUserRedemptions = async (userId) => {
  const redemptions = await RewardRedemption.find({ userId })
    .populate('rewardId', 'title category imageUrl itemType')
    .sort({ createdAt: -1 });
  return redemptions;
};

module.exports = {
  getUserTransactions,
  getUserRedemptions
};
