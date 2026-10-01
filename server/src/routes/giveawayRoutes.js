const express = require('express');
const giveawayController = require('../controllers/giveawayController');
const { optionalAuth, requireAuth } = require('../middleware/authMiddleware');
const { validateObjectId, sanitizeClientInput } = require('../middleware/validationMiddleware');
const { joinLimiter, claimLimiter } = require('../middleware/rateLimitMiddleware');
const { checkGiveawayFraudRisk } = require('../middleware/fraudMiddleware');

const router = express.Router();

// GET /api/giveaways/current - Fetch active giveaways from MongoDB
router.get('/current', giveawayController.getCurrentGiveaways);

// GET /api/giveaways/previous - Fetch completed giveaways from MongoDB
router.get('/previous', giveawayController.getPreviousGiveaways);

// GET /api/giveaways/previous/winners - Fetch historical public winners
router.get('/previous/winners', giveawayController.getPreviousWinnersList);

// ALL /api/giveaways/seed - Seed sample phone giveaways into MongoDB Atlas
router.all('/seed', giveawayController.seedDatabase);

// GET /api/giveaways/:id - Fetch giveaway details by ID or slug
router.get('/:id', validateObjectId('id'), giveawayController.getGiveawayById);

// GET /api/giveaways/:id/my-status - User participation status
router.get('/:id/my-status', requireAuth, giveawayController.getMyStatus);

// POST /api/giveaways/:id/join - Real giveaway join transaction route (Rate limited & Fraud assessed)
router.post(
  '/:id/join',
  joinLimiter,
  requireAuth,
  sanitizeClientInput,
  checkGiveawayFraudRisk,
  giveawayController.joinGiveaway
);

// GET /api/giveaways/:id/winners - Public winners for specific giveaway
router.get('/:id/winners', giveawayController.getWinners);

// POST /api/giveaways/:id/claim - Placeholder endpoint for prize claim
router.post(
  '/:id/claim',
  claimLimiter,
  requireAuth,
  giveawayController.claimPrize
);

// GET /api/giveaways/:id/my-claim - User claim status
router.get('/:id/my-claim', optionalAuth, giveawayController.getMyClaim);

module.exports = router;
