const express = require('express');
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');
const { validateRegisterInput, validateLoginInput } = require('../middleware/authValidationMiddleware');

const router = express.Router();

router.post('/register', validateRegisterInput, authController.register);
router.post('/login', validateLoginInput, authController.login);
router.get('/me', requireAuth, authController.me);
router.put('/profile', requireAuth, authController.updateProfile);
router.post('/logout', authController.logout);

module.exports = router;
