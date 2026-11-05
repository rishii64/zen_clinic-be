const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');
const { protect } = require('../middleware/auth');

router.get('/', configController.getConfig);
router.put('/', protect, configController.updateConfig);

module.exports = router;
