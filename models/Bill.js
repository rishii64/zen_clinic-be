const mongoose = require('mongoose');

const billItemSchema = new mongoose.Schema({
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' },
  testCode: { type: String, required: true },
  testName: { type: String, required: true },
  category: { type: String, default: '' },
  sampleType: { type: String, default: '' },
  unitPrice: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  totalAmount: { type: Number, required: true }
});

const paymentRecordSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  mode: {
    type: String,
    enum: ['Cash', 'UPI', 'Card', 'Net Banking', 'Cheque'],
    default: 'Cash'
  },
  transactionId: { type: String, default: '' },
  receivedAt: { type: Date, default: Date.now },
  receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  note: { type: String, default: '' }
});

const billSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true, index: true },
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
    referringDoctor: { type: String, default: 'Self' },
    items: [billItemSchema],
    subtotal: { type: Number, required: true },
    discountType: { type: String, enum: ['flat', 'percentage'], default: 'flat' },
    discountValue: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    discountReason: { type: String, default: '' },
    isGstBill: { type: Boolean, default: false },
    gstRate: { type: Number, default: 0 },
    cgstRate: { type: Number, default: 0 },
    cgstAmount: { type: Number, default: 0 },
    sgstRate: { type: Number, default: 0 },
    sgstAmount: { type: Number, default: 0 },
    igstRate: { type: Number, default: 0 },
    igstAmount: { type: Number, default: 0 },
    isInterState: { type: Boolean, default: false },
    grandTotal: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    dueAmount: { type: Number, default: 0 },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Partially Paid', 'Unpaid'],
      default: 'Unpaid'
    },
    payments: [paymentRecordSchema],
    report: { type: mongoose.Schema.Types.ObjectId, ref: 'Report' },
    status: { type: String, enum: ['Active', 'Cancelled', 'Refunded'], default: 'Active' },
    notes: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Bill', billSchema);