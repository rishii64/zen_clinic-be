const { ConfigStore } = require('../config/store');

exports.getConfig = async (req, res) => {
  try {
    let config = await ConfigStore.findOne();
    if (!config) {
      config = await ConfigStore.create({});
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

