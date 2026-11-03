const { TestStore } = require('../config/store');

exports.getTests = async (req, res) => {
  try {
    const { category, search, activeOnly } = req.query;
    let filter = {};

    if (activeOnly !== 'false') {
      filter.isActive = true;
    }
    if (category && category !== 'All') {
      filter.category = category;
    }
    if (search && search.trim()) {
      const s = search.trim();
      filter.$or = [
        { name: new RegExp(s, 'i') },
        { code: new RegExp(s, 'i') },
        { category: new RegExp(s, 'i') }
      ];
    }

    const tests = await TestStore.find(filter, { name: 1 });
    res.json({ success: true, count: tests.length, tests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTestById = async (req, res) => {
  try {
    const { id } = req.params;
    const test = await TestStore.findById(id);
    if (!test) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }
    res.json({ success: true, test });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createTest = async (req, res) => {
  try {
    const { code, name, category, sampleType, price, taxRate, turnaroundTime, testType, parameters, instructions } = req.body;

    if (!code || !name || !category || price === undefined) {
      return res.status(400).json({ success: false, message: 'Test code, name, category, and price are required.' });
    }

    const existing = await TestStore.findOne({ code: code.toUpperCase().trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Test with this code already exists.' });
    }

    const newTest = await TestStore.create({
      code: code.toUpperCase().trim(),
      name: name.trim(),
      category,
      sampleType: sampleType || 'Venous Blood',
      price: Number(price),
      taxRate: Number(taxRate || 0),
      turnaroundTime: turnaroundTime || 'Same Day',
      testType: testType || 'quantitative',
      parameters: parameters || [],
      instructions: instructions || '',
      isActive: true
    });

    res.status(201).json({ success: true, test: newTest });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateTest = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await TestStore.findByIdAndUpdate(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }
    res.json({ success: true, test: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteTest = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await TestStore.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }
    res.json({ success: true, message: 'Test removed from catalog.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

