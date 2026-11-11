const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/forgot-password', authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);
router.get('/setup-status', authController.getSetupStatus);
router.get('/me', protect, authController.getMe);
router.get('/users', protect, authController.getUsers);
router.post('/users', protect, authController.createUser);
router.put('/users/:id', protect, authController.updateUser);

module.exports = router;
