const { User, Reward, RewardRedemption, PointsTransaction, Challenge, Notification } = require('../models');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * GET /api/admin/stats
 * Overview dashboard metrics for admin
 */
const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRewards = await Reward.countDocuments();
    const totalRedemptions = await RewardRedemption.countDocuments();
    const totalChallenges = await Challenge.countDocuments();

    const pointsAgg = await PointsTransaction.aggregate([
      { $match: { amount: { $gt: 0 } } },
      { $group: { _id: null, totalEarned: { $sum: '$amount' } } }
    ]);
    const totalPointsEarned = pointsAgg.length > 0 ? pointsAgg[0].totalEarned : 0;

    const recentRedemptions = await RewardRedemption.find()
      .populate('userId', 'name email')
      .populate('rewardId', 'title category pointsRequired')
      .sort({ createdAt: -1 })
      .limit(10);

    return successResponse(res, {
      totalUsers,
      totalRewards,
      totalRedemptions,
      totalChallenges,
      totalPointsEarned,
      recentRedemptions
    }, 'Admin metrics retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/rewards
 * Create new store reward item
 */
const createReward = async (req, res, next) => {
  try {
    const { title, slug, description, category, pointsRequired, stock, imageUrl, itemType, featured } = req.body;
    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const reward = await Reward.create({
      title,
      slug: finalSlug,
      description,
      category,
      pointsRequired: Number(pointsRequired),
      stock: Number(stock),
      imageUrl,
      itemType: itemType || 'PHYSICAL',
      featured: Boolean(featured)
    });

    return successResponse(res, reward, 'Reward created successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/rewards/:id
 * Update existing reward item or inventory stock
 */
const updateReward = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const reward = await Reward.findByIdAndUpdate(id, updateData, { new: true });
    if (!reward) {
      return errorResponse(res, 'Reward item not found', 'REWARD_NOT_FOUND', 404);
    }
    return successResponse(res, reward, 'Reward updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/admin/rewards/:id
 */
const deleteReward = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Reward.findByIdAndDelete(id);
    return successResponse(res, { deletedId: id }, 'Reward deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/redemptions
 */
const getAllRedemptions = async (req, res, next) => {
  try {
    const redemptions = await RewardRedemption.find()
      .populate('userId', 'name email')
      .populate('rewardId', 'title category pointsRequired imageUrl')
      .sort({ createdAt: -1 });
    return successResponse(res, redemptions, 'All redemptions retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/redemptions/:id/status
 */
const updateRedemptionStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, digitalCode, notes } = req.body;

    const redemption = await RewardRedemption.findById(id);
    if (!redemption) {
      return errorResponse(res, 'Redemption record not found', 'NOT_FOUND', 404);
    }

    if (status) redemption.status = status;
    if (digitalCode) redemption.digitalCode = digitalCode;
    if (notes) redemption.notes = notes;
    await redemption.save();

    // Create notification for user
    await Notification.create({
      userId: redemption.userId,
      title: '📦 Order Status Updated',
      message: `Your reward redemption order status is now: ${redemption.status}.`,
      type: 'REWARD'
    });

    return successResponse(res, redemption, 'Redemption status updated');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/users
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    return successResponse(res, users, 'Users retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/users/:id/points
 * Adjust user VE points balance
 */
const adjustUserPoints = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, reason } = req.body;
    const pts = Number(amount);

    const user = await User.findById(id);
    if (!user) {
      return errorResponse(res, 'User not found', 'USER_NOT_FOUND', 404);
    }

    user.pointsBalance = Math.max(0, user.pointsBalance + pts);
    await user.save();

    await PointsTransaction.create({
      userId: user._id,
      type: 'ADMIN_ADJUSTMENT',
      amount: pts,
      balanceAfter: user.pointsBalance,
      description: reason || `Admin points adjustment (${pts > 0 ? '+' : ''}${pts})`
    });

    await Notification.create({
      userId: user._id,
      title: '💎 Points Adjustment',
      message: `An admin updated your balance by ${pts > 0 ? '+' : ''}${pts} VE Points. Reason: ${reason || 'System Bonus'}`,
      type: 'POINTS'
    });

    return successResponse(res, { userId: user._id, newBalance: user.pointsBalance }, 'User points adjusted');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  createReward,
  updateReward,
  deleteReward,
  getAllRedemptions,
  updateRedemptionStatus,
  getAllUsers,
  adjustUserPoints
};
