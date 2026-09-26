const { AppError } = require('../middleware/errorMiddleware');

/**
 * Service to evaluate giveaway eligibility rules
 */
const checkEligibility = (user, giveaway) => {
  if (!user) {
    throw new AppError('Authentication required to check eligibility', 'LOGIN_REQUIRED', 401);
  }

  if (user.status === 'BLOCKED') {
    throw new AppError('Your account is currently suspended or blocked from giveaways', 'ACCOUNT_BLOCKED', 403);
  }

  if (!giveaway) {
    throw new AppError('Giveaway not found', 'GIVEAWAY_NOT_FOUND', 404);
  }

  if (giveaway.status !== 'ACTIVE' || !giveaway.isActive) {
    if (giveaway.status === 'ENDED') {
      throw new AppError('This giveaway has ended.', 'GIVEAWAY_ENDED', 400);
    }
    throw new AppError('This giveaway is not currently active.', 'GIVEAWAY_NOT_ACTIVE', 400);
  }

  const now = new Date();
  if (giveaway.startDate && new Date(giveaway.startDate) > now) {
    throw new AppError('This giveaway has not started yet.', 'GIVEAWAY_NOT_ACTIVE', 400);
  }

  if (giveaway.endDate && new Date(giveaway.endDate) < now) {
    throw new AppError('This giveaway has ended.', 'GIVEAWAY_ENDED', 400);
  }

  return { eligible: true };
};

module.exports = {
  checkEligibility
};
