require('dotenv').config();
const mongoose = require('mongoose');
const { Reward, Challenge, Achievement } = require('../src/models');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/veloop_rewards';

const sampleRewards = [
  {
    title: 'Apple iPhone 15 Pro (256GB)',
    slug: 'iphone-15-pro-256gb',
    description: 'Aerospace-grade titanium design with A17 Pro chip and Super Retina XDR display.',
    category: 'ELECTRONICS',
    pointsRequired: 15000,
    stock: 5,
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
    itemType: 'PHYSICAL',
    status: 'ACTIVE',
    featured: true
  },
  {
    title: 'Samsung Galaxy S24 Ultra (512GB)',
    slug: 'samsung-s24-ultra-512gb',
    description: 'Galaxy AI innovation with Snapdragon 8 Gen 3 and 200MP camera system.',
    category: 'ELECTRONICS',
    pointsRequired: 18000,
    stock: 4,
    imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
    itemType: 'PHYSICAL',
    status: 'ACTIVE',
    featured: true
  },
  {
    title: 'Apple Watch Series 9 GPS (45mm)',
    slug: 'apple-watch-series-9',
    description: 'Advanced health metrics, Double Tap gesture control, and bright always-on display.',
    category: 'WEARABLES',
    pointsRequired: 8000,
    stock: 8,
    imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80',
    itemType: 'PHYSICAL',
    status: 'ACTIVE',
    featured: true
  },
  {
    title: 'Sony WF-1000XM5 Wireless Earbuds',
    slug: 'sony-wf1000xm5-earbuds',
    description: 'Industry-leading noise canceling with High-Resolution Audio Wireless support.',
    category: 'AUDIO',
    pointsRequired: 5000,
    stock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    itemType: 'PHYSICAL',
    status: 'ACTIVE',
    featured: false
  },
  {
    title: '$50 Amazon E-Gift Card',
    slug: 'amazon-gift-card-50',
    description: 'Instant digital code redeemable for millions of products on Amazon.',
    category: 'GIFT_CARDS',
    pointsRequired: 2500,
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0a67daf4095a?w=600&auto=format&fit=crop&q=80',
    itemType: 'DIGITAL',
    status: 'ACTIVE',
    featured: true
  },
  {
    title: '$100 Apple Store & iTunes Card',
    slug: 'apple-gift-card-100',
    description: 'Digital gift card for apps, games, music, movies, and Apple hardware.',
    category: 'GIFT_CARDS',
    pointsRequired: 5000,
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    itemType: 'DIGITAL',
    status: 'ACTIVE',
    featured: false
  },
  {
    title: 'Sony PlayStation 5 Slim Console',
    slug: 'playstation-5-slim',
    description: 'Next-gen gaming power with ultra-high speed SSD and DualSense haptic feedback.',
    category: 'GAMING',
    pointsRequired: 20000,
    stock: 3,
    imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80',
    itemType: 'PHYSICAL',
    status: 'ACTIVE',
    featured: true
  },
  {
    title: 'Razer BlackWidow V4 Pro Mechanical Keyboard',
    slug: 'razer-blackwidow-v4-pro',
    description: 'Command dial, dedicated macro keys, and customizable Chroma RGB per key.',
    category: 'GAMING',
    pointsRequired: 4000,
    stock: 10,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    itemType: 'PHYSICAL',
    status: 'ACTIVE',
    featured: false
  }
];

const sampleChallenges = [
  {
    title: 'Daily Login Reward',
    description: 'Log into VELOOP Rewards Hub today to collect your daily points bonus.',
    category: 'DAILY',
    pointsReward: 50,
    actionType: 'LOGIN',
    targetCount: 1,
    icon: 'Sun',
    isActive: true
  },
  {
    title: 'Complete Profile Details',
    description: 'Verify your name and account details in your profile settings.',
    category: 'DAILY',
    pointsReward: 100,
    actionType: 'PROFILE_UPDATE',
    targetCount: 1,
    icon: 'UserCheck',
    isActive: true
  },
  {
    title: 'Refer a Friend',
    description: 'Invite a colleague or friend to join VELOOP Rewards Hub.',
    category: 'WEEKLY',
    pointsReward: 250,
    actionType: 'REFERRAL',
    targetCount: 1,
    icon: 'Users',
    isActive: true
  },
  {
    title: 'Daily Platform Activity',
    description: 'Explore the Rewards Store or Leaderboard today.',
    category: 'DAILY',
    pointsReward: 150,
    actionType: 'DAILY_ACTIVITY',
    targetCount: 1,
    icon: 'CheckSquare',
    isActive: true
  },
  {
    title: 'Redeem Your First Reward',
    description: 'Redeem any physical or digital item from the Rewards Store.',
    category: 'WEEKLY',
    pointsReward: 300,
    actionType: 'REDEEM_REWARD',
    targetCount: 1,
    icon: 'Gift',
    isActive: true
  }
];

