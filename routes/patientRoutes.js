const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { protect } = require('../middleware/auth');

router.get('/', protect, patientController.getPatients);
router.get('/:id', protect, patientController.getPatientById);
router.post('/', protect, patientController.createPatient);
router.put('/:id', protect, patientController.updatePatient);
router.delete('/:id', protect, patientController.deletePatient);

module.exports = router;

