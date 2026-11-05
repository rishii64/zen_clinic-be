const { TestStore, MongooseModels } = require('../config/store');
const tariffMaster = require('../data/tariffMaster');

/**
 * Synchronize all 74 master tests from the official clinic tariff sheet
 */
const syncTariffInternal = async () => {
  const TestModel = MongooseModels.Test;
  let createdCount = 0;
  let updatedCount = 0;

  for (const t of tariffMaster) {
    const existing = await TestModel.findOne({ code: t.code });
    if (!existing) {
      await TestModel.create({ ...t, isActive: true });
      createdCount++;
    } else {
      await TestModel.updateOne(
        { code: t.code },
        {
          $set: {
            name: t.name,
            category: t.category,
            sampleType: t.sampleType,
            price: t.price,
            turnaroundTime: t.turnaroundTime,
            testType: t.testType,
            parameters: t.parameters,
            isActive: true
          }
        }
      );
      updatedCount++;
    }
  }

  return { total: tariffMaster.length, createdCount, updatedCount };
};

exports.getTests = async (req, res) => {
  try {
    const { category, search, activeOnly } = req.query;

    // Auto-seed if database has 0 tests
    const totalCount = await TestStore.countDocuments();
    if (totalCount === 0) {
      await syncTariffInternal();
    }

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

exports.syncMasterTariff = async (req, res) => {
  try {
    const result = await syncTariffInternal();
    const tests = await TestStore.find({}, { name: 1 });
    res.json({
      success: true,
      message: `Synchronized ${result.total} master tests from clinic tariff rate sheet.`,
      result,
      count: tests.length,
      tests
    });
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
