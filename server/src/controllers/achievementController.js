const achievementService = require('../services/achievementService');
const { successResponse } = require('../utils/apiResponse');

/**
 * GET /api/achievements
 * Fetch user achievements and unlocked states
 */
const getAchievements = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const achievements = await achievementService.getUserAchievements(userId);
    return successResponse(res, achievements, 'Achievements retrieved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAchievements
};
