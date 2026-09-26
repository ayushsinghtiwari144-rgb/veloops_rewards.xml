const express = require('express');
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');
const { validateRegisterInput, validateLoginInput } = require('../middleware/authValidationMiddleware');
const { authLimiter } = require('../middleware/rateLimitMiddleware');

const router = express.Router();

// POST /api/auth/register
router.post('/register', authLimiter, validateRegisterInput, authController.register);

// POST /api/auth/login
router.post('/login', authLimiter, validateLoginInput, authController.login);

// GET /api/auth/me (Protected route)
router.get('/me', requireAuth, authController.me);

// POST /api/auth/logout
router.post('/logout', authController.logout);

module.exports = router;
