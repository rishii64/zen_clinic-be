const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

router.get('/', protect, reportController.getReports);
router.get('/:id', protect, reportController.getReportById);
router.put('/:id/results', protect, reportController.updateResults);
router.put('/:id/approve', protect, reportController.approveReport);
router.put('/:id/deliver', protect, reportController.deliverReport);
router.delete('/:id', protect, reportController.deleteReport);

module.exports = router;
