const mongoose = require('mongoose');

const clinicConfigSchema = new mongoose.Schema(
  {
    clinicName: { type: String, default: 'Zen Clinic' },
    tagline: { type: String, default: 'Clinical Laboratory & Diagnostic Services' },
    regNumber: { type: String, default: '' },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    website: { type: String, default: '' },
    gstin: { type: String, default: '' },
    state: { type: String, default: '' },
    stateCode: { type: String, default: '' },
    isGstEnabled: { type: Boolean, default: false },
    defaultGstRate: { type: Number, default: 0 },
    cgstRate: { type: Number, default: 0 },
    sgstRate: { type: Number, default: 0 },
    igstRate: { type: Number, default: 0 },
    currencySymbol: { type: String, default: '₹' },
    invoicePrefix: { type: String, default: 'INV' },
    reportPrefix: { type: String, default: 'RPT' },
    patientPrefix: { type: String, default: 'PAT' },
    doctorDetails: {
      name: { type: String, default: '' },
      qualifications: { type: String, default: '' },
      regNo: { type: String, default: '' },
      designation: { type: String, default: 'Consultant Pathologist' }
    },
    technicianDetails: {
      name: { type: String, default: '' },
      qualifications: { type: String, default: '' },
      regNo: { type: String, default: '' },
      designation: { type: String, default: 'Lab Technologist' }
    },
    reportDisclaimers: {
      type: [String],
      default: [
        '1. Invalid for medico legal purpose.',
        '2. Content of this report is for clinical evaluation, not a solitary diagnosis.',
        '3. Clinical correlation is recommended for definitive diagnosis.'
      ]
    },
    invoiceNotes: {
      type: String,
      default: 'Healthcare & diagnostic services are generally exempt from GST unless requested.'
    },
    headerStyle: {
      primaryColor: { type: String, default: '#0b57d0' },
      secondaryColor: { type: String, default: '#137333' },
      accentColor: { type: String, default: '#7c3aed' }
    },
    watermarkText: { type: String, default: 'ZEN CLINIC' },
    showWatermark: { type: Boolean, default: true },
    showQrCode: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ClinicConfig', clinicConfigSchema);
