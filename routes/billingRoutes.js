const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');
const { protect } = require('../middleware/auth');

router.get('/', protect, billingController.getBills);
router.get('/:id', protect, billingController.getBillById);
router.post('/', protect, billingController.createBill);
router.post('/:id/payments', protect, billingController.addPayment);
router.post('/:id/cancel', protect, billingController.cancelBill);

module.exports = router;
