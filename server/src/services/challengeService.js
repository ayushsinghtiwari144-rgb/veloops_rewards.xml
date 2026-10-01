const { Challenge, UserChallenge, User, PointsTransaction, Notification } = require('../models');
const { checkAndUnlockAchievements } = require('./rewardService');

const getUserChallenges = async (userId) => {
  const challenges = await Challenge.find({ isActive: true }).sort({ category: 1, pointsReward: 1 });
  const userChallenges = await UserChallenge.find({ userId });

  const challengeMap = new Map();
  userChallenges.forEach(uc => challengeMap.set(uc.challengeId.toString(), uc));

  const result = challenges.map(c => {
    const uc = challengeMap.get(c._id.toString());
    return {
      id: c._id.toString(),
      title: c.title,
      description: c.description,
      category: c.category,
      pointsReward: c.pointsReward,
      actionType: c.actionType,
      targetCount: c.targetCount,
      icon: c.icon,
      progress: uc ? uc.progress : (c.actionType === 'LOGIN' ? 1 : 0),
      completed: uc ? uc.completed : (c.actionType === 'LOGIN'),
      claimed: uc ? uc.claimed : false,
      claimedAt: uc ? uc.claimedAt : null
    };
  });

  return result;
};

const claimChallengeReward = async ({ userId, challengeId }) => {
  const challenge = await Challenge.findById(challengeId);
  if (!challenge || !challenge.isActive) {
    const error = new Error('Challenge not found or inactive.');
    error.statusCode = 404;
    error.code = 'CHALLENGE_NOT_FOUND';
    throw error;
  }

  let uc = await UserChallenge.findOne({ userId, challengeId });
  if (uc && uc.claimed) {
    const error = new Error('Challenge reward has already been claimed today.');
    error.statusCode = 400;
    error.code = 'ALREADY_CLAIMED';
    throw error;
  }

  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    error.code = 'USER_NOT_FOUND';
    throw error;
  }

  // Credit Points and XP
  user.pointsBalance += challenge.pointsReward;
  user.xp += Math.floor(challenge.pointsReward * 0.4);
  if (user.xp >= user.level * 500) {
    user.level += 1;
  }
  await user.save();

  if (!uc) {
    uc = new UserChallenge({
      userId,
      challengeId,
      progress: challenge.targetCount,
      completed: true,
      completedAt: new Date(),
      claimed: true,
      claimedAt: new Date()
    });
  } else {
    uc.completed = true;
    uc.claimed = true;
    uc.claimedAt = new Date();
    uc.progress = challenge.targetCount;
  }
  await uc.save();

  // Log Transaction
  await PointsTransaction.create({
    userId: user._id,
    type: 'CHALLENGE_REWARD',
    amount: challenge.pointsReward,
    balanceAfter: user.pointsBalance,
    description: `Completed Challenge: ${challenge.title}`
  });

  // Create Notification
  await Notification.create({
    userId: user._id,
    title: '⚡ Challenge Completed!',
    message: `You completed "${challenge.title}" and earned +${challenge.pointsReward} VE Points!`,
    type: 'CHALLENGE'
  });

  checkAndUnlockAchievements(user._id);

  return {
    challengeId: challenge._id.toString(),
    title: challenge.title,
    pointsAwarded: challenge.pointsReward,
    newBalance: user.pointsBalance,
    level: user.level,
    xp: user.xp,
    claimed: true
  };
};

module.exports = {
  getUserChallenges,
  claimChallengeReward
};
