const giveawayService = require('../services/giveawayService');
const giveawayParticipationService = require('../services/giveawayParticipationService');
const winnerService = require('../services/winnerService');
const claimService = require('../services/claimService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * GET /api/giveaways/current
 * Fetch active giveaways from MongoDB
 */
const getCurrentGiveaways = async (req, res, next) => {
  try {
    const giveaways = await giveawayService.getCurrentGiveaways();
    if (!giveaways || giveaways.length === 0) {
      return successResponse(res, [], 'No active giveaways found');
    }
    return successResponse(res, giveaways, 'Active giveaways retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/giveaways/previous
 * Fetch completed/ended giveaways from MongoDB
 */
const getPreviousGiveaways = async (req, res, next) => {
  try {
    const giveaways = await giveawayService.getPreviousGiveaways();
    if (!giveaways || giveaways.length === 0) {
      return successResponse(res, [], 'No completed giveaways found');
    }
    return successResponse(res, giveaways, 'Previous giveaways retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/giveaways/:id
 * Fetch single giveaway details by ID or slug
 */
const getGiveawayById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await giveawayService.getGiveawayByIdOrSlug(id);

    if (!result) {
      return errorResponse(res, `Giveaway with identifier '${id}' not found`, 'GIVEAWAY_NOT_FOUND', 404);
    }

    return successResponse(res, result, 'Giveaway details retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/giveaways/:id/my-status
 * Check authenticated user's participation status
 */
const getMyStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!req.user) {
      return successResponse(res, { participated: false }, 'User not authenticated');
    }

    const statusData = await giveawayParticipationService.getMyParticipationStatus(req.user._id, id);
    return successResponse(res, statusData, 'User participation status retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/giveaways/:id/join
 * Execute real giveaway join participation transaction
 */
const joinGiveaway = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { requestId } = req.body || {};
    const deviceHash = req.headers['x-device-hash'] || req.ip;

    const participation = await giveawayParticipationService.joinGiveaway({
      user: req.user,
      giveawayIdentifier: id,
      requestId,
      deviceHash
    });

    return successResponse(
      res,
      {
        participation: {
          id: participation._id ? participation._id.toString() : participation.id,
          giveawayId: participation.giveawayId,
          status: participation.status,
          joinedAt: participation.joinedAt
        }
      },
      "You're In! Your entry has been successfully recorded.",
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/giveaways/:id/winners
 * Fetch public winners for a specific giveaway (Masked identity)
 */
const getWinners = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await winnerService.getGiveawayWinners(id);

    if (!result.isEnded) {
      return successResponse(
        res,
        [],
        result.message || 'Winner will be announced after the giveaway ends.'
      );
    }

    return successResponse(res, result.winners, 'Giveaway winners retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/giveaways/previous/winners
 * Fetch historical public winners
 */
const getPreviousWinnersList = async (req, res, next) => {
  try {
    const winners = await winnerService.getPreviousWinners();
    return successResponse(res, winners, 'Previous winners retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/giveaways/:id/claim
 * Submit prize claim for authenticated winner
 */
const claimPrize = async (req, res, next) => {
  try {
    const { id } = req.params;
    const claimResult = await claimService.submitClaim({
      user: req.user,
      giveawayIdentifier: id,
      claimData: req.body
    });

    return successResponse(
      res,
      claimResult,
      'Your prize claim has been submitted successfully.',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/giveaways/:id/my-claim
 * Fetch authenticated user's own claim status
 */
const getMyClaim = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!req.user) {
      return successResponse(res, { claimed: false }, 'User not authenticated');
    }

    const claimData = await claimService.getMyClaim(req.user._id, id);
    return successResponse(res, claimData, 'User claim status retrieved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCurrentGiveaways,
  getPreviousGiveaways,
  getGiveawayById,
  getMyStatus,
  joinGiveaway,
  getWinners,
  getPreviousWinnersList,
  claimPrize,
  getMyClaim
};
