const { PatientStore, BillStore, ReportStore, ConfigStore } = require('../config/store');

async function getNextPatientId() {
  const config = await ConfigStore.findOne();
  const prefix = (config && config.patientPrefix) || 'PAT';
  const year = new Date().getFullYear();
  const total = await PatientStore.countDocuments();
  const padded = String(total + 1).padStart(4, '0');
  return `${prefix}-${year}-${padded}`;
}

exports.getPatients = async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};
    if (search && search.trim()) {
      const s = search.trim();
      filter = {
        $or: [
          { name: new RegExp(s, 'i') },
          { phone: new RegExp(s, 'i') },
          { patientId: new RegExp(s, 'i') }
        ]
      };
    }
    const patients = await PatientStore.find(filter, { createdAt: -1 });
    res.json({ success: true, count: patients.length, patients });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await PatientStore.findById(id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    // Fetch linked bills and reports
    const bills = await BillStore.find({ patient: patient._id }, { createdAt: -1 });
    const reports = await ReportStore.find({ patient: patient._id }, { createdAt: -1 });

    res.json({
      success: true,
      patient,
      history: {
        bills,
        reports
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createPatient = async (req, res) => {
  try {
    const { name, age, ageUnit, gender, phone, email, address, bloodGroup, emergencyContact, medicalHistory } = req.body;

    if (!name || !age || !gender || !phone) {
      return res.status(400).json({ success: false, message: 'Name, age, gender, and phone number are required.' });
    }

    const patientId = await getNextPatientId();
    const newPatient = await PatientStore.create({
      patientId,
      name: name.trim(),
      age: Number(age),
      ageUnit: ageUnit || 'Years',
      gender,
      phone: phone.trim(),
      email: email ? email.trim() : '',
      address: address ? address.trim() : '',
      bloodGroup: bloodGroup || '',
      emergencyContact: emergencyContact || '',
      medicalHistory: medicalHistory || '',
      totalVisits: 1,
      lastVisitDate: new Date(),
      registeredBy: req.user ? req.user._id : null
    });

    res.status(201).json({ success: true, patient: newPatient });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await PatientStore.findByIdAndUpdate(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    res.json({ success: true, patient: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await PatientStore.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    res.json({ success: true, message: 'Patient record removed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

