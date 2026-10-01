const express = require('express');
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');
const { validateRegister, validateLogin, validateInput } = require('../middleware/authValidationMiddleware');

const router = express.Router();

router.post('/register', validateRegister, validateInput, authController.register);
router.post('/login', validateLogin, validateInput, authController.login);
router.get('/me', requireAuth, authController.me);
router.put('/profile', requireAuth, authController.updateProfile);
router.post('/logout', authController.logout);

module.exports = router;
