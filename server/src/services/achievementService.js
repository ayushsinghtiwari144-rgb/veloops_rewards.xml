const { Achievement, UserAchievement, User, RewardRedemption } = require('../models');

const getUserAchievements = async (userId) => {
  const achievements = await Achievement.find().sort({ pointsReward: 1 });
  const userAchievements = await UserAchievement.find({ userId });
  const user = await User.findById(userId);
  const redemptionsCount = await RewardRedemption.countDocuments({ userId });

  const achMap = new Map();
  userAchievements.forEach(ua => achMap.set(ua.achievementId.toString(), ua));

  const result = achievements.map(ach => {
    const ua = achMap.get(ach._id.toString());
    let currentProgress = ua ? ua.progress : 0;

    if (ach.requirementType === 'REWARDS_REDEEMED') {
      currentProgress = redemptionsCount;
    } else if (ach.requirementType === 'STREAK_DAYS') {
      currentProgress = user ? user.streakDays : 1;
    } else if (ach.requirementType === 'POINTS_EARNED') {
      currentProgress = user ? user.pointsBalance : 0;
    }

    const isUnlocked = ua ? ua.unlocked : (currentProgress >= ach.requirementValue);

    return {
      id: ach._id.toString(),
      title: ach.title,
      description: ach.description,
      badgeKey: ach.badgeKey,
      icon: ach.icon,
      pointsReward: ach.pointsReward,
      requirementType: ach.requirementType,
      requirementValue: ach.requirementValue,
      progress: Math.min(currentProgress, ach.requirementValue),
      unlocked: isUnlocked,
      unlockedAt: ua && ua.unlockedAt ? ua.unlockedAt : (isUnlocked ? new Date() : null)
    };
  });

  return result;
};

module.exports = {
  getUserAchievements
};
