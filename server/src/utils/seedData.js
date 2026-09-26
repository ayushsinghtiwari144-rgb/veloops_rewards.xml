const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/env');
const { Giveaway, Prize, GiveawayPrize, User, GiveawayWinner } = require('../models');

const seedDatabase = async () => {
  try {
    console.log('[SEED] Connecting to database for seeding...');
    await mongoose.connect(config.mongoUri);

    console.log('[SEED] Clearing existing records...');
    await Giveaway.deleteMany({});
    await Prize.deleteMany({});
    await GiveawayPrize.deleteMany({});
    await User.deleteMany({});
    await GiveawayWinner.deleteMany({});

    console.log('[SEED] Creating sample users...');
    const userPasswordHash = await bcrypt.hash('password123', 10);
    const adminPasswordHash = await bcrypt.hash('admin123', 10);

    const testUser = await User.create({
      name: 'Demo Member',
      email: 'user@veloop.com',
      passwordHash: userPasswordHash,
      role: 'USER',
      status: 'ACTIVE',
      pointsBalance: 500
    });

    const testAdmin = await User.create({
      name: 'System Admin',
      email: 'admin@veloop.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
      pointsBalance: 10000
    });

    console.log('[SEED] Creating sample prizes...');
    const prize1 = await Prize.create({
      name: 'Apple iPhone 15 Pro (256GB)',
      description: 'Aerospace-grade titanium design with A17 Pro chip.',
      image: 'iphone',
      prizeType: 'PHYSICAL',
      value: 999,
      currency: 'USD'
    });

    const prize2 = await Prize.create({
      name: 'Apple Watch Series 9 GPS',
      description: 'Advanced health and activity tracker with Double Tap gesture.',
      image: 'watch',
      prizeType: 'PHYSICAL',
      value: 399,
      currency: 'USD'
    });

    const prize3 = await Prize.create({
      name: 'Apple AirPods Pro 2nd Gen',
      description: 'Active Noise Cancellation and Spatial Audio.',
      image: 'airpods',
      prizeType: 'PHYSICAL',
      value: 249,
      currency: 'USD'
    });

    const prize4 = await Prize.create({
      name: '$500 Amazon eGift Card',
      description: 'Digital gift voucher redeemable on Amazon worldwide.',
      image: 'giftcard',
      prizeType: 'GIFT_CARD',
      value: 500,
      currency: 'USD'
    });

    const prize5 = await Prize.create({
      name: 'Sony PlayStation 5 Slim',
      description: 'Ultra-high speed SSD gaming console with DualSense controller.',
      image: 'ps5',
      prizeType: 'PHYSICAL',
      value: 499,
      currency: 'USD'
    });

    console.log('[SEED] Creating giveaways...');
    const now = new Date();
    const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const fiveDaysLater = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
    const tenDaysLater = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);
    const pastTenDays = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
    const pastTwoDays = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

    const gw1 = await Giveaway.create({
      title: 'Apple iPhone 15 Pro (256GB)',
      slug: 'iphone-15-pro',
      description: 'Win the brand new iPhone 15 Pro featuring Titanium design.',
      status: 'ACTIVE',
      startDate: now,
      endDate: threeDaysLater,
      entryCurrency: 'VELOOP Points',
      entryAmount: 50,
      eligibility: 'Verified members aged 18+. One entry per account.',
      rules: ['Single entry ticket per account', 'Fair random drawing upon timer end'],
      terms: 'Non-transferable reward.',
      winnerCount: 1,
      isActive: true
    });

    const gw2 = await Giveaway.create({
      title: 'Apple Watch Series 9 GPS',
      slug: 'apple-watch-series-9',
      description: 'Track your health and fitness with Series 9 GPS.',
      status: 'ACTIVE',
      startDate: now,
      endDate: fiveDaysLater,
      entryCurrency: 'VELOOP Points',
      entryAmount: 30,
      eligibility: 'All active platform members.',
      rules: ['Single ticket allowed'],
      terms: 'Worldwide shipping included.',
      winnerCount: 1,
      isActive: true
    });

    const gw3 = await Giveaway.create({
      title: 'Apple AirPods Pro 2nd Gen',
      slug: 'airpods-pro-2',
      description: 'Active Noise Cancellation and Spatial Audio.',
      status: 'ACTIVE',
      startDate: now,
      endDate: threeDaysLater,
      entryCurrency: 'VELOOP Points',
      entryAmount: 20,
      eligibility: 'All platform users.',
      rules: ['Single entry ticket'],
      terms: 'Digital claim notice sent.',
      winnerCount: 1,
      isActive: true
    });

    const gw4 = await Giveaway.create({
      title: '$500 Amazon eGift Card',
      slug: 'amazon-500-gift-card',
      description: 'Shop millions of items online with $500 Amazon Gift Code.',
      status: 'UPCOMING',
      startDate: fiveDaysLater,
      endDate: tenDaysLater,
      entryCurrency: 'VELOOP Points',
      entryAmount: 15,
      eligibility: 'Pre-registered members.',
      rules: ['Bonus entry ticket for early registration'],
      terms: 'Instant digital delivery.',
      winnerCount: 1,
      isActive: true
    });

    const gw5 = await Giveaway.create({
      title: 'Sony PlayStation 5 Slim Edition',
      slug: 'sony-playstation-5-slim',
      description: 'Unleash next-gen gaming performance with 3D Audio.',
      status: 'ENDED',
      startDate: pastTenDays,
      endDate: pastTwoDays,
      entryCurrency: 'VELOOP Points',
      entryAmount: 100,
      eligibility: 'Global members.',
      rules: ['Event concluded'],
      terms: 'Prize dispatched to verified winner.',
      winnerCount: 1,
      isActive: true
    });

    console.log('[SEED] Mapping giveaway prizes...');
    await GiveawayPrize.create({ giveawayId: gw1._id, prizeId: prize1._id, position: 1, quantity: 1 });
    await GiveawayPrize.create({ giveawayId: gw2._id, prizeId: prize2._id, position: 1, quantity: 1 });
    await GiveawayPrize.create({ giveawayId: gw3._id, prizeId: prize3._id, position: 1, quantity: 1 });
    await GiveawayPrize.create({ giveawayId: gw4._id, prizeId: prize4._id, position: 1, quantity: 1 });
    await GiveawayPrize.create({ giveawayId: gw5._id, prizeId: prize5._id, position: 1, quantity: 1 });

    console.log('[SEED] Seeding completed successfully!');
    console.log('Sample USER Credentials: user@veloop.com / password123');
    console.log('Sample ADMIN Credentials: admin@veloop.com / admin123');
    process.exit(0);
  } catch (err) {
    console.error('[SEED] Seeding Error:', err);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
