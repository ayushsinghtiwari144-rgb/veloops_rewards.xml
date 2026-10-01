const challengeService = require('../services/challengeService');
const { successResponse } = require('../utils/apiResponse');

/**
 * GET /api/challenges
 * Fetch all challenges with user progress
 */
const getChallenges = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const challenges = await challengeService.getUserChallenges(userId);
    return successResponse(res, challenges, 'Challenges retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/challenges/:id/claim
 * Claim points for completed challenge
 */
const claimChallenge = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const result = await challengeService.claimChallengeReward({
      userId,
      challengeId: id
    });

    return successResponse(
      res,
      result,
      `Claimed +${result.pointsAwarded} VE Points for '${result.title}'!`,
      200
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getChallenges,
  claimChallenge
};
