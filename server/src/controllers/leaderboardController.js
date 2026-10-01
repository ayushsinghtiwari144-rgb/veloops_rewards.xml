const leaderboardService = require('../services/leaderboardService');
const { successResponse } = require('../utils/apiResponse');

/**
 * GET /api/leaderboard
 * Fetch weekly or monthly leaderboard rankings
 */
const getLeaderboard = async (req, res, next) => {
  try {
    const { period } = req.query;
    const result = await leaderboardService.getLeaderboard(period || 'weekly');
    return successResponse(res, result, 'Leaderboard retrieved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLeaderboard
};
