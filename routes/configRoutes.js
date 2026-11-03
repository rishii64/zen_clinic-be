const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', configController.getConfig); // Public/protected for clinic banner
router.put('/', protect, authorize('Admin'), configController.updateConfig);

module.exports = router;

