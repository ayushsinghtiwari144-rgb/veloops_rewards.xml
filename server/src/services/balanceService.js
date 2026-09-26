const { User } = require('../models');
const { AppError } = require('../middleware/errorMiddleware');

/**
 * Balance Service Abstraction for VELOOP Rewards
 * Manages VE, SVE, TOKEN, and VELOOP Points balances
 */

/**
 * Get user's current balance for a specified reward currency
 */
const getUserBalance = (user, currency = 'VELOOP Points') => {
  if (!user) return 0;
  // Default to pointsBalance on User model
  return user.pointsBalance || 0;
};

/**
 * Verify if user holds sufficient balance for entry cost
 */
const hasSufficientBalance = (user, currency, requiredAmount) => {
  const currentBalance = getUserBalance(user, currency);
  return currentBalance >= requiredAmount;
};

/**
 * Deduct balance atomically within a Mongoose session transaction
 */
const deductBalance = async (userId, currency, amount, session) => {
  const user = await User.findById(userId).session(session);

  if (!user) {
    throw new AppError('User account not found', 'INVALID_REQUEST', 404);
  }

  if (user.pointsBalance < amount) {
    const currencyName = currency || 'VELOOP Points';
    let errorCode = 'INSUFFICIENT_VE_BALANCE';
    if (currencyName.includes('SVE')) errorCode = 'INSUFFICIENT_SVE_BALANCE';
    if (currencyName.includes('TOKEN')) errorCode = 'INSUFFICIENT_TOKEN_BALANCE';

    throw new AppError(`Insufficient ${currencyName} balance. Required: ${amount}, Current: ${user.pointsBalance}`, errorCode, 400);
  }

  // Atomically update user balance
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $inc: { pointsBalance: -amount } },
    { new: true, session }
  );

  return updatedUser;
};

module.exports = {
  getUserBalance,
  hasSufficientBalance,
  deductBalance
};
