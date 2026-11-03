const bcrypt = require('bcryptjs');
const {
  UserStore,
  PatientStore,
  TestStore,
  BillStore,
  ReportStore,
  ConfigStore
} = require('../config/store');

const initialClinicConfig = {
  clinicName: 'RAJ JANCH GHAR',
  tagline: 'A Fully Computerized Laboratory',
  regNumber: 'Reg.No - 430/2022',
  address: 'MAIN ROAD NETA JI CHOWK SAHARGHAT',
  phone: '+91 94312 87654 / +91 98012 34567',
  email: 'rajjanchghar.saharghat@gmail.com',
  website: 'www.rajjanchghar.in',
  gstin: '10ABCPG4321R1Z8',
  state: 'Bihar',
  stateCode: '10',
  isGstEnabled: false,
  defaultGstRate: 18,
  cgstRate: 9,
  sgstRate: 9,
  igstRate: 18,
  currencySymbol: '₹',
  invoicePrefix: 'INV',
  reportPrefix: 'RPT',
  patientPrefix: 'PAT',
  doctorDetails: {
    name: 'Dr. R.K. MANDAL',
    qualifications: 'M.B.B.S',
    regNo: '18840',
    designation: 'Consultant Pathologist & Medical Officer'
  },
  technicianDetails: {
    name: 'Mr. R.K. Raut',
    qualifications: '(BMLT) Jaipur',
    regNo: 'BMLT-JP-402',
    designation: 'Senior Lab Technologist'
  },
  reportDisclaimers: [
    '1. Invalid for medico legal purpose',
    '2. Contain of this report is only an opinion not a diagnostic purpose',
    '3. Clinical correlation is recommended for definitive diagnosis.'
  ],
  invoiceNotes:
    'Diagnostic & healthcare test services are generally exempt from GST under Notification No. 12/2017-Central Tax (Rate). Non-GST bill issued unless GSTIN requested.',
  headerStyle: {
    primaryColor: '#1d4ed8',
    secondaryColor: '#15803d',
    accentColor: '#7c3aed'
  },
  watermarkText: 'RAJ JANCH GHAR SAHARGHAT',
  showWatermark: true,
  showQrCode: true
};

