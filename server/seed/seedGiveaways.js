require('dotenv').config();
const mongoose = require('mongoose');
const { Giveaway, Prize, GiveawayPrize } = require('../src/models');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/veloop_rewards';

const samplePrizes = [
  {
    name: 'Apple iPhone 15 Pro (256GB)',
    description: 'Aerospace-grade titanium design with A17 Pro chip.',
    image: 'iphone',
    prizeType: 'PHYSICAL',
    value: 999,
    currency: 'USD'
  },
  {
    name: 'Samsung Galaxy S24 Ultra (512GB)',
    description: 'Galaxy AI features with Snapdragon 8 Gen 3 and 200MP camera.',
    image: 'samsung',
    prizeType: 'PHYSICAL',
    value: 1299,
    currency: 'USD'
  },
  {
    name: 'Google Pixel 9 Pro (256GB)',
    description: 'Advanced Gemini AI integration with Pro triple camera system.',
    image: 'pixel',
    prizeType: 'PHYSICAL',
    value: 999,
    currency: 'USD'
  },
  {
    name: 'OnePlus 12 5G (512GB)',
    description: 'Trinity Engine with Hasselblad 4th Gen Camera System and 100W charging.',
    image: 'oneplus',
    prizeType: 'PHYSICAL',
    value: 799,
    currency: 'USD'
  },
  {
    name: 'Apple Watch Series 9 GPS',
    description: 'Advanced health and activity tracker with Double Tap gesture.',
    image: 'watch',
    prizeType: 'PHYSICAL',
    value: 399,
    currency: 'USD'
  },
  {
    name: 'Sony PlayStation 5 Slim',
    description: 'Ultra-high speed SSD gaming console with DualSense controller.',
    image: 'ps5',
    prizeType: 'PHYSICAL',
    value: 499,
    currency: 'USD'
  }
];

const now = new Date();
const past5Days = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
const past3Days = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
const past2Days = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
const past1Day = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);

const future30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
const future35Days = new Date(now.getTime() + 35 * 24 * 60 * 60 * 1000);
const future40Days = new Date(now.getTime() + 40 * 24 * 60 * 60 * 1000);
const future5Days = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
const future20Days = new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000);
const past30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

const sampleGiveaways = [
  {
    title: 'Apple iPhone 15 Pro (256GB)',
    slug: 'iphone-15-pro',
    description: 'Win the brand new iPhone 15 Pro featuring Titanium design.',
    status: 'ACTIVE',
    startDate: past5Days,
    endDate: future30Days,
    entryCurrency: 'VELOOP Points',
    entryAmount: 50,
    eligibility: 'Verified members aged 18+. One entry per account.',
    rules: ['Single entry ticket per account', 'Fair random drawing upon timer end'],
    terms: 'Non-transferable reward.',
    winnerCount: 1,
    isActive: true,
    prizeIndex: 0
  },
  {
    title: 'Samsung Galaxy S24 Ultra (512GB)',
    slug: 'samsung-galaxy-s24-ultra',
    description: 'Experience next-level Galaxy AI innovation and 200MP camera.',
    status: 'ACTIVE',
    startDate: past3Days,
    endDate: future35Days,
    entryCurrency: 'VELOOP Points',
    entryAmount: 45,
    eligibility: 'All platform users.',
    rules: ['Single entry per account'],
    terms: 'Official brand warranty included.',
    winnerCount: 1,
    isActive: true,
    prizeIndex: 1
  },
  {
    title: 'Google Pixel 9 Pro (256GB)',
    slug: 'google-pixel-9-pro',
    description: 'Unleash Google Gemini AI intelligence and studio photo quality.',
    status: 'ACTIVE',
    startDate: past2Days,
    endDate: future40Days,
    entryCurrency: 'VELOOP Points',
    entryAmount: 40,
    eligibility: 'All active platform members.',
    rules: ['Single ticket allowed'],
    terms: 'Worldwide shipping included.',
    winnerCount: 1,
    isActive: true,
    prizeIndex: 2
  },
  {
    title: 'OnePlus 12 5G (512GB)',
    slug: 'oneplus-12-5g',
    description: 'Smooth beyond belief with Hasselblad camera and 100W charging.',
    status: 'ACTIVE',
    startDate: past1Day,
    endDate: future30Days,
    entryCurrency: 'VELOOP Points',
    entryAmount: 35,
    eligibility: 'Verified members.',
    rules: ['Single entry ticket'],
    terms: 'Brand new sealed box.',
    winnerCount: 1,
    isActive: true,
    prizeIndex: 3
  },
  {
    title: 'Apple Watch Series 9 GPS',
    slug: 'apple-watch-series-9',
    description: 'Track your health and fitness with Series 9 GPS.',
    status: 'UPCOMING',
    startDate: future5Days,
    endDate: future20Days,
    entryCurrency: 'VELOOP Points',
    entryAmount: 30,
    eligibility: 'All active platform members.',
    rules: ['Single ticket allowed'],
    terms: 'Worldwide shipping included.',
    winnerCount: 1,
    isActive: true,
    prizeIndex: 4
  },
  {
    title: 'Sony PlayStation 5 Slim Edition',
    slug: 'sony-playstation-5-slim',
    description: 'Unleash next-gen gaming performance with 3D Audio.',
    status: 'ENDED',
    startDate: past30Days,
    endDate: past5Days,
    entryCurrency: 'VELOOP Points',
    entryAmount: 100,
    eligibility: 'Global members.',
    rules: ['Event concluded'],
    terms: 'Prize dispatched to verified winner.',
    winnerCount: 1,
    isActive: true,
    prizeIndex: 5
  }
];

const seed = async () => {
  try {
    console.log(`[SEED] Connecting to MongoDB: ${MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`);
    await mongoose.connect(MONGO_URI);
    console.log('[SEED] Connected successfully.');

    const prizeDocs = [];
    for (const p of samplePrizes) {
      const prizeDoc = await Prize.findOneAndUpdate(
        { name: p.name },
        p,
        { upsert: true, new: true }
      );
      prizeDocs.push(prizeDoc);
    }
    console.log(`[SEED] ${prizeDocs.length} prizes upserted.`);

    let count = 0;
    for (const g of sampleGiveaways) {
      const { prizeIndex, ...giveawayData } = g;
      const giveawayDoc = await Giveaway.findOneAndUpdate(
        { slug: g.slug },
        giveawayData,
        { upsert: true, new: true }
      );

      const targetPrize = prizeDocs[prizeIndex];
      if (targetPrize) {
        await GiveawayPrize.findOneAndUpdate(
          { giveawayId: giveawayDoc._id, prizeId: targetPrize._id },
          { giveawayId: giveawayDoc._id, prizeId: targetPrize._id, position: 1, quantity: 1 },
          { upsert: true, new: true }
        );
      }
      count++;
    }

    console.log(`[SEED] Successfully seeded ${count} sample giveaways into MongoDB.`);
    process.exit(0);
  } catch (err) {
    console.error('[SEED ERROR]', err);
    process.exit(1);
  }
};

seed();
