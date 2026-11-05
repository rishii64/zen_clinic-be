const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const { protect } = require('../middleware/auth');

router.get('/', protect, testController.getTests);
router.post('/sync-tariff', protect, testController.syncMasterTariff);
router.get('/:id', protect, testController.getTestById);
router.post('/', protect, testController.createTest);
router.put('/:id', protect, testController.updateTest);
router.delete('/:id', protect, testController.deleteTest);

module.exports = router;