const masterTests = [
  // --- Hematology & Blood Count ---
  {
    code: 'CBC',
    name: 'COMPLETE BLOOD COUNT (CBC)',
    category: 'Hematology',
    sampleType: 'Whole Blood EDTA',
    price: 400,
    turnaroundTime: '2 Hours',
    testType: 'panel',
    parameters: [
      { name: 'Hemoglobin (Hb)', unit: 'g/dL', refRangeMale: '13.5 - 17.5', refRangeFemale: '12.0 - 15.5', refRangeGeneral: '12.0 - 16.5', refRangeMin: 12.0, refRangeMax: 16.5, method: 'Cyanmethemoglobin' },
      { name: 'Total Leukocyte Count (TLC/WBC)', unit: '/cumm', refRangeGeneral: '4,000 - 11,000', refRangeMin: 4000, refRangeMax: 11000, method: 'Automated Cell Counter' },
      { name: 'Platelet Count', unit: '/cumm', refRangeGeneral: '150,000 - 450,000', refRangeMin: 150000, refRangeMax: 450000, method: 'Automated / Manual' },
      { name: 'RBC Count', unit: 'mill/cumm', refRangeMale: '4.5 - 5.9', refRangeFemale: '4.0 - 5.2', refRangeGeneral: '4.0 - 5.5', refRangeMin: 4.0, refRangeMax: 5.5 },
      { name: 'Packed Cell Volume (PCV/Hematocrit)', unit: '%', refRangeMale: '40 - 50', refRangeFemale: '36 - 46', refRangeGeneral: '36 - 48', refRangeMin: 36, refRangeMax: 48 },
      { name: 'MCV', unit: 'fL', refRangeGeneral: '80 - 100', refRangeMin: 80, refRangeMax: 100 },
      { name: 'MCH', unit: 'pg', refRangeGeneral: '27 - 32', refRangeMin: 27, refRangeMax: 32 },
      { name: 'MCHC', unit: 'g/dL', refRangeGeneral: '32 - 36', refRangeMin: 32, refRangeMax: 36 },
      { name: 'Neutrophils', unit: '%', refRangeGeneral: '40 - 70', refRangeMin: 40, refRangeMax: 70 },
      { name: 'Lymphocytes', unit: '%', refRangeGeneral: '20 - 45', refRangeMin: 20, refRangeMax: 45 },
      { name: 'Eosinophils', unit: '%', refRangeGeneral: '01 - 06', refRangeMin: 1, refRangeMax: 6 },
      { name: 'Monocytes', unit: '%', refRangeGeneral: '02 - 08', refRangeMin: 2, refRangeMax: 8 },
      { name: 'Basophils', unit: '%', refRangeGeneral: '00 - 01', refRangeMin: 0, refRangeMax: 1 }
    ]
  },
  {
    code: 'TC_DC',
    name: 'TC / DC (TOTAL & DIFFERENTIAL COUNT)',
    category: 'Hematology',
    sampleType: 'Whole Blood EDTA',
    price: 100,
    turnaroundTime: '2 Hours',
    testType: 'panel',
    parameters: [
      { name: 'Total Leukocyte Count (TLC)', unit: '/cumm', refRangeGeneral: '4,000 - 11,000', refRangeMin: 4000, refRangeMax: 11000 },
      { name: 'Neutrophils', unit: '%', refRangeGeneral: '40 - 70', refRangeMin: 40, refRangeMax: 70 },
      { name: 'Lymphocytes', unit: '%', refRangeGeneral: '20 - 45', refRangeMin: 20, refRangeMax: 45 },
      { name: 'Eosinophils', unit: '%', refRangeGeneral: '01 - 06', refRangeMin: 1, refRangeMax: 6 },
      { name: 'Monocytes', unit: '%', refRangeGeneral: '02 - 08', refRangeMin: 2, refRangeMax: 8 },
      { name: 'Basophils', unit: '%', refRangeGeneral: '00 - 01', refRangeMin: 0, refRangeMax: 1 }
    ]
  },
  {
    code: 'HB',
    name: 'HEMOGLOBIN (HB)',
    category: 'Hematology',
    sampleType: 'Whole Blood EDTA',
    price: 100,
    turnaroundTime: '1 Hour',
    testType: 'quantitative',
    parameters: [
      { name: 'Hemoglobin', unit: 'g/dL', refRangeMale: '13.5 - 17.5', refRangeFemale: '12.0 - 15.5', refRangeGeneral: '12.0 - 16.5', refRangeMin: 12.0, refRangeMax: 16.5 }
    ]
  },
  {
    code: 'ESR',
    name: 'ESR (ERYTHROCYTE SEDIMENTATION RATE)',
    category: 'Hematology',
    sampleType: 'Whole Blood Citrate',
    price: 100,
    turnaroundTime: '2 Hours',
    testType: 'quantitative',
    parameters: [
      { name: 'ESR (1st Hour)', unit: 'mm/hr', refRangeMale: '0 - 15', refRangeFemale: '0 - 20', refRangeGeneral: '0 - 20', refRangeMin: 0, refRangeMax: 20, method: 'Westergren Method' }
    ]
  },
  {
    code: 'PLATELETS',
    name: 'PLATELET COUNT',
    category: 'Hematology',
    sampleType: 'Whole Blood EDTA',
    price: 200,
    turnaroundTime: '1 Hour',
    testType: 'quantitative',
    parameters: [
      { name: 'Platelet Count', unit: '/cumm', refRangeGeneral: '150,000 - 450,000', refRangeMin: 150000, refRangeMax: 450000 }
    ]
  },
  {
    code: 'RBC_COUNT',
    name: 'RBC COUNT',
    category: 'Hematology',
    sampleType: 'Whole Blood EDTA',
    price: 100,
    turnaroundTime: '1 Hour',
    testType: 'quantitative',
    parameters: [
      { name: 'Total RBC Count', unit: 'mill/cumm', refRangeMale: '4.5 - 5.9', refRangeFemale: '4.0 - 5.2', refRangeGeneral: '4.0 - 5.5', refRangeMin: 4.0, refRangeMax: 5.5 }
    ]
  },
  {
    code: 'BLOOD_GROUP',
    name: 'BLOOD GROUP (ABO & Rh)',
    category: 'Hematology',
    sampleType: 'Whole Blood EDTA',
    price: 80,
    turnaroundTime: '30 Mins',
    testType: 'qualitative',
    parameters: [
      { name: 'ABO Group', unit: '', options: ['A', 'B', 'AB', 'O'], defaultValue: 'B' },
      { name: 'Rh Factor', unit: '', options: ['Positive (+ve)', 'Negative (-ve)'], defaultValue: 'Positive (+ve)' }
    ]
  },

  // --- Blood Sugar & Diabetes ---
  {
    code: 'SUGAR_F',
    name: 'BLOOD GLUCOSE FASTING (SUGAR F)',
    category: 'Biochemistry',
    sampleType: 'Fluoride Plasma',
    price: 60,
    turnaroundTime: '1 Hour',
    testType: 'quantitative',
    parameters: [
      { name: 'Fasting Blood Glucose', unit: 'mg/dL', refRangeGeneral: '70 - 100', refRangeMin: 70, refRangeMax: 100, method: 'GOD-POD Method' }
    ]
  },
  {
    code: 'SUGAR_R',
    name: 'BLOOD GLUCOSE RANDOM (SUGAR R)',
    category: 'Biochemistry',
    sampleType: 'Fluoride Plasma',
    price: 60,
    turnaroundTime: '1 Hour',
    testType: 'quantitative',
    parameters: [
      { name: 'Random Blood Glucose', unit: 'mg/dL', refRangeGeneral: '70 - 140', refRangeMin: 70, refRangeMax: 140, method: 'GOD-POD Method' }
    ]
  },
  {
    code: 'SUGAR_PP',
    name: 'BLOOD GLUCOSE POST PRANDIAL (SUGAR PP)',
    category: 'Biochemistry',
    sampleType: 'Fluoride Plasma',
    price: 60,
    turnaroundTime: '1 Hour',
    testType: 'quantitative',
    parameters: [
      { name: 'Post Prandial Glucose (2h PP)', unit: 'mg/dL', refRangeGeneral: 'Up to 140', refRangeMin: 70, refRangeMax: 140, method: 'GOD-POD Method' }
    ]
  },

  // --- Liver Function Tests ---
  {
    code: 'LFT',
    name: 'LIVER FUNCTION TEST (LFT)',
    category: 'Liver Function',
    sampleType: 'Serum',
    price: 800,
    turnaroundTime: '3 Hours',
    testType: 'panel',
    parameters: [
      { name: 'Serum Bilirubin Total', unit: 'mg/dL', refRangeGeneral: '0.2 - 1.2', refRangeMin: 0.2, refRangeMax: 1.2 },
      { name: 'Serum Bilirubin Direct', unit: 'mg/dL', refRangeGeneral: '0.0 - 0.3', refRangeMin: 0.0, refRangeMax: 0.3 },
      { name: 'Serum Bilirubin Indirect', unit: 'mg/dL', refRangeGeneral: '0.2 - 0.9', refRangeMin: 0.2, refRangeMax: 0.9 },
      { name: 'SGOT / AST', unit: 'U/L', refRangeGeneral: '05 - 40', refRangeMin: 5, refRangeMax: 40 },
      { name: 'SGPT / ALT', unit: 'U/L', refRangeGeneral: '05 - 45', refRangeMin: 5, refRangeMax: 45 },
      { name: 'Alkaline Phosphatase (ALP)', unit: 'U/L', refRangeGeneral: '30 - 120', refRangeMin: 30, refRangeMax: 120 },
      { name: 'Total Serum Protein', unit: 'g/dL', refRangeGeneral: '6.4 - 8.3', refRangeMin: 6.4, refRangeMax: 8.3 },
      { name: 'Serum Albumin', unit: 'g/dL', refRangeGeneral: '3.5 - 5.2', refRangeMin: 3.5, refRangeMax: 5.2 },
      { name: 'Serum Globulin', unit: 'g/dL', refRangeGeneral: '2.3 - 3.5', refRangeMin: 2.3, refRangeMax: 3.5 },
      { name: 'A/G Ratio', unit: '', refRangeGeneral: '1.2 - 2.2', refRangeMin: 1.2, refRangeMax: 2.2 }
    ]
  },
  {
    code: 'BILIRUBIN',
    name: 'BILIRUBIN (TOTAL, DIRECT & INDIRECT)',
    category: 'Liver Function',
    sampleType: 'Serum',
    price: 200,
    turnaroundTime: '2 Hours',
    testType: 'panel',
    parameters: [
      { name: 'Serum Bilirubin Total', unit: 'mg/dL', refRangeGeneral: '0.2 - 1.2', refRangeMin: 0.2, refRangeMax: 1.2 },
      { name: 'Serum Bilirubin Direct', unit: 'mg/dL', refRangeGeneral: '0.0 - 0.3', refRangeMin: 0.0, refRangeMax: 0.3 },
      { name: 'Serum Bilirubin Indirect', unit: 'mg/dL', refRangeGeneral: '0.2 - 0.9', refRangeMin: 0.2, refRangeMax: 0.9 }
    ]
  },
  {
    code: 'SGPT',
    name: 'SGPT (ALT)',
    category: 'Liver Function',
    sampleType: 'Serum',
    price: 200,
    turnaroundTime: '2 Hours',
    testType: 'quantitative',
    parameters: [{ name: 'SGPT / ALT', unit: 'U/L', refRangeGeneral: '05 - 45', refRangeMin: 5, refRangeMax: 45 }]
  },
  {
    code: 'SGOT',
    name: 'SGOT (AST)',
    category: 'Liver Function',
    sampleType: 'Serum',
    price: 200,
    turnaroundTime: '2 Hours',
    testType: 'quantitative',
    parameters: [{ name: 'SGOT / AST', unit: 'U/L', refRangeGeneral: '05 - 40', refRangeMin: 5, refRangeMax: 40 }]
  },
  {
    code: 'ALBUMIN',
    name: 'SERUM ALBUMIN',
    category: 'Liver Function',
    sampleType: 'Serum',
    price: 200,
    turnaroundTime: '2 Hours',
    testType: 'quantitative',
    parameters: [{ name: 'Serum Albumin', unit: 'g/dL', refRangeGeneral: '3.5 - 5.2', refRangeMin: 3.5, refRangeMax: 5.2 }]
  },
  {
    code: 'TOTAL_PROTIEN',
    name: 'TOTAL PROTEIN',
    category: 'Liver Function',
    sampleType: 'Serum',
    price: 200,
    turnaroundTime: '2 Hours',
    testType: 'quantitative',
    parameters: [{ name: 'Total Protein', unit: 'g/dL', refRangeGeneral: '6.4 - 8.3', refRangeMin: 6.4, refRangeMax: 8.3 }]
  },
  {
    code: 'ALK_PHOSPHATASE',
    name: 'ALKALINE PHOSPHATASE (ALP)',
    category: 'Liver Function',
    sampleType: 'Serum',
    price: 200,
    turnaroundTime: '2 Hours',
    testType: 'quantitative',
    parameters: [{ name: 'Alkaline Phosphatase', unit: 'U/L', refRangeGeneral: '30 - 120', refRangeMin: 30, refRangeMax: 120 }]
  },

  // --- Kidney & Renal Function ---
  {
    code: 'KFT',
    name: 'KIDNEY FUNCTION TEST (KFT)',
    category: 'Kidney & Renal',
    sampleType: 'Serum',
    price: 700,
    turnaroundTime: '3 Hours',
    testType: 'panel',
    parameters: [
      { name: 'Blood Urea', unit: 'mg/dL', refRangeGeneral: '15 - 45', refRangeMin: 15, refRangeMax: 45 },
      { name: 'Blood Urea Nitrogen (BUN)', unit: 'mg/dL', refRangeGeneral: '07 - 20', refRangeMin: 7, refRangeMax: 20 },
      { name: 'Serum Creatinine', unit: 'mg/dL', refRangeMale: '0.7 - 1.3', refRangeFemale: '0.6 - 1.1', refRangeGeneral: '0.6 - 1.3', refRangeMin: 0.6, refRangeMax: 1.3 },
      { name: 'Serum Uric Acid', unit: 'mg/dL', refRangeMale: '3.5 - 7.2', refRangeFemale: '2.6 - 6.0', refRangeGeneral: '3.0 - 7.0', refRangeMin: 3.0, refRangeMax: 7.0 },
      { name: 'Serum Sodium (Na+)', unit: 'mEq/L', refRangeGeneral: '135 - 145', refRangeMin: 135, refRangeMax: 145 },
      { name: 'Serum Potassium (K+)', unit: 'mEq/L', refRangeGeneral: '3.5 - 5.1', refRangeMin: 3.5, refRangeMax: 5.1 },
      { name: 'Serum Chloride (Cl-)', unit: 'mEq/L', refRangeGeneral: '96 - 106', refRangeMin: 96, refRangeMax: 106 }
    ]
  },
  {
    code: 'ELECTROLITE',
    name: 'SERUM ELECTROLYTES (Na, K, Cl)',
    category: 'Kidney & Renal',
    sampleType: 'Serum',
    price: 800,
    turnaroundTime: '2 Hours',
    testType: 'panel',
    parameters: [
      { name: 'Sodium (Na+)', unit: 'mEq/L', refRangeGeneral: '135 - 145', refRangeMin: 135, refRangeMax: 145 },
      { name: 'Potassium (K+)', unit: 'mEq/L', refRangeGeneral: '3.5 - 5.1', refRangeMin: 3.5, refRangeMax: 5.1 },
      { name: 'Chloride (Cl-)', unit: 'mEq/L', refRangeGeneral: '96 - 106', refRangeMin: 96, refRangeMax: 106 }
    ]
  },
  {
    code: 'BUN',
    name: 'BLOOD UREA NITROGEN (BUN)',
    category: 'Kidney & Renal',
    sampleType: 'Serum',
    price: 400,
    turnaroundTime: '2 Hours',
    testType: 'quantitative',
    parameters: [{ name: 'BUN', unit: 'mg/dL', refRangeGeneral: '07 - 20', refRangeMin: 7, refRangeMax: 20 }]
  },
  {
    code: 'UREA',
    name: 'BLOOD UREA',
    category: 'Kidney & Renal',
    sampleType: 'Serum',
    price: 200,
    turnaroundTime: '2 Hours',
    testType: 'quantitative',
    parameters: [{ name: 'Blood Urea', unit: 'mg/dL', refRangeGeneral: '15 - 45', refRangeMin: 15, refRangeMax: 45 }]
  },
  {
    code: 'CREATININE',
    name: 'SERUM CREATININE',
    category: 'Kidney & Renal',
    sampleType: 'Serum',
    price: 300,
    turnaroundTime: '2 Hours',
    testType: 'quantitative',
    parameters: [{ name: 'Serum Creatinine', unit: 'mg/dL', refRangeMale: '0.7 - 1.3', refRangeFemale: '0.6 - 1.1', refRangeGeneral: '0.6 - 1.3', refRangeMin: 0.6, refRangeMax: 1.3 }]
  },
  {
    code: 'SODIUM',
    name: 'SERUM SODIUM (Na+)',
    category: 'Kidney & Renal',
    sampleType: 'Serum',
    price: 300,
    turnaroundTime: '2 Hours',
    testType: 'quantitative',
    parameters: [{ name: 'Sodium (Na+)', unit: 'mEq/L', refRangeGeneral: '135 - 145', refRangeMin: 135, refRangeMax: 145 }]
  },
  {
    code: 'POTASSIUM',
    name: 'SERUM POTASSIUM (K+)',
    category: 'Kidney & Renal',
    sampleType: 'Serum',
    price: 300,
    turnaroundTime: '2 Hours',
    testType: 'quantitative',
    parameters: [{ name: 'Potassium (K+)', unit: 'mEq/L', refRangeGeneral: '3.5 - 5.1', refRangeMin: 3.5, refRangeMax: 5.1 }]
  },
  {
    code: 'CHLORIDE',
    name: 'SERUM CHLORIDE (Cl-)',
    category: 'Kidney & Renal',
    sampleType: 'Serum',
    price: 300,
    turnaroundTime: '2 Hours',
    testType: 'quantitative',
    parameters: [{ name: 'Chloride (Cl-)', unit: 'mEq/L', refRangeGeneral: '96 - 106', refRangeMin: 96, refRangeMax: 106 }]
  },
  {
    code: 'CALCIUM',
    name: 'SERUM CALCIUM',
    category: 'Kidney & Renal',
    sampleType: 'Serum',
    price: 500,
    turnaroundTime: '2 Hours',
    testType: 'quantitative',
    parameters: [{ name: 'Total Calcium', unit: 'mg/dL', refRangeGeneral: '8.8 - 10.2', refRangeMin: 8.8, refRangeMax: 10.2 }]
  },
  {
    code: 'URIC_ACID',
    name: 'SERUM URIC ACID',
    category: 'Kidney & Renal',
    sampleType: 'Serum',
    price: 200,
    turnaroundTime: '2 Hours',
    testType: 'quantitative',
    parameters: [{ name: 'Uric Acid', unit: 'mg/dL', refRangeMale: '3.5 - 7.2', refRangeFemale: '2.6 - 6.0', refRangeGeneral: '3.0 - 7.0', refRangeMin: 3.0, refRangeMax: 7.0 }]
  },

  // --- Pancreatic & Cardiac ---
  {
    code: 'S_AMYLASE',
    name: 'SERUM AMYLASE',
    category: 'Biochemistry',
    sampleType: 'Serum',
    price: 1000,
    turnaroundTime: '3 Hours',
    testType: 'quantitative',
    parameters: [{ name: 'Serum Amylase', unit: 'U/L', refRangeGeneral: '28 - 100', refRangeMin: 28, refRangeMax: 100 }]
  },
  {
    code: 'S_LIPASE',
    name: 'SERUM LIPASE',
    category: 'Biochemistry',
    sampleType: 'Serum',
    price: 1000,
    turnaroundTime: '3 Hours',
    testType: 'quantitative',
    parameters: [{ name: 'Serum Lipase', unit: 'U/L', refRangeGeneral: '13 - 60', refRangeMin: 13, refRangeMax: 60 }]
  },
  {
    code: 'TROP_T',
    name: 'TROPONIN-T (TROP T)',
    category: 'Lipid & Cardiac',
    sampleType: 'Serum / Whole Blood',
    price: 2000,
    turnaroundTime: '1 Hour',
    testType: 'qualitative',
    parameters: [
      { name: 'Troponin-T Result', unit: '', options: ['Negative (< 0.01 ng/mL)', 'Positive (Cardiac event indicated)'], defaultValue: 'Negative (< 0.01 ng/mL)' }
    ]
  },

  // --- Lipid Profile ---
  {
    code: 'LIPID_PROFILE',
    name: 'LIPID PROFILE (COMPLETE)',
    category: 'Lipid & Cardiac',
    sampleType: 'Serum (12h Fasting)',
    price: 800,
    turnaroundTime: '3 Hours',
    testType: 'panel',
    parameters: [
      { name: 'Total Cholesterol', unit: 'mg/dL', refRangeGeneral: '< 200 (Desirable)', refRangeMin: 100, refRangeMax: 200 },
      { name: 'Serum Triglycerides', unit: 'mg/dL', refRangeGeneral: '< 150 (Normal)', refRangeMin: 50, refRangeMax: 150 },
      { name: 'HDL Cholesterol', unit: 'mg/dL', refRangeGeneral: '> 40 (Optimal: 40 - 60)', refRangeMin: 40, refRangeMax: 60 },
      { name: 'LDL Cholesterol', unit: 'mg/dL', refRangeGeneral: '< 100 (Optimal)', refRangeMin: 0, refRangeMax: 100 },
      { name: 'VLDL Cholesterol', unit: 'mg/dL', refRangeGeneral: '05 - 30', refRangeMin: 5, refRangeMax: 30 },
      { name: 'Total Cholesterol / HDL Ratio', unit: '', refRangeGeneral: '3.3 - 4.4', refRangeMin: 3.3, refRangeMax: 4.4 }
    ]
  },
  {
    code: 'TRIGLYCERIDE',
    name: 'TRIGLYCERIDES',
    category: 'Lipid & Cardiac',
    sampleType: 'Serum',
    price: 200,
    turnaroundTime: '2 Hours',
    testType: 'quantitative',
    parameters: [{ name: 'Triglycerides', unit: 'mg/dL', refRangeGeneral: '< 150', refRangeMin: 50, refRangeMax: 150 }]
  },
  {
    code: 'CHOLESTEROL',
    name: 'CHOLESTEROL TOTAL',
    category: 'Lipid & Cardiac',
    sampleType: 'Serum',
    price: 200,
    turnaroundTime: '2 Hours',
    testType: 'quantitative',
    parameters: [{ name: 'Total Cholesterol', unit: 'mg/dL', refRangeGeneral: '< 200', refRangeMin: 120, refRangeMax: 200 }]
  },

  // --- Thyroid & Endocrine ---
  {
    code: 'TSH',
    name: 'TSH (THYROID STIMULATING HORMONE)',
    category: 'Endocrine & Thyroid',
    sampleType: 'Serum',
    price: 500,
    turnaroundTime: '4 Hours',
    testType: 'quantitative',
    parameters: [{ name: 'TSH', unit: 'µIU/mL', refRangeGeneral: '0.40 - 4.50', refRangeMin: 0.4, refRangeMax: 4.5, method: 'CLIA Method' }]
  },
  {
    code: 'T3_T4_TSH',
    name: 'THYROID PROFILE TOTAL (T3, T4, TSH)',
    category: 'Endocrine & Thyroid',
    sampleType: 'Serum',
    price: 1000,
    turnaroundTime: '4 Hours',
    testType: 'panel',
    parameters: [
      { name: 'Total Triiodothyronine (T3)', unit: 'ng/mL', refRangeGeneral: '0.80 - 2.00', refRangeMin: 0.8, refRangeMax: 2.0 },
      { name: 'Total Thyroxine (T4)', unit: 'µg/dL', refRangeGeneral: '5.1 - 14.1', refRangeMin: 5.1, refRangeMax: 14.1 },
      { name: 'TSH', unit: 'µIU/mL', refRangeGeneral: '0.40 - 4.50', refRangeMin: 0.4, refRangeMax: 4.5 }
    ]
  },
  {
    code: 'FT3_FT4_TSH',
    name: 'FREE THYROID PROFILE (FT3, FT4, TSH)',
    category: 'Endocrine & Thyroid',
    sampleType: 'Serum',
    price: 1600,
    turnaroundTime: '4 Hours',
    testType: 'panel',
    parameters: [
      { name: 'Free Triiodothyronine (FT3)', unit: 'pg/mL', refRangeGeneral: '2.3 - 4.2', refRangeMin: 2.3, refRangeMax: 4.2 },
      { name: 'Free Thyroxine (FT4)', unit: 'ng/dL', refRangeGeneral: '0.8 - 1.8', refRangeMin: 0.8, refRangeMax: 1.8 },
      { name: 'TSH', unit: 'µIU/mL', refRangeGeneral: '0.40 - 4.50', refRangeMin: 0.4, refRangeMax: 4.5 }
    ]
  },
  {
    code: 'PROLACTIN',
    name: 'SERUM PROLACTIN',
    category: 'Endocrine & Thyroid',
    sampleType: 'Serum',
    price: 1000,
    turnaroundTime: '4 Hours',
    testType: 'quantitative',
    parameters: [{ name: 'Prolactin', unit: 'ng/mL', refRangeMale: '3.0 - 15.0', refRangeFemale: '4.0 - 23.0', refRangeGeneral: '3.0 - 20.0', refRangeMin: 3.0, refRangeMax: 20.0 }]
  },
  {
    code: 'LH',
    name: 'LH (LUTEINIZING HORMONE)',
    category: 'Endocrine & Thyroid',
    sampleType: 'Serum',
    price: 1000,
    turnaroundTime: '4 Hours',
    testType: 'quantitative',
    parameters: [{ name: 'Luteinizing Hormone (LH)', unit: 'mIU/mL', refRangeGeneral: '1.5 - 12.0', refRangeMin: 1.5, refRangeMax: 12.0 }]
  },
  {
    code: 'FSH',
    name: 'FSH (FOLLICLE STIMULATING HORMONE)',
    category: 'Endocrine & Thyroid',
    sampleType: 'Serum',
    price: 1000,
    turnaroundTime: '4 Hours',
    testType: 'quantitative',
    parameters: [{ name: 'FSH', unit: 'mIU/mL', refRangeGeneral: '1.5 - 12.4', refRangeMin: 1.5, refRangeMax: 12.4 }]
  },
  {
    code: 'PSA',
    name: 'TOTAL PSA (PROSTATE SPECIFIC ANTIGEN)',
    category: 'Endocrine & Thyroid',
    sampleType: 'Serum',
    price: 1500,
    turnaroundTime: '4 Hours',
    testType: 'quantitative',
    parameters: [{ name: 'Total PSA', unit: 'ng/mL', refRangeGeneral: '0.0 - 4.0', refRangeMin: 0.0, refRangeMax: 4.0 }]
  },

  // --- Serology & Immunology ---
  {
    code: 'WIDAL',
    name: 'WIDAL TEST (TYPHOID ANTIBODY)',
    category: 'Serology & Immunology',
    sampleType: 'Serum',
    price: 100,
    turnaroundTime: '2 Hours',
    testType: 'panel',
    parameters: [
      { name: 'S. Typhi "O"', unit: 'Titre', refRangeGeneral: '< 1:80 (Negative)', options: ['Negative (< 1:80)', '1:80', '1:160 (+ve)', '1:320 (+ve)'], defaultValue: 'Negative (< 1:80)' },
      { name: 'S. Typhi "H"', unit: 'Titre', refRangeGeneral: '< 1:80 (Negative)', options: ['Negative (< 1:80)', '1:80', '1:160 (+ve)', '1:320 (+ve)'], defaultValue: 'Negative (< 1:80)' },
      { name: 'S. Paratyphi "AH"', unit: 'Titre', refRangeGeneral: '< 1:80 (Negative)', options: ['Negative (< 1:80)', '1:80', '1:160 (+ve)'], defaultValue: 'Negative (< 1:80)' },
      { name: 'S. Paratyphi "BH"', unit: 'Titre', refRangeGeneral: '< 1:80 (Negative)', options: ['Negative (< 1:80)', '1:80', '1:160 (+ve)'], defaultValue: 'Negative (< 1:80)' }
    ]
  },
  {
    code: 'ASO',
    name: 'ASO TITRE (ANTI-STREPTOLYSIN O)',
    category: 'Serology & Immunology',
    sampleType: 'Serum',
    price: 500,
    turnaroundTime: '2 Hours',
    testType: 'quantitative',
    parameters: [{ name: 'ASO Titre', unit: 'IU/mL', refRangeGeneral: '< 200 IU/mL (Negative)', refRangeMin: 0, refRangeMax: 200 }]
  },
  {
    code: 'RA_FACTOR',
    name: 'RA FACTOR (RHEUMATOID FACTOR)',
    category: 'Serology & Immunology',
    sampleType: 'Serum',
    price: 500,
    turnaroundTime: '2 Hours',
    testType: 'quantitative',
    parameters: [{ name: 'Rheumatoid Factor', unit: 'IU/mL', refRangeGeneral: '< 20 IU/mL (Negative)', refRangeMin: 0, refRangeMax: 20 }]
  },
  {
    code: 'CRP',
    name: 'CRP (C-REACTIVE PROTEIN)',
    category: 'Serology & Immunology',
    sampleType: 'Serum',
    price: 500,
    turnaroundTime: '2 Hours',
    testType: 'quantitative',
    parameters: [{ name: 'C-Reactive Protein', unit: 'mg/L', refRangeGeneral: '< 6.0 mg/L', refRangeMin: 0, refRangeMax: 6.0 }]
  },
  {
    code: 'MT',
    name: 'MANTOUX TEST (MT / TUBERCULIN)',
    category: 'Serology & Immunology',
    sampleType: 'Intradermal Injection (PPD)',
    price: 100,
    turnaroundTime: '48 - 72 Hours',
    testType: 'quantitative',
    parameters: [{ name: 'Induration Diameter', unit: 'mm', refRangeGeneral: '< 5 mm (Negative), ≥ 10 mm (Positive)' }]
  },
  {
    code: 'ADA_TB',
    name: 'ADA (ADENOSINE DEAMINASE)',
    category: 'Serology & Immunology',
    sampleType: 'Pleural / Ascitic / CSF / Serum',
    price: 3500,
    turnaroundTime: 'Same Day',
    testType: 'quantitative',
    parameters: [{ name: 'ADA Level', unit: 'U/L', refRangeGeneral: '< 30 U/L (Normal), > 40 U/L (Suspicious TB)' }]
  },
  {
    code: 'TB_GOLD',
    name: 'TB GOLD (QUANTIFERON TB)',
    category: 'Serology & Immunology',
    sampleType: 'Whole Blood (Special Tubes)',
    price: 4000,
    turnaroundTime: '24 Hours',
    testType: 'qualitative',
    parameters: [{ name: 'QuantiFERON-TB Gold Result', unit: '', options: ['Negative', 'Positive', 'Indeterminate'], defaultValue: 'Negative' }]
  },
  {
    code: 'TORCH_8',
    name: 'TORCH ALL EIGHT PANEL (IgG & IgM)',
    category: 'Serology & Immunology',
    sampleType: 'Serum',
    price: 4000,
    turnaroundTime: '24 Hours',
    testType: 'panel',
    parameters: [
      { name: 'Toxoplasma IgG', unit: 'IU/mL', refRangeGeneral: 'Negative (< 1.6)', options: ['Negative', 'Positive'], defaultValue: 'Negative' },
      { name: 'Toxoplasma IgM', unit: 'Ratio', refRangeGeneral: 'Negative (< 0.8)', options: ['Negative', 'Positive'], defaultValue: 'Negative' },
      { name: 'Rubella IgG', unit: 'IU/mL', refRangeGeneral: 'Immune (≥ 10)', options: ['Negative', 'Positive'], defaultValue: 'Positive' },
      { name: 'Rubella IgM', unit: 'Ratio', refRangeGeneral: 'Negative (< 0.8)', options: ['Negative', 'Positive'], defaultValue: 'Negative' },
      { name: 'Cytomegalovirus (CMV) IgG', unit: 'AU/mL', refRangeGeneral: 'Negative (< 6.0)', options: ['Negative', 'Positive'], defaultValue: 'Negative' },
      { name: 'Cytomegalovirus (CMV) IgM', unit: 'Ratio', refRangeGeneral: 'Negative (< 0.8)', options: ['Negative', 'Positive'], defaultValue: 'Negative' },
      { name: 'Herpes Simplex Virus 1&2 IgG', unit: 'RU/mL', refRangeGeneral: 'Negative (< 16)', options: ['Negative', 'Positive'], defaultValue: 'Negative' },
      { name: 'Herpes Simplex Virus 1&2 IgM', unit: 'Ratio', refRangeGeneral: 'Negative (< 0.8)', options: ['Negative', 'Positive'], defaultValue: 'Negative' }
    ]
  },
  {
    code: 'TORCH_10',
    name: 'TORCH ALL TEN PANEL',
    category: 'Serology & Immunology',
    sampleType: 'Serum',
    price: 4500,
    turnaroundTime: '24 Hours',
    testType: 'panel',
    parameters: [
      { name: 'Toxoplasma IgG', unit: '', options: ['Negative', 'Positive'], defaultValue: 'Negative' },
      { name: 'Toxoplasma IgM', unit: '', options: ['Negative', 'Positive'], defaultValue: 'Negative' },
      { name: 'Rubella IgG', unit: '', options: ['Negative', 'Positive'], defaultValue: 'Positive' },
      { name: 'Rubella IgM', unit: '', options: ['Negative', 'Positive'], defaultValue: 'Negative' },
      { name: 'CMV IgG', unit: '', options: ['Negative', 'Positive'], defaultValue: 'Negative' },
      { name: 'CMV IgM', unit: '', options: ['Negative', 'Positive'], defaultValue: 'Negative' },
      { name: 'HSV-1 IgG', unit: '', options: ['Negative', 'Positive'], defaultValue: 'Negative' },
      { name: 'HSV-1 IgM', unit: '', options: ['Negative', 'Positive'], defaultValue: 'Negative' },
      { name: 'HSV-2 IgG', unit: '', options: ['Negative', 'Positive'], defaultValue: 'Negative' },
      { name: 'HSV-2 IgM', unit: '', options: ['Negative', 'Positive'], defaultValue: 'Negative' }
    ]
  },
  {
    code: 'CA_125',
    name: 'CA-125 (OVARIAN TUMOR MARKER)',
    category: 'Serology & Immunology',
    sampleType: 'Serum',
    price: 3000,
    turnaroundTime: '24 Hours',
    testType: 'quantitative',
    parameters: [{ name: 'CA 125 Level', unit: 'U/mL', refRangeGeneral: '0.0 - 35.0 U/mL', refRangeMin: 0, refRangeMax: 35 }]
  },

  // --- Rapid Card Tests ---
  {
    code: 'HIV_CARD',
    name: 'HIV 1 & 2 (RAPID CARD TEST)',
    category: 'Card Tests',
    sampleType: 'Serum / Whole Blood',
    price: 300,
    turnaroundTime: '30 Mins',
    testType: 'qualitative',
    parameters: [{ name: 'HIV 1 & 2 Antibodies', unit: '', options: ['Non-Reactive', 'Reactive'], defaultValue: 'Non-Reactive' }]
  },
  {
    code: 'HBSAG_CARD',
    name: 'HBsAg (HEPATITIS B SURFACE ANTIGEN CARD)',
    category: 'Card Tests',
    sampleType: 'Serum',
    price: 300,
    turnaroundTime: '30 Mins',
    testType: 'qualitative',
    parameters: [{ name: 'HBsAg (Australia Antigen)', unit: '', options: ['Non-Reactive', 'Reactive'], defaultValue: 'Non-Reactive' }]
  },
  {
    code: 'HCV_CARD',
    name: 'HCV (HEPATITIS C VIRUS CARD)',
    category: 'Card Tests',
    sampleType: 'Serum',
    price: 300,
    turnaroundTime: '30 Mins',
    testType: 'qualitative',
    parameters: [{ name: 'HCV Antibody', unit: '', options: ['Non-Reactive', 'Reactive'], defaultValue: 'Non-Reactive' }]
  },
  {
    code: 'VDRL_CARD',
    name: 'VDRL / RPR (SYPHILIS CARD)',
    category: 'Card Tests',
    sampleType: 'Serum',
    price: 100,
    turnaroundTime: '30 Mins',
    testType: 'qualitative',
    parameters: [{ name: 'VDRL / RPR Test', unit: '', options: ['Non-Reactive', 'Reactive'], defaultValue: 'Non-Reactive' }]
  },
  {
    code: 'MALARIA_CARD',
    name: 'MALARIA ANTIGEN (PF / PV RAPID CARD)',
    category: 'Card Tests',
    sampleType: 'Whole Blood EDTA',
    price: 300,
    turnaroundTime: '30 Mins',
    testType: 'panel',
    parameters: [
      { name: 'Plasmodium Falciparum (Pf Ag)', unit: '', options: ['Negative', 'Positive'], defaultValue: 'Negative' },
      { name: 'Plasmodium Vivax (Pv Ag)', unit: '', options: ['Negative', 'Positive'], defaultValue: 'Negative' }
    ]
  },
  {
    code: 'TYPHOID_CARD',
    name: 'TYPHOID IgG / IgM RAPID CARD',
    category: 'Card Tests',
    sampleType: 'Serum',
    price: 600,
    turnaroundTime: '30 Mins',
    testType: 'panel',
    parameters: [
      { name: 'Typhoid IgM (Acute Infection)', unit: '', options: ['Negative', 'Positive'], defaultValue: 'Negative' },
      { name: 'Typhoid IgG (Past / Convalescent)', unit: '', options: ['Negative', 'Positive'], defaultValue: 'Negative' }
    ]
  },
  {
    code: 'KALAZAR_CARD',
    name: 'KALA-AZAR (rK39 STRIP TEST)',
    category: 'Card Tests',
    sampleType: 'Serum / Whole Blood',
    price: 600,
    turnaroundTime: '30 Mins',
    testType: 'qualitative',
    parameters: [{ name: 'rK39 Antigen for Leishmania', unit: '', options: ['Negative', 'Positive'], defaultValue: 'Negative' }]
  },
  {
    code: 'DENGUE_CARD',
    name: 'DENGUE NS1 Ag & IgG / IgM COMBO',
    category: 'Card Tests',
    sampleType: 'Serum',
    price: 1600,
    turnaroundTime: '1 Hour',
    testType: 'panel',
    parameters: [
      { name: 'Dengue NS1 Antigen', unit: '', options: ['Negative', 'Positive'], defaultValue: 'Negative' },
      { name: 'Dengue IgM Antibody', unit: '', options: ['Negative', 'Positive'], defaultValue: 'Negative' },
      { name: 'Dengue IgG Antibody', unit: '', options: ['Negative', 'Positive'], defaultValue: 'Negative' }
    ]
  },
  {
    code: 'TB_CARD',
    name: 'TUBERCULOSIS (TB) RAPID ANTIBODY CARD',
    category: 'Card Tests',
    sampleType: 'Serum',
    price: 1600,
    turnaroundTime: '1 Hour',
    testType: 'qualitative',
    parameters: [{ name: 'TB Rapid Antibody', unit: '', options: ['Negative', 'Positive'], defaultValue: 'Negative' }]
  },

  // --- Clinical Pathology (Urine, Stool, Sputum, Semen) ---
  {
    code: 'URINE_RE',
    name: 'URINE ROUTINE & MICROSCOPIC (URINE R/E)',
    category: 'Clinical Pathology',
    sampleType: 'Clean Catch Midstream Urine',
    price: 100,
    turnaroundTime: '1 Hour',
    testType: 'panel',
    parameters: [
      { name: 'Color', unit: '', refRangeGeneral: 'Pale Yellow', options: ['Pale Yellow', 'Yellow', 'Amber', 'Reddish', 'Straw'], defaultValue: 'Pale Yellow' },
      { name: 'Transparency / Appearance', unit: '', refRangeGeneral: 'Clear', options: ['Clear', 'Hazy', 'Turbid', 'Slightly Turbid'], defaultValue: 'Clear' },
      { name: 'Specific Gravity', unit: '', refRangeGeneral: '1.010 - 1.025', defaultValue: '1.015' },
      { name: 'Reaction (pH)', unit: '', refRangeGeneral: '5.0 - 7.5 (Acidic)', defaultValue: '6.0 (Acidic)' },
      { name: 'Albumin / Protein', unit: '', refRangeGeneral: 'Nil', options: ['Nil', 'Trace', '1+ (+ve)', '2+ (+ve)', '3+ (+ve)'], defaultValue: 'Nil' },
      { name: 'Sugar / Glucose', unit: '', refRangeGeneral: 'Nil', options: ['Nil', 'Trace', '1+ (+ve)', '2+ (+ve)', '3+ (+ve)'], defaultValue: 'Nil' },
      { name: 'Ketone Bodies', unit: '', refRangeGeneral: 'Negative', options: ['Negative', 'Positive'], defaultValue: 'Negative' },
      { name: 'Bile Salts & Pigments', unit: '', refRangeGeneral: 'Negative', options: ['Negative', 'Positive'], defaultValue: 'Negative' },
      { name: 'Pus Cells (WBCs)', unit: '/HPF', refRangeGeneral: '01 - 04 /HPF', defaultValue: '02 - 03 /HPF' },
      { name: 'Epithelial Cells', unit: '/HPF', refRangeGeneral: '01 - 03 /HPF', defaultValue: '01 - 02 /HPF' },
      { name: 'Red Blood Cells (RBCs)', unit: '/HPF', refRangeGeneral: 'Nil - 01 /HPF', defaultValue: 'Nil' },
      { name: 'Casts', unit: '/LPF', refRangeGeneral: 'Nil seen', defaultValue: 'Nil' },
      { name: 'Crystals', unit: '/HPF', refRangeGeneral: 'Nil', defaultValue: 'Nil' }
    ]
  },
  {
    code: 'URINE_CS',
    name: 'URINE CULTURE & SENSITIVITY (C/S)',
    category: 'Clinical Pathology',
    sampleType: 'Sterile Midstream Urine',
    price: 200,
    turnaroundTime: '48 Hours',
    testType: 'narrative',
    parameters: [
      { name: 'Colony Count', unit: 'CFU/mL', refRangeGeneral: 'Sterile / < 10^3', defaultValue: 'No bacterial growth after 48h incubation at 37°C' },
      { name: 'Organism Isolated', unit: '', defaultValue: 'None (Sterile)' },
      { name: 'Antibiotic Sensitivity', unit: '', defaultValue: 'Not Applicable' }
    ]
  },
  {
    code: 'PREGNANCY_RAPID',
    name: 'PREGNANCY RAPID TEST (URINE hCG)',
    category: 'Clinical Pathology',
    sampleType: 'First Morning Urine',
    price: 100,
    turnaroundTime: '15 Mins',
    testType: 'qualitative',
    parameters: [{ name: 'Urine hCG Card', unit: '', options: ['Negative', 'Positive'], defaultValue: 'Positive' }]
  },
  {
    code: 'STOOL_RE',
    name: 'STOOL ROUTINE & MICROSCOPIC (STOOL R/E)',
    category: 'Clinical Pathology',
    sampleType: 'Fresh Stool Specimen',
    price: 200,
    turnaroundTime: '2 Hours',
    testType: 'panel',
    parameters: [
      { name: 'Consistency', unit: '', options: ['Formed', 'Semi-formed', 'Loose', 'Watery'], defaultValue: 'Formed' },
      { name: 'Color', unit: '', options: ['Brown', 'Yellowish-Brown', 'Clay', 'Dark'], defaultValue: 'Brown' },
      { name: 'Mucus', unit: '', options: ['Absent', 'Present'], defaultValue: 'Absent' },
      { name: 'Occult Blood', unit: '', options: ['Negative', 'Positive'], defaultValue: 'Negative' },
      { name: 'Protozoan Cysts / Trophozoites', unit: '', defaultValue: 'Not Seen' },
      { name: 'Helminthic Ova', unit: '', defaultValue: 'Not Seen' },
      { name: 'Pus Cells', unit: '/HPF', defaultValue: '0 - 1 /HPF' },
      { name: 'RBCs', unit: '/HPF', defaultValue: 'Nil' }
    ]
  },
  {
    code: 'SPUTUM_AFB',
    name: 'SPUTUM FOR AFB (ZN STAIN)',
    category: 'Clinical Pathology',
    sampleType: 'Early Morning Sputum',
    price: 150,
    turnaroundTime: '3 Hours',
    testType: 'narrative',
    parameters: [
      { name: 'Ziehl-Neelsen Stain', unit: '', options: ['Negative for AFB', 'Positive (1+)', 'Positive (2+)', 'Positive (3+)'], defaultValue: 'Negative for Acid Fast Bacilli (AFB)' }
    ]
  },
  {
    code: 'SPUTUM_CS',
    name: 'SPUTUM FOR CULTURE & SENSITIVITY (C/S)',
    category: 'Clinical Pathology',
    sampleType: 'Sputum',
    price: 200,
    turnaroundTime: '48 Hours',
    testType: 'narrative',
    parameters: [
      { name: 'Growth Findings', unit: '', defaultValue: 'Normal upper respiratory commensal flora. No pathogen isolated.' }
    ]
  },
  {
    code: 'SKIN_SNAPE_AFB',
    name: 'SKIN SCRAPING / SLIT FOR AFB',
    category: 'Clinical Pathology',
    sampleType: 'Slit Skin Smear',
    price: 200,
    turnaroundTime: '4 Hours',
    testType: 'narrative',
    parameters: [
      { name: 'Microscopic Examination (ZN Stain)', unit: '', defaultValue: 'No M. leprae or Acid Fast Bacilli detected (Bacteriological Index: 0)' }
    ]
  },
  {
    code: 'SEMEN_ANALYSIS',
    name: 'SEMEN ANALYSIS',
    category: 'Clinical Pathology',
    sampleType: 'Semen (3-5 days abstinence)',
    price: 200,
    turnaroundTime: '2 Hours',
    testType: 'panel',
    parameters: [
      { name: 'Liquefaction Time', unit: 'Mins', refRangeGeneral: '< 30 Mins', defaultValue: '20 Mins' },
      { name: 'Total Volume', unit: 'mL', refRangeGeneral: '1.5 - 5.0 mL', defaultValue: '2.5 mL' },
      { name: 'Total Sperm Count', unit: 'mill/mL', refRangeGeneral: '> 15 mill/mL', defaultValue: '65 mill/mL' },
      { name: 'Active Motility (Progressive)', unit: '%', refRangeGeneral: '> 40%', defaultValue: '60%' },
      { name: 'Sluggish Motility', unit: '%', defaultValue: '15%' },
      { name: 'Non-Motile', unit: '%', defaultValue: '25%' },
      { name: 'Normal Morphology', unit: '%', refRangeGeneral: '> 4% normal forms', defaultValue: '75%' }
    ]
  },

  // --- Cytology & Histopathology ---
  {
    code: 'FNAC',
    name: 'FNAC (FINE NEEDLE ASPIRATION CYTOLOGY)',
    category: 'Cytology & Biopsy',
    sampleType: 'Aspiration Smear',
    price: 2300,
    turnaroundTime: '24 Hours',
    testType: 'narrative',
    parameters: [
      { name: 'Site of Aspiration', unit: '', defaultValue: 'Right cervical lymph node / Subcutaneous swelling' },
      { name: 'Microscopic Findings', unit: '', defaultValue: 'Smears reveal sheets of mature lymphoid cells and benign histiocytes against a proteinaceous background.' },
      { name: 'Impression', unit: '', defaultValue: 'Benign Reactive Lymphadenitis. No atypical or malignant cells seen.' }
    ]
  },
  {
    code: 'PAP_SMEAR',
    name: 'PAP SMEAR (CERVICAL CYTOLOGY)',
    category: 'Cytology & Biopsy',
    sampleType: 'Cervical Smear',
    price: 2300,
    turnaroundTime: '24 Hours',
    testType: 'narrative',
    parameters: [
      { name: 'Adequacy of Specimen', unit: '', defaultValue: 'Satisfactory for evaluation with endocervical component present' },
      { name: 'Cytological Evaluation', unit: '', defaultValue: 'Negative for Intraepithelial Lesion or Malignancy (NILM)' },
      { name: 'General Categorization', unit: '', defaultValue: 'NILM with mild non-specific inflammatory cellular changes' }
    ]
  },
  {
    code: 'BIOPSY',
    name: 'HISTOPATHOLOGY BIOPSY EXAMINATION',
    category: 'Cytology & Biopsy',
    sampleType: 'Formalin Fixed Tissue Specimen',
    price: 2300,
    turnaroundTime: '48 - 72 Hours',
    testType: 'narrative',
    parameters: [
      { name: 'Gross Examination', unit: '', defaultValue: 'Received single grey-white soft tissue biopsy piece measuring 1.2 x 0.8 x 0.5 cm.' },
      { name: 'Microscopic Description', unit: '', defaultValue: 'Sections show stratified squamous epithelium with focal hyperkeratosis and chronic inflammatory cell infiltration in subepithelial stroma.' },
      { name: 'Final Histopathological Diagnosis', unit: '', defaultValue: 'Chronic non-specific inflammatory lesion. Free of granuloma and neoplasm.' }
    ]
  },

  // --- Radiology & Diagnostic ---
  {
    code: 'ECG',
    name: 'ECG (12-LEAD ELECTROCARDIOGRAM)',
    category: 'Radiology & Diagnostic',
    sampleType: 'Non-Invasive Diagnostic Tracing',
    price: 300,
    turnaroundTime: '30 Mins',
    testType: 'panel',
    parameters: [
      { name: 'Heart Rate', unit: 'BPM', refRangeGeneral: '60 - 100', defaultValue: '76' },
      { name: 'Rhythm', unit: '', defaultValue: 'Normal Sinus Rhythm' },
      { name: 'P-R Interval', unit: 'sec', refRangeGeneral: '0.12 - 0.20', defaultValue: '0.16' },
      { name: 'QRS Duration', unit: 'sec', refRangeGeneral: '0.06 - 0.10', defaultValue: '0.08' },
      { name: 'Q-T Interval', unit: 'sec', refRangeGeneral: '0.36 - 0.44', defaultValue: '0.38' },
      { name: 'ST-T Segment', unit: '', defaultValue: 'No significant ST elevation or depression' },
      { name: 'ECG Impression', unit: '', defaultValue: 'Normal Electrocardiogram' }
    ]
  },
  {
    code: 'USG_WA',
    name: 'USG WHOLE ABDOMEN (USG W/A)',
    category: 'Radiology & Diagnostic',
    sampleType: 'Ultrasound Examination',
    price: 800,
    turnaroundTime: '1 Hour',
    testType: 'narrative',
    parameters: [
      { name: 'Liver', unit: '', defaultValue: 'Normal in size (13.5 cm), smooth regular margins, homogeneous echotexture. No focal lesion.' },
      { name: 'Gall Bladder', unit: '', defaultValue: 'Well distended, wall thickness normal (< 3 mm). Lumina free of calculi or sludge.' },
      { name: 'Spleen', unit: '', defaultValue: 'Normal in size (9.8 cm) and parenchymal echotexture.' },
      { name: 'Pancreas', unit: '', defaultValue: 'Visualized portion is normal in size and echogenicity.' },
      { name: 'Kidneys', unit: '', defaultValue: 'Both kidneys normal in size, shape and position. Corticomedullary differentiation well preserved. No hydronephrosis or calculus.' },
      { name: 'Urinary Bladder & Pelvis', unit: '', defaultValue: 'Well distended, wall thickness uniform. Prostate/Uterus normal for age.' },
      { name: 'Impression', unit: '', defaultValue: 'Normal Ultrasound study of Whole Abdomen.' }
    ]
  },
  {
    code: 'USG_SCROTUM',
    name: 'USG SCROTUM',
    category: 'Radiology & Diagnostic',
    sampleType: 'High Resolution Scrotal USG',
    price: 1600,
    turnaroundTime: '1 Hour',
    testType: 'narrative',
    parameters: [
      { name: 'Both Testes', unit: '', defaultValue: 'Both testes normal in size, location and parenchymal echo pattern.' },
      { name: 'Epididymis & Cord', unit: '', defaultValue: 'Epididymal head and body normal bilaterally. No varicocele.' },
      { name: 'Impression', unit: '', defaultValue: 'Normal bilateral scrotal ultrasonography. No hydrocele or varicocele.' }
    ]
  },
  {
    code: 'USG_BREAST',
    name: 'USG BREAST (BILATERAL SONOMAMMOGRAPHY)',
    category: 'Radiology & Diagnostic',
    sampleType: 'Breast Ultrasound',
    price: 1600,
    turnaroundTime: '1 Hour',
    testType: 'narrative',
    parameters: [
      { name: 'Right & Left Breast', unit: '', defaultValue: 'Fibroglandular parenchyma shows normal architecture and distribution. No cystic or solid mass lesion identified.' },
      { name: 'Axillary Fossa', unit: '', defaultValue: 'No suspicious or pathological lymphadenopathy seen bilaterally.' },
      { name: 'Impression', unit: '', defaultValue: 'BI-RADS Category 1: Negative (Normal bilateral sonomammography).' }
    ]
  }
];

