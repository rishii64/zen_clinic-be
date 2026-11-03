const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

router.post('/login', authController.login);
router.get('/me', protect, authController.getMe);
router.get('/users', protect, authorize('Admin'), authController.getUsers);
router.post('/users', protect, authorize('Admin'), authController.createUser);
router.put('/users/:id', protect, authorize('Admin'), authController.updateUser);

module.exports = router;

