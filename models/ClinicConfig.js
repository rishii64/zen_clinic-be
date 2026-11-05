const mongoose = require('mongoose');

const clinicConfigSchema = new mongoose.Schema(
  {
    clinicName: { type: String, default: 'RAJ JANCH GHAR' },
    tagline: { type: String, default: 'A Fully Computerised Laboratory' },
    regNumber: { type: String, default: 'Reg No - 430/2022' },
    address: { type: String, default: 'MAIN ROAD NETA JI CHOWK SAHARGHAT' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    website: { type: String, default: '' },
    gstin: { type: String, default: '' },
    state: { type: String, default: 'Bihar' },
    stateCode: { type: String, default: '10' },
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
      name: { type: String, default: 'Dr. R.K. MANDAL' },
      qualifications: { type: String, default: 'M.B.B.S' },
      regNo: { type: String, default: '18840' },
      designation: { type: String, default: 'Consultant Pathologist & Medical Officer' }
    },
    technicianDetails: {
      name: { type: String, default: 'Mr. R.K. Raut' },
      qualifications: { type: String, default: '(BMLT) Jaipur' },
      regNo: { type: String, default: '' },
      designation: { type: String, default: 'Chief Lab Technologist' }
    },
    reportDisclaimers: {
      type: [String],
      default: [
        '1. Invalid for medico legal purpose',
        '2. Contain of this report is only an opinion not a diagnostic purpose'
      ]
    },
    invoiceNotes: {
      type: String,
      default: 'Healthcare & diagnostic services are generally exempt from GST unless requested.'
    },
    headerStyle: {
      primaryColor: { type: String, default: '#254696' },
      secondaryColor: { type: String, default: '#15803d' },
      accentColor: { type: String, default: '#6b21a8' }
    },
    watermarkText: { type: String, default: 'SAHARGHAT' },
    showWatermark: { type: Boolean, default: true },
    showQrCode: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ClinicConfig', clinicConfigSchema);
