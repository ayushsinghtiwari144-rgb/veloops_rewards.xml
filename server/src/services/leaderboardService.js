const { User } = require('../models');
const { maskUserIdentifier } = require('../utils/maskUtils');

const getLeaderboard = async (period = 'weekly') => {
  const users = await User.find({ status: 'ACTIVE' })
    .select('name email pointsBalance level avatarUrl createdAt')
    .sort({ pointsBalance: -1, level: -1 })
    .limit(50);

  const leaderboard = users.map((u, index) => {
    return {
      rank: index + 1,
      id: u._id.toString(),
      name: maskUserIdentifier(u.name),
      points: u.pointsBalance,
      level: u.level || 1,
      avatarUrl: u.avatarUrl || ''
    };
  });

  return {
    period,
    updatedAt: new Date(),
    leaderboard
  };
};

module.exports = {
  getLeaderboard
};
