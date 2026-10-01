const mongoose = require('mongoose');
const { Reward, RewardRedemption, PointsTransaction, User, Notification, UserAchievement, Achievement } = require('../models');

const getAllRewards = async ({ category, featured, search }) => {
  const query = { status: { $ne: 'INACTIVE' } };
  if (category && category !== 'ALL') {
    query.category = category.toUpperCase();
  }
  if (featured === 'true' || featured === true) {
    query.featured = true;
  }
  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }

  const rewards = await Reward.find(query).sort({ featured: -1, pointsRequired: 1 });
  return rewards;
};

const getRewardByIdOrSlug = async (identifier) => {
  let query;
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    query = { _id: identifier };
  } else {
    query = { slug: identifier.toLowerCase() };
  }
  const reward = await Reward.findOne(query);
  return reward;
};

const checkAndUnlockAchievements = async (userId) => {
  try {
    const redemptionsCount = await RewardRedemption.countDocuments({ userId });
    const user = await User.findById(userId);

    const achievements = await Achievement.find();
    for (const ach of achievements) {
      let progress = 0;
      let target = ach.requirementValue;

      if (ach.requirementType === 'REWARDS_REDEEMED') {
        progress = redemptionsCount;
      } else if (ach.requirementType === 'STREAK_DAYS') {
        progress = user.streakDays || 1;
      } else if (ach.requirementType === 'POINTS_EARNED') {
        progress = user.pointsBalance || 0;
      }

      const isUnlocked = progress >= target;
      const existing = await UserAchievement.findOne({ userId, achievementId: ach._id });

      if (!existing) {
        await UserAchievement.create({
          userId,
          achievementId: ach._id,
          progress,
          unlocked: isUnlocked,
          unlockedAt: isUnlocked ? new Date() : null
        });
        if (isUnlocked) {
          // Bonus points for achievement unlock
          user.pointsBalance += ach.pointsReward;
          await user.save();
          await PointsTransaction.create({
            userId,
            type: 'ACHIEVEMENT_REWARD',
            amount: ach.pointsReward,
            balanceAfter: user.pointsBalance,
            description: `Unlocked Achievement: ${ach.title}`
          });
          await Notification.create({
            userId,
            title: '🏆 Achievement Unlocked!',
            message: `Congratulations! You unlocked "${ach.title}" and earned +${ach.pointsReward} VE Points.`,
            type: 'ACHIEVEMENT'
          });
        }
      } else if (!existing.unlocked && isUnlocked) {
        existing.unlocked = true;
        existing.unlockedAt = new Date();
        existing.progress = progress;
        await existing.save();

        user.pointsBalance += ach.pointsReward;
        await user.save();
        await PointsTransaction.create({
          userId,
          type: 'ACHIEVEMENT_REWARD',
          amount: ach.pointsReward,
          balanceAfter: user.pointsBalance,
          description: `Unlocked Achievement: ${ach.title}`
        });
        await Notification.create({
          userId,
          title: '🏆 Achievement Unlocked!',
          message: `Congratulations! You unlocked "${ach.title}" and earned +${ach.pointsReward} VE Points.`,
          type: 'ACHIEVEMENT'
        });
      } else if (existing) {
        existing.progress = progress;
        await existing.save();
      }
    }
  } catch (err) {
    console.error('Error checking achievements:', err.message);
  }
};

const redeemReward = async ({ userId, rewardIdentifier, shippingAddress }) => {
  const reward = await getRewardByIdOrSlug(rewardIdentifier);
  if (!reward) {
    const error = new Error('Reward item not found.');
    error.statusCode = 404;
    error.code = 'REWARD_NOT_FOUND';
    throw error;
  }

  if (reward.status !== 'ACTIVE' || reward.stock <= 0) {
    const error = new Error('This reward is currently out of stock.');
    error.statusCode = 400;
    error.code = 'OUT_OF_STOCK';
    throw error;
  }

  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User account not found.');
    error.statusCode = 404;
    error.code = 'USER_NOT_FOUND';
    throw error;
  }

  // CRITICAL SERVER-SIDE BALANCE VALIDATION
  if (user.pointsBalance < reward.pointsRequired) {
    const error = new Error(`Insufficient VE Points. Required: ${reward.pointsRequired} pts, Current Balance: ${user.pointsBalance} pts.`);
    error.statusCode = 400;
    error.code = 'INSUFFICIENT_POINTS';
    throw error;
  }

  // Deduct Points and Update Stock atomically
  user.pointsBalance -= reward.pointsRequired;
  user.xp += Math.floor(reward.pointsRequired * 0.5); // Add XP for leveling up
  if (user.xp >= user.level * 500) {
    user.level += 1;
  }
  await user.save();

  reward.stock -= 1;
  if (reward.stock === 0) {
    reward.status = 'OUT_OF_STOCK';
  }
  await reward.save();

  // Generate Digital Code if digital reward
  const digitalCode = reward.itemType === 'DIGITAL'
    ? `VELOOP-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    : null;

  // Create Redemption Record
  const redemption = await RewardRedemption.create({
    userId: user._id,
    rewardId: reward._id,
    pointsSpent: reward.pointsRequired,
    status: reward.itemType === 'DIGITAL' ? 'FULFILLED' : 'PROCESSING',
    shippingAddress: shippingAddress || 'Digital Delivery',
    digitalCode
  });

  // Log Transaction
  await PointsTransaction.create({
    userId: user._id,
    type: 'REDEEMED',
    amount: -reward.pointsRequired,
    balanceAfter: user.pointsBalance,
    description: `Redeemed Reward: ${reward.title}`,
    referenceId: redemption._id.toString(),
    referenceType: 'RewardRedemption'
  });

  // Create Notification
  await Notification.create({
    userId: user._id,
    title: '🎁 Reward Redeemed!',
    message: `You successfully redeemed ${reward.title} for ${reward.pointsRequired} VE Points.`,
    type: 'REWARD'
  });

  // Async trigger achievement progress check
  checkAndUnlockAchievements(user._id);

  return {
    redemption,
    reward,
    newBalance: user.pointsBalance,
    level: user.level,
    xp: user.xp
  };
};

module.exports = {
  getAllRewards,
  getRewardByIdOrSlug,
  redeemReward,
  checkAndUnlockAchievements
};