const sampleAchievements = [
  {
    title: 'First Reward',
    description: 'Redeem your very first reward from the VELOOP Store.',
    badgeKey: 'FIRST_REWARD',
    icon: 'Gift',
    pointsReward: 100,
    requirementType: 'REWARDS_REDEEMED',
    requirementValue: 1
  },
  {
    title: '7 Day Streak',
    description: 'Log in to VELOOP Rewards Hub for 7 consecutive days.',
    badgeKey: 'STREAK_7',
    icon: 'Zap',
    pointsReward: 250,
    requirementType: 'STREAK_DAYS',
    requirementValue: 7
  },
  {
    title: '1,000 Points Club',
    description: 'Earn a total of 1,000 VE points across activities.',
    badgeKey: 'POINTS_1000',
    icon: 'Trophy',
    pointsReward: 200,
    requirementType: 'POINTS_EARNED',
    requirementValue: 1000
  },
  {
    title: 'Challenge Master',
    description: 'Complete 10 daily or weekly challenges.',
    badgeKey: 'CHALLENGE_MASTER',
    icon: 'CheckCircle',
    pointsReward: 300,
    requirementType: 'CHALLENGES_COMPLETED',
    requirementValue: 10
  },
  {
    title: 'Reward Collector',
    description: 'Redeem 5 physical or digital rewards in total.',
    badgeKey: 'REWARD_COLLECTOR',
    icon: 'ShoppingBag',
    pointsReward: 500,
    requirementType: 'REWARDS_REDEEMED',
    requirementValue: 5
  }
];

const runSeeder = async () => {
  let rewardCount = 0;
  for (const r of sampleRewards) {
    await Reward.findOneAndUpdate({ slug: r.slug }, r, { upsert: true, new: true });
    rewardCount++;
  }

  let challengeCount = 0;
  for (const c of sampleChallenges) {
    await Challenge.findOneAndUpdate({ actionType: c.actionType, title: c.title }, c, { upsert: true, new: true });
    challengeCount++;
  }

  let achievementCount = 0;
  for (const a of sampleAchievements) {
    await Achievement.findOneAndUpdate({ badgeKey: a.badgeKey }, a, { upsert: true, new: true });
    achievementCount++;
  }

  return { rewardCount, challengeCount, achievementCount };
};

const autoSeedIfEmpty = async () => {
  try {
    const rewardCount = await Reward.countDocuments({ status: 'ACTIVE' });
    if (rewardCount === 0) {
      console.log('[AUTO-SEED HUB] Zero rewards found in database. Seeding Hub data...');
      const result = await runSeeder();
      console.log(`[AUTO-SEED HUB SUCCESS] Seeded ${result.rewardCount} rewards, ${result.challengeCount} challenges, ${result.achievementCount} achievements.`);
    }
  } catch (err) {
    console.error('[AUTO-SEED HUB ERROR]', err.message);
  }
};

const standaloneSeed = async () => {
  try {
    console.log(`[HUB SEED] Connecting to MongoDB: ${MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`);
    await mongoose.connect(MONGO_URI);
    console.log('[HUB SEED] Connected successfully.');
    const result = await runSeeder();
    console.log(`[HUB SEED SUCCESS] Seeded ${result.rewardCount} rewards, ${result.challengeCount} challenges, ${result.achievementCount} achievements.`);
    process.exit(0);
  } catch (err) {
    console.error('[HUB SEED ERROR]', err);
    process.exit(1);
  }
};

if (require.main === module) {
  standaloneSeed();
}

module.exports = {
  autoSeedIfEmpty,
  runSeeder
};
