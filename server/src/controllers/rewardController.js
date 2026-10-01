const rewardService = require('../services/rewardService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * GET /api/rewards
 * Fetch all available rewards
 */
const getRewards = async (req, res, next) => {
  try {
    const { category, featured, search } = req.query;
    const rewards = await rewardService.getAllRewards({ category, featured, search });
    return successResponse(res, rewards, 'Rewards retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/rewards/:id
 * Fetch single reward details
 */
const getRewardById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reward = await rewardService.getRewardByIdOrSlug(id);
    if (!reward) {
      return errorResponse(res, `Reward '${id}' not found`, 'REWARD_NOT_FOUND', 404);
    }
    return successResponse(res, reward, 'Reward details retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/rewards/:id/redeem
 * Execute reward redemption with server-side point validation
 */
const redeemReward = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { shippingAddress } = req.body || {};
    const userId = req.user._id;

    const result = await rewardService.redeemReward({
      userId,
      rewardIdentifier: id,
      shippingAddress
    });

    return successResponse(
      res,
      result,
      `Successfully redeemed ${result.reward.title}!`,
      201
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRewards,
  getRewardById,
  redeemReward
};
