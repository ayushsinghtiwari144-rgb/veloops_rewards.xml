const express = require('express');
const transactionController = require('../controllers/transactionController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', requireAuth, transactionController.getTransactions);
router.get('/redemptions', requireAuth, transactionController.getRedemptions);

module.exports = router;
