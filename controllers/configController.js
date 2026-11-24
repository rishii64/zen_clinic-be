const { ConfigStore } = require('../config/store');

exports.getConfig = async (req, res) => {
  try {
    let config = await ConfigStore.findOne();
    if (!config) {
      config = await ConfigStore.create({ email: 'rajjanchghar@gmail.com' });
    } else {
      let needsUpdate = false;
      const updates = {};
      if (config.clinicName === 'Zen Clinic' || !config.doctorDetails?.name) {
        updates.clinicName = 'RAJ JANCH GHAR';
        updates.address = config.address || 'MAIN ROAD NETA JI CHOWK SAHARGHAT';
        updates.regNumber = config.regNumber || 'Reg No - 430/2022';
        updates.doctorDetails = {
          name: config.doctorDetails?.name || 'Dr. R.K. MANDAL',
          qualifications: config.doctorDetails?.qualifications || 'M.B.B.S',
          regNo: config.doctorDetails?.regNo || '18840',
          designation: config.doctorDetails?.designation || 'Consultant Pathologist & Medical Officer'
        };
        updates.technicianDetails = {
          name: config.technicianDetails?.name || 'Mr. R.K. Raut',
          qualifications: config.technicianDetails?.qualifications || '(BMLT) Jaipur',
          regNo: config.technicianDetails?.regNo || '',
          designation: config.technicianDetails?.designation || 'Chief Lab Technologist'
        };
        updates.watermarkText = config.watermarkText || 'SAHARGHAT';
        needsUpdate = true;
      }
      if (!config.email) {
        updates.email = 'rajjanchghar@gmail.com';
        needsUpdate = true;
      }
      if (needsUpdate) {
        config = await ConfigStore.findByIdAndUpdate(config._id, updates, { new: true });
      }
    }
    res.json({ success: true, config });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateConfig = async (req, res) => {
  try {
    let config = await ConfigStore.findOne();
    let updated;
    if (config) {
      updated = await ConfigStore.findByIdAndUpdate(config._id, req.body);
    } else {
      updated = await ConfigStore.create(req.body);
    }
    res.json({ success: true, config: updated, message: 'Clinic configuration updated successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
