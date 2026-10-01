const express = require('express');
const challengeController = require('../controllers/challengeController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', requireAuth, challengeController.getChallenges);
router.post('/:id/claim', requireAuth, challengeController.claimChallenge);

module.exports = router;
