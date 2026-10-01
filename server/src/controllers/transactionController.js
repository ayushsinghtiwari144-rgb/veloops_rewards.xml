const transactionService = require('../services/transactionService');
const { successResponse } = require('../utils/apiResponse');

/**
 * GET /api/transactions
 * Fetch points ledger transaction history
 */
const getTransactions = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const transactions = await transactionService.getUserTransactions(userId);
    return successResponse(res, transactions, 'Transaction history retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/transactions/redemptions
 * Fetch user reward redemptions history
 */
const getRedemptions = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const redemptions = await transactionService.getUserRedemptions(userId);
    return successResponse(res, redemptions, 'Redemption history retrieved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTransactions,
  getRedemptions
};
