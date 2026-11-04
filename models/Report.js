const mongoose = require('mongoose');

const resultItemSchema = new mongoose.Schema({
  paramName: { type: String, required: true },
  resultValue: { type: String, default: '' },
  unit: { type: String, default: '' },
  refRange: { type: String, default: '' },
  flag: {
    type: String,
    enum: ['Normal', 'High', 'Low', 'Critical', 'Abnormal', 'Positive', 'Negative', 'Reactive', 'Non-Reactive'],
    default: 'Normal'
  },
  notes: { type: String, default: '' }
});

const testReportItemSchema = new mongoose.Schema({
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' },
  testCode: { type: String, required: true },
  testName: { type: String, required: true },
  category: { type: String, default: '' },
  sampleType: { type: String, default: 'Venous Blood' },
  method: { type: String, default: '' },
  results: [resultItemSchema],
  impression: { type: String, default: '' },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending'
  }
});

const reportSchema = new mongoose.Schema(
  {
    reportNumber: { type: String, required: true, unique: true, index: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    patientSnapshot: {
      patientId: String,
      name: String,
      age: Number,
      ageUnit: String,
      gender: String,
      phone: String,
      address: String
    },
    bill: { type: mongoose.Schema.Types.ObjectId, ref: 'Bill' },
    invoiceNumber: { type: String, default: '' },
    sampleCollectedAt: { type: Date, default: Date.now },
    sampleReceivedAt: { type: Date, default: Date.now },
    reportedAt: { type: Date, default: null },
    referringDoctor: { type: String, default: 'Self' },
    tests: [testReportItemSchema],
    status: {
      type: String,
      enum: ['Sample Collected', 'In Progress', 'Completed', 'Approved', 'Delivered'],
      default: 'Sample Collected'
    },
    technician: {
      name: { type: String, default: '' },
      qualifications: { type: String, default: '' },
      regNo: { type: String, default: '' },
      signatureUrl: { type: String, default: '' }
    },
    doctor: {
      name: { type: String, default: '' },
      qualifications: { type: String, default: 'M.B.B.S' },
      regNo: { type: String, default: '' },
      designation: { type: String, default: 'Consultant Pathologist' },
      signatureUrl: { type: String, default: '' }
    },
    overallImpression: { type: String, default: '' },
    doctorRemarks: { type: String, default: '' },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);