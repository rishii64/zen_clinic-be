const mongoose = require('mongoose');

const parameterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  unit: { type: String, default: '' },
  refRangeGeneral: { type: String, default: '' },
  refRangeMale: { type: String, default: '' },
  refRangeFemale: { type: String, default: '' },
  refRangeMin: { type: Number, default: null },
  refRangeMax: { type: Number, default: null },
  options: [{ type: String }],
  defaultValue: { type: String, default: '' },
  method: { type: String, default: '' }
});

const testSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: [
        'Hematology',
        'Biochemistry',
        'Liver Function',
        'Kidney & Renal',
        'Lipid & Cardiac',
        'Endocrine & Thyroid',
        'Serology & Immunology',
        'Card Tests',
        'Clinical Pathology',
        'Cytology & Biopsy',
        'Radiology & Diagnostic'
      ]
    },
    sampleType: { type: String, default: 'Venous Blood' },
    price: { type: Number, required: true, min: 0 },
    taxRate: { type: Number, default: 0 },
    turnaroundTime: { type: String, default: 'Same Day' },
    testType: {
      type: String,
      enum: ['quantitative', 'qualitative', 'panel', 'narrative'],
      default: 'quantitative'
    },
    parameters: [parameterSchema],
    instructions: { type: String, default: '' },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Test', testSchema);

