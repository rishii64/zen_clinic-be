const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, testController.getTests);
router.get('/:id', protect, testController.getTestById);
router.post('/', protect, authorize('Admin'), testController.createTest);
router.put('/:id', protect, authorize('Admin'), testController.updateTest);
router.delete('/:id', protect, authorize('Admin'), testController.deleteTest);

module.exports = router;

