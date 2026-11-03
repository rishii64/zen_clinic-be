const mongoose = require('mongoose');

const clinicConfigSchema = new mongoose.Schema(
  {
    clinicName: { type: String, default: 'RAJ JANCH GHAR' },
    tagline: { type: String, default: 'A Fully Computerized Laboratory' },
    regNumber: { type: String, default: 'Reg.No - 430/2022' },
    address: { type: String, default: 'MAIN ROAD NETA JI CHOWK SAHARGHAT' },
    phone: { type: String, default: '+91 98765 43210' },
    email: { type: String, default: 'rajjanchghar@gmail.com' },
    website: { type: String, default: 'www.rajjanchghar.com' },
    gstin: { type: String, default: '10ABCDE1234F1Z5' },
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
      designation: { type: String, default: 'Consultant Pathologist' }
    },
    technicianDetails: {
      name: { type: String, default: 'Mr. R.K. Raut' },
      qualifications: { type: String, default: '(BMLT) Jaipur' },
      regNo: { type: String, default: 'BMLT-JP-402' },
      designation: { type: String, default: 'Senior Lab Technologist' }
    },
    reportDisclaimers: {
      type: [String],
      default: [
        '1. Invalid for medico legal purpose',
        '2. Contain of this report is only an opinion not a diagnostic purpose',
        '3. Clinical correlation is recommended for definitive diagnosis.'
      ]
    },
    invoiceNotes: {
      type: String,
      default: 'Diagnostic services are exempted under Health Care Services GST guidelines unless applicable otherwise.'
    },
    headerStyle: {
      primaryColor: { type: String, default: '#1d4ed8' },
      secondaryColor: { type: String, default: '#16a34a' },
      accentColor: { type: String, default: '#9333ea' }
    },
    watermarkText: { type: String, default: 'RAJ JANCH GHAR SAHARGHAT' },
    showWatermark: { type: Boolean, default: true },
    showQrCode: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ClinicConfig', clinicConfigSchema);