async function seedDatabase() {
  try {
    // 1. Seed Clinic Config
    let existingConfig = await ConfigStore.findOne();
    if (!existingConfig) {
      console.log('[Seed] Seeding Clinic Configuration for Raj Janch Ghar...');
      await ConfigStore.create(initialClinicConfig);
    }

    // 2. Seed Default Users with bcrypt hashed passwords
    const usersCount = await UserStore.countDocuments();
    let adminUser, docUser, techUser, recUser;

    if (usersCount === 0) {
      console.log('[Seed] Seeding Demo Roles & Users (admin123)...');
      const hashedPassword = await bcrypt.hash('admin123', 10);

      adminUser = await UserStore.create({
        name: 'Administrator',
        email: 'admin@rajjanchghar.com',
        password: hashedPassword,
        role: 'Admin',
        phone: '+91 94312 87654',
        designation: 'Laboratory Director & Super Admin'
      });

      docUser = await UserStore.create({
        name: 'Dr. R.K. MANDAL',
        email: 'doctor@rajjanchghar.com',
        password: hashedPassword,
        role: 'Doctor',
        phone: '+91 98012 34567',
        qualifications: 'M.B.B.S',
        regNumber: '18840',
        designation: 'Consultant Pathologist & Medical Officer'
      });

      techUser = await UserStore.create({
        name: 'Mr. R.K. Raut',
        email: 'tech@rajjanchghar.com',
        password: hashedPassword,
        role: 'Technician',
        phone: '+91 98765 12345',
        qualifications: '(BMLT) Jaipur',
        regNumber: 'BMLT-JP-402',
        designation: 'Chief Lab Technologist'
      });

      recUser = await UserStore.create({
        name: 'Priya Sharma',
        email: 'reception@rajjanchghar.com',
        password: hashedPassword,
        role: 'Receptionist',
        phone: '+91 91234 56789',
        designation: 'Patient Billing & Front Desk Officer'
      });
    } else {
      adminUser = await UserStore.findOne({ role: 'Admin' });
      docUser = await UserStore.findOne({ role: 'Doctor' });
      techUser = await UserStore.findOne({ role: 'Technician' });
      recUser = await UserStore.findOne({ role: 'Receptionist' });
    }

    // 3. Seed Master Tests (60+ tests from reference rate sheet)
    const currentTestsCount = await TestStore.countDocuments();
    if (currentTestsCount === 0) {
      console.log(`[Seed] Seeding ${masterTests.length} master tests from tariff sheet...`);
      for (const t of masterTests) {
        await TestStore.create(t);
      }
    }

    console.log('[Seed] Database initialization completed successfully!');
  } catch (err) {
    console.error('[Seed] Error seeding database:', err);
  }
}

module.exports = seedDatabase;

