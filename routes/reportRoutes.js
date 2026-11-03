const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, reportController.getReports);
router.get('/:id', protect, reportController.getReportById);
router.put('/:id/results', protect, reportController.updateResults);
router.put('/:id/approve', protect, authorize('Admin', 'Doctor'), reportController.approveReport);
router.put('/:id/deliver', protect, reportController.deliverReport);

module.exports = router;

