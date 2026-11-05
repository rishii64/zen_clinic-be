/**
 * Complete Diagnostic Master Tariff (74 Tests)
 * Accurately transcribed from Clinic Test Tariff Rate Sheet
 */

const tariffMaster = [
  // ==========================================
  // 1. HEMATOLOGY & COMPLETE BLOOD COUNT
  // ==========================================
  {
    code: 'TC_DC',
    name: 'TC / DC (Total & Differential Leukocyte Count)',
    category: 'Hematology',
    sampleType: 'Whole Blood EDTA',
    price: 100,
    turnaroundTime: '2 Hours',
    testType: 'panel',
    parameters: [
      { name: 'Total Leukocyte Count (TLC)', unit: '/cumm', refRangeGeneral: '4,000 - 11,000', refRangeMin: 4000, refRangeMax: 11000, method: 'Automated / Microscopy' },
      { name: 'Neutrophils', unit: '%', refRangeGeneral: '40 - 70', refRangeMin: 40, refRangeMax: 70 },
      { name: 'Lymphocytes', unit: '%', refRangeGeneral: '20 - 45', refRangeMin: 20, refRangeMax: 45 },
      { name: 'Eosinophils', unit: '%', refRangeGeneral: '01 - 06', refRangeMin: 1, refRangeMax: 6 },
      { name: 'Monocytes', unit: '%', refRangeGeneral: '02 - 08', refRangeMin: 2, refRangeMax: 8 },
      { name: 'Basophils', unit: '%', refRangeGeneral: '00 - 01', refRangeMin: 0, refRangeMax: 1 }
    ]
  },
  {
    code: 'HB',
    name: 'Hemoglobin (Hb)',
    category: 'Hematology',
    sampleType: 'Whole Blood EDTA',
    price: 100,
    turnaroundTime: '1 Hour',
    testType: 'quantitative',
    parameters: [
      { name: 'Hemoglobin (Hb)', unit: 'g/dL', refRangeMale: '13.5 - 17.5', refRangeFemale: '12.0 - 15.5', refRangeGeneral: '12.0 - 16.5', refRangeMin: 12.0, refRangeMax: 16.5, method: 'Cyanmethemoglobin' }
    ]
  },
  {
    code: 'ESR',
    name: 'Erythrocyte Sedimentation Rate (ESR)',
    category: 'Hematology',
    sampleType: 'Whole Blood Citrate / EDTA',
    price: 100,
    turnaroundTime: '2 Hours',
    testType: 'quantitative',
    parameters: [
      { name: 'ESR (1st Hour)', unit: 'mm/1st hr', refRangeMale: '0 - 15', refRangeFemale: '0 - 20', refRangeGeneral: '0 - 20', refRangeMin: 0, refRangeMax: 20, method: 'Westergren Method' }
    ]
  },
  {
    code: 'PLATELETS',
    name: 'Platelet Count',
    category: 'Hematology',
    sampleType: 'Whole Blood EDTA',
    price: 200,
    turnaroundTime: '2 Hours',
    testType: 'quantitative',
    parameters: [
      { name: 'Platelet Count', unit: '/cumm', refRangeGeneral: '150,000 - 450,000', refRangeMin: 150000, refRangeMax: 450000, method: 'Cell Counter / Manual' }
    ]
  },
  {
    code: 'RBC_COUNT',
    name: 'Red Blood Cell (RBC) Count',
    category: 'Hematology',
    sampleType: 'Whole Blood EDTA',
    price: 100,
    turnaroundTime: '2 Hours',
    testType: 'quantitative',
    parameters: [
      { name: 'RBC Count', unit: 'mill/cumm', refRangeMale: '4.5 - 5.9', refRangeFemale: '4.0 - 5.2', refRangeGeneral: '4.0 - 5.5', refRangeMin: 4.0, refRangeMax: 5.5 }
    ]
  },
  {
    code: 'CBC',
    name: 'Complete Blood Count (CBC)',
    category: 'Hematology',
    sampleType: 'Whole Blood EDTA',
    price: 400,
    turnaroundTime: '2 Hours',
    testType: 'panel',
    parameters: [
      { name: 'Hemoglobin (Hb)', unit: 'g/dL', refRangeMale: '13.5 - 17.5', refRangeFemale: '12.0 - 15.5', refRangeGeneral: '12.0 - 16.5', refRangeMin: 12.0, refRangeMax: 16.5 },
      { name: 'Total Leukocyte Count (TLC)', unit: '/cumm', refRangeGeneral: '4,000 - 11,000', refRangeMin: 4000, refRangeMax: 11000 },
      { name: 'Platelet Count', unit: '/cumm', refRangeGeneral: '150,000 - 450,000', refRangeMin: 150000, refRangeMax: 450000 },
      { name: 'RBC Count', unit: 'mill/cumm', refRangeMale: '4.5 - 5.9', refRangeFemale: '4.0 - 5.2', refRangeGeneral: '4.0 - 5.5', refRangeMin: 4.0, refRangeMax: 5.5 },
      { name: 'Packed Cell Volume (PCV)', unit: '%', refRangeMale: '40 - 50', refRangeFemale: '36 - 46', refRangeGeneral: '36 - 48', refRangeMin: 36, refRangeMax: 48 },
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
    code: 'BLOOD_GROUP',
    name: 'Blood Group & Rh Factor (ABO & Rh)',
    category: 'Hematology',
    sampleType: 'Whole Blood EDTA',
    price: 80,
    turnaroundTime: '1 Hour',
    testType: 'qualitative',
    parameters: [
      { name: 'ABO Blood Group', unit: '', refRangeGeneral: 'Descriptive (A, B, AB, O)', options: ['A', 'B', 'AB', 'O'] },
      { name: 'Rh Factor', unit: '', refRangeGeneral: 'Positive / Negative', options: ['Positive (+ve)', 'Negative (-ve)'] }
    ]
  },

  // ==========================================
  // 2. BIOCHEMISTRY, DIABETES & LIVER FUNCTION
  // ==========================================
  {
    code: 'SUGAR_F',
    name: 'Blood Sugar Fasting (Glucose F)',
    category: 'Biochemistry',
    sampleType: 'Fluoride Plasma / Serum',
    price: 60,
    turnaroundTime: '2 Hours',
    testType: 'quantitative',
    parameters: [
      { name: 'Fasting Blood Sugar', unit: 'mg/dL', refRangeGeneral: '70 - 100 (Normal), 100 - 125 (Impaired)', refRangeMin: 70, refRangeMax: 100, method: 'GOD-POD' }
    ]
  },
  {
    code: 'SUGAR_R',
    name: 'Blood Sugar Random (Glucose R)',
    category: 'Biochemistry',
    sampleType: 'Fluoride Plasma / Serum',
    price: 60,
    turnaroundTime: '1 Hour',
    testType: 'quantitative',
    parameters: [
      { name: 'Random Blood Sugar', unit: 'mg/dL', refRangeGeneral: '70 - 140', refRangeMin: 70, refRangeMax: 140, method: 'GOD-POD' }
    ]
  },
  {
    code: 'SUGAR_PP',
    name: 'Blood Sugar Post Prandial (Glucose PP)',
    category: 'Biochemistry',
    sampleType: 'Fluoride Plasma / Serum',
    price: 60,
    turnaroundTime: '2 Hours',
    testType: 'quantitative',
    parameters: [
      { name: 'Post Prandial Blood Sugar', unit: 'mg/dL', refRangeGeneral: '< 140', refRangeMin: 70, refRangeMax: 140, method: 'GOD-POD' }
    ]
  },
  {
    code: 'BILIRUBIN',
    name: 'Serum Bilirubin (Total, Direct & Indirect)',
    category: 'Liver Function',
    sampleType: 'Serum',
    price: 200,
    turnaroundTime: '2 Hours',
    testType: 'panel',
    parameters: [
      { name: 'Bilirubin Total', unit: 'mg/dL', refRangeGeneral: '0.2 - 1.2', refRangeMin: 0.2, refRangeMax: 1.2, method: 'Diazo Method' },
      { name: 'Bilirubin Direct (Conjugated)', unit: 'mg/dL', refRangeGeneral: '0.0 - 0.3', refRangeMin: 0.0, refRangeMax: 0.3 },
      { name: 'Bilirubin Indirect (Unconjugated)', unit: 'mg/dL', refRangeGeneral: '0.2 - 0.8', refRangeMin: 0.2, refRangeMax: 0.8 }
    ]
  },
  {
    code: 'SGPT',
    name: 'SGPT / ALT (Alanine Aminotransferase)',
    category: 'Liver Function',
    sampleType: 'Serum',
    price: 200,
    turnaroundTime: '2 Hours',
    testType: 'quantitative',
    parameters: [
      { name: 'SGPT / ALT', unit: 'U/L', refRangeGeneral: 'Up to 45', refRangeMin: 0, refRangeMax: 45, method: 'IFCC UV Kinetic' }
    ]
  },
  {
    code: 'SGOT',
    name: 'SGOT / AST (Aspartate Aminotransferase)',
    category: 'Liver Function',
    sampleType: 'Serum',
    price: 200,
    turnaroundTime: '2 Hours',
    testType: 'quantitative',
    parameters: [
      { name: 'SGOT / AST', unit: 'U/L', refRangeGeneral: 'Up to 40', refRangeMin: 0, refRangeMax: 40, method: 'IFCC UV Kinetic' }
    ]
  },
  {
    code: 'ALBUMIN',
    name: 'Serum Albumin',
    category: 'Liver Function',
    sampleType: 'Serum',
    price: 200,
    turnaroundTime: '2 Hours',
    testType: 'quantitative',
    parameters: [
      { name: 'Serum Albumin', unit: 'g/dL', refRangeGeneral: '3.5 - 5.2', refRangeMin: 3.5, refRangeMax: 5.2, method: 'BCG Dye Method' }
    ]
  },
  {
    code: 'TOTAL_PROTEIN',
    name: 'Total Protein & A/G Ratio',
    category: 'Liver Function',
    sampleType: 'Serum',
    price: 200,
    turnaroundTime: '2 Hours',
    testType: 'panel',
    parameters: [
      { name: 'Total Protein', unit: 'g/dL', refRangeGeneral: '6.0 - 8.3', refRangeMin: 6.0, refRangeMax: 8.3, method: 'Biuret Method' },
      { name: 'Serum Albumin', unit: 'g/dL', refRangeGeneral: '3.5 - 5.2', refRangeMin: 3.5, refRangeMax: 5.2 },
      { name: 'Serum Globulin', unit: 'g/dL', refRangeGeneral: '2.0 - 3.5', refRangeMin: 2.0, refRangeMax: 3.5 },
      { name: 'A/G Ratio', unit: '', refRangeGeneral: '1.2 - 2.0', refRangeMin: 1.2, refRangeMax: 2.0 }
    ]
  },
  {
    code: 'ALP',
    name: 'Alkaline Phosphatase (Alk Phosphatase)',
    category: 'Liver Function',
    sampleType: 'Serum',
    price: 200,
    turnaroundTime: '2 Hours',
    testType: 'quantitative',
    parameters: [
      { name: 'Alkaline Phosphatase (ALP)', unit: 'U/L', refRangeGeneral: '44 - 147', refRangeMin: 44, refRangeMax: 147, method: 'p-NPP Kinetic' }
    ]
  },
  {
    code: 'LFT',
    name: 'Liver Function Test (LFT Panel)',
    category: 'Liver Function',
    sampleType: 'Serum',
    price: 800,
    turnaroundTime: '3 Hours',
    testType: 'panel',
    parameters: [
      { name: 'Serum Bilirubin Total', unit: 'mg/dL', refRangeGeneral: '0.2 - 1.2', refRangeMin: 0.2, refRangeMax: 1.2 },
      { name: 'Serum Bilirubin Direct', unit: 'mg/dL', refRangeGeneral: '0.0 - 0.3', refRangeMin: 0.0, refRangeMax: 0.3 },
      { name: 'Serum Bilirubin Indirect', unit: 'mg/dL', refRangeGeneral: '0.2 - 0.8', refRangeMin: 0.2, refRangeMax: 0.8 },
      { name: 'SGPT / ALT', unit: 'U/L', refRangeGeneral: 'Up to 45', refRangeMin: 0, refRangeMax: 45 },
      { name: 'SGOT / AST', unit: 'U/L', refRangeGeneral: 'Up to 40', refRangeMin: 0, refRangeMax: 40 },
      { name: 'Alkaline Phosphatase (ALP)', unit: 'U/L', refRangeGeneral: '44 - 147', refRangeMin: 44, refRangeMax: 147 },
      { name: 'Total Protein', unit: 'g/dL', refRangeGeneral: '6.0 - 8.3', refRangeMin: 6.0, refRangeMax: 8.3 },
      { name: 'Serum Albumin', unit: 'g/dL', refRangeGeneral: '3.5 - 5.2', refRangeMin: 3.5, refRangeMax: 5.2 },
      { name: 'Serum Globulin', unit: 'g/dL', refRangeGeneral: '2.0 - 3.5', refRangeMin: 2.0, refRangeMax: 3.5 },
      { name: 'A/G Ratio', unit: '', refRangeGeneral: '1.2 - 2.0', refRangeMin: 1.2, refRangeMax: 2.0 }
    ]
  },
  {
    code: 'S_AMYLASE',
    name: 'Serum Amylase',
    category: 'Biochemistry',
    sampleType: 'Serum',
    price: 1000,
    turnaroundTime: '3 Hours',
    testType: 'quantitative',
    parameters: [
      { name: 'Serum Amylase', unit: 'U/L', refRangeGeneral: '28 - 100', refRangeMin: 28, refRangeMax: 100, method: 'CNPG3 Kinetic' }
    ]
  },
  {
    code: 'S_LIPASE',
    name: 'Serum Lipase',
    category: 'Biochemistry',
    sampleType: 'Serum',
    price: 1000,
    turnaroundTime: '3 Hours',
    testType: 'quantitative',
    parameters: [
      { name: 'Serum Lipase', unit: 'U/L', refRangeGeneral: '13 - 60', refRangeMin: 13, refRangeMax: 60, method: 'Enzymatic Colorimetric' }
    ]
  },
  {
    code: 'CALCIUM',
    name: 'Serum Calcium',
    category: 'Biochemistry',
    sampleType: 'Serum',
    price: 500,
    turnaroundTime: '2 Hours',
    testType: 'quantitative',
    parameters: [
      { name: 'Serum Calcium (Total)', unit: 'mg/dL', refRangeGeneral: '8.5 - 10.5', refRangeMin: 8.5, refRangeMax: 10.5, method: 'Arsenazo III' }
    ]
  },

  // ==========================================
  // 3. KIDNEY, RENAL & ELECTROLYTES
  // ==========================================
  {
    code: 'KFT',
    name: 'Kidney Function Test (KFT / RFT Panel)',
    category: 'Kidney & Renal',
    sampleType: 'Serum',
    price: 700,
    turnaroundTime: '3 Hours',
    testType: 'panel',
    parameters: [
      { name: 'Blood Urea', unit: 'mg/dL', refRangeGeneral: '15 - 40', refRangeMin: 15, refRangeMax: 40 },
      { name: 'Blood Urea Nitrogen (BUN)', unit: 'mg/dL', refRangeGeneral: '7 - 20', refRangeMin: 7, refRangeMax: 20 },
      { name: 'Serum Creatinine', unit: 'mg/dL', refRangeMale: '0.7 - 1.3', refRangeFemale: '0.5 - 1.1', refRangeGeneral: '0.6 - 1.2', refRangeMin: 0.6, refRangeMax: 1.2 },
      { name: 'Serum Uric Acid', unit: 'mg/dL', refRangeMale: '3.5 - 7.2', refRangeFemale: '2.6 - 6.0', refRangeGeneral: '3.0 - 7.0', refRangeMin: 3.0, refRangeMax: 7.0 },
      { name: 'Serum Sodium (Na+)', unit: 'mEq/L', refRangeGeneral: '135 - 145', refRangeMin: 135, refRangeMax: 145 },
      { name: 'Serum Potassium (K+)', unit: 'mEq/L', refRangeGeneral: '3.5 - 5.0', refRangeMin: 3.5, refRangeMax: 5.0 },
      { name: 'Serum Chloride (Cl-)', unit: 'mEq/L', refRangeGeneral: '98 - 107', refRangeMin: 98, refRangeMax: 107 }
    ]
  },
  {
    code: 'UREA',
    name: 'Blood Urea',
    category: 'Kidney & Renal',
    sampleType: 'Serum',
    price: 200,
    turnaroundTime: '2 Hours',
    testType: 'quantitative',
    parameters: [
      { name: 'Blood Urea', unit: 'mg/dL', refRangeGeneral: '15 - 40', refRangeMin: 15, refRangeMax: 40, method: 'GLDH Kinetic' }
    ]
  },
  {
    code: 'BUN',
    name: 'Blood Urea Nitrogen (BUN)',
    category: 'Kidney & Renal',
    sampleType: 'Serum',
    price: 400,
    turnaroundTime: '2 Hours',
    testType: 'quantitative',
    parameters: [
      { name: 'Blood Urea Nitrogen (BUN)', unit: 'mg/dL', refRangeGeneral: '7 - 20', refRangeMin: 7, refRangeMax: 20 }
    ]
  },
  {
    code: 'CREATININE',
    name: 'Serum Creatinine',
    category: 'Kidney & Renal',
    sampleType: 'Serum',
    price: 300,
    turnaroundTime: '2 Hours',
    testType: 'quantitative',
    parameters: [
      { name: 'Serum Creatinine', unit: 'mg/dL', refRangeMale: '0.7 - 1.3', refRangeFemale: '0.5 - 1.1', refRangeGeneral: '0.6 - 1.2', refRangeMin: 0.6, refRangeMax: 1.2, method: 'Modified Jaffe' }
    ]
  },
  {
    code: 'URIC_ACID',
    name: 'Serum Uric Acid',
    category: 'Kidney & Renal',
    sampleType: 'Serum',
    price: 200,
    turnaroundTime: '2 Hours',
    testType: 'quantitative',
    parameters: [
      { name: 'Serum Uric Acid', unit: 'mg/dL', refRangeMale: '3.5 - 7.2', refRangeFemale: '2.6 - 6.0', refRangeGeneral: '3.0 - 7.0', refRangeMin: 3.0, refRangeMax: 7.0, method: 'Uricase PAP' }
    ]
  },
  {
    code: 'ELECTROLYTES',
    name: 'Serum Electrolytes (Na+, K+, Cl-)',
    category: 'Kidney & Renal',
    sampleType: 'Serum',
    price: 800,
    turnaroundTime: '2 Hours',
    testType: 'panel',
    parameters: [
      { name: 'Serum Sodium (Na+)', unit: 'mEq/L', refRangeGeneral: '135 - 145', refRangeMin: 135, refRangeMax: 145, method: 'ISE' },
      { name: 'Serum Potassium (K+)', unit: 'mEq/L', refRangeGeneral: '3.5 - 5.0', refRangeMin: 3.5, refRangeMax: 5.0, method: 'ISE' },
      { name: 'Serum Chloride (Cl-)', unit: 'mEq/L', refRangeGeneral: '98 - 107', refRangeMin: 98, refRangeMax: 107, method: 'ISE' }
    ]
  },
  {
    code: 'SODIUM',
    name: 'Serum Sodium (Na+)',
    category: 'Kidney & Renal',
    sampleType: 'Serum',
    price: 300,
    turnaroundTime: '2 Hours',
    testType: 'quantitative',
    parameters: [
      { name: 'Serum Sodium (Na+)', unit: 'mEq/L', refRangeGeneral: '135 - 145', refRangeMin: 135, refRangeMax: 145, method: 'ISE' }
    ]
  },
  {
    code: 'POTASSIUM',
    name: 'Serum Potassium (K+)',
    category: 'Kidney & Renal',
    sampleType: 'Serum',
    price: 300,
    turnaroundTime: '2 Hours',
    testType: 'quantitative',
    parameters: [
      { name: 'Serum Potassium (K+)', unit: 'mEq/L', refRangeGeneral: '3.5 - 5.0', refRangeMin: 3.5, refRangeMax: 5.0, method: 'ISE' }
    ]
  },
  {
    code: 'CHLORIDE',
    name: 'Serum Chloride (Cl-)',
    category: 'Kidney & Renal',
    sampleType: 'Serum',
    price: 300,
    turnaroundTime: '2 Hours',
    testType: 'quantitative',
    parameters: [
      { name: 'Serum Chloride (Cl-)', unit: 'mEq/L', refRangeGeneral: '98 - 107', refRangeMin: 98, refRangeMax: 107, method: 'ISE' }
    ]
  },

  // ==========================================
  // 4. LIPID & CARDIAC MARKERS
  // ==========================================
  {
    code: 'LIPID_PROFILE',
    name: 'Lipid Profile Panel',
    category: 'Lipid & Cardiac',
    sampleType: 'Serum (12h Fasting)',
    price: 800,
    turnaroundTime: '3 Hours',
    testType: 'panel',
    parameters: [
      { name: 'Total Cholesterol', unit: 'mg/dL', refRangeGeneral: 'Desirable < 200', refRangeMin: 100, refRangeMax: 200 },
      { name: 'Serum Triglycerides', unit: 'mg/dL', refRangeGeneral: 'Desirable < 150', refRangeMin: 50, refRangeMax: 150 },
      { name: 'HDL Cholesterol (Good)', unit: 'mg/dL', refRangeGeneral: '40 - 60', refRangeMin: 40, refRangeMax: 60 },
      { name: 'LDL Cholesterol (Bad)', unit: 'mg/dL', refRangeGeneral: '< 100', refRangeMin: 50, refRangeMax: 100 },
      { name: 'VLDL Cholesterol', unit: 'mg/dL', refRangeGeneral: '10 - 30', refRangeMin: 10, refRangeMax: 30 },
      { name: 'Total Chol / HDL Ratio', unit: '', refRangeGeneral: '3.3 - 4.4', refRangeMin: 3.3, refRangeMax: 4.4 }
    ]
  },
  {
    code: 'TRIGLYCERIDE',
    name: 'Serum Triglycerides',
    category: 'Lipid & Cardiac',
    sampleType: 'Serum Fasting',
    price: 200,
    turnaroundTime: '2 Hours',
    testType: 'quantitative',
    parameters: [
      { name: 'Serum Triglycerides', unit: 'mg/dL', refRangeGeneral: '< 150 (Normal), 150 - 199 (Borderline)', refRangeMin: 50, refRangeMax: 150, method: 'GPO-POD' }
    ]
  },
  {
    code: 'CHOLESTEROL',
    name: 'Serum Cholesterol (Total)',
    category: 'Lipid & Cardiac',
    sampleType: 'Serum Fasting',
    price: 200,
    turnaroundTime: '2 Hours',
    testType: 'quantitative',
    parameters: [
      { name: 'Serum Total Cholesterol', unit: 'mg/dL', refRangeGeneral: '< 200 (Desirable), 200 - 239 (Borderline)', refRangeMin: 100, refRangeMax: 200, method: 'CHOD-PAP' }
    ]
  },
  {
    code: 'TROP_T',
    name: 'Troponin-T (Cardiac Marker)',
    category: 'Lipid & Cardiac',
    sampleType: 'Whole Blood / Serum',
    price: 2000,
    turnaroundTime: '1 Hour',
    testType: 'qualitative',
    parameters: [
      { name: 'Troponin-T', unit: 'ng/mL', refRangeGeneral: 'Negative (< 0.01 ng/mL)', options: ['Negative (< 0.01 ng/mL)', 'Positive (Myocardial Injury)'] }
    ]
  },

  // ==========================================
  // 5. RAPID CARD TESTS
  // ==========================================
  {
    code: 'CARD_HIV',
    name: 'HIV 1 & 2 Antibody Rapid Card Test',
    category: 'Card Tests',
    sampleType: 'Serum / Plasma / Whole Blood',
    price: 300,
    turnaroundTime: '1 Hour',
    testType: 'qualitative',
    parameters: [
      { name: 'HIV 1 & 2 Antibodies', unit: '', refRangeGeneral: 'Non-Reactive (Negative)', options: ['Non-Reactive (Negative)', 'Reactive (Positive)'] }
    ]
  },
  {
    code: 'CARD_HBSAG',
    name: 'HBsAg Rapid Card Test (Hepatitis B)',
    category: 'Card Tests',
    sampleType: 'Serum / Plasma',
    price: 300,
    turnaroundTime: '1 Hour',
    testType: 'qualitative',
    parameters: [
      { name: 'HBsAg (Hepatitis B Surface Antigen)', unit: '', refRangeGeneral: 'Non-Reactive (Negative)', options: ['Non-Reactive (Negative)', 'Reactive (Positive)'] }
    ]
  },
  {
    code: 'CARD_HCV',
    name: 'HCV Rapid Card Test (Hepatitis C)',
    category: 'Card Tests',
    sampleType: 'Serum / Plasma',
    price: 300,
    turnaroundTime: '1 Hour',
    testType: 'qualitative',
    parameters: [
      { name: 'HCV Antibodies', unit: '', refRangeGeneral: 'Non-Reactive (Negative)', options: ['Non-Reactive (Negative)', 'Reactive (Positive)'] }
    ]
  },
  {
    code: 'CARD_VDRL',
    name: 'VDRL / RPR Syphilis Rapid Test',
    category: 'Card Tests',
    sampleType: 'Serum',
    price: 100,
    turnaroundTime: '1 Hour',
    testType: 'qualitative',
    parameters: [
      { name: 'VDRL / Syphilis Antibodies', unit: '', refRangeGeneral: 'Non-Reactive', options: ['Non-Reactive', 'Reactive (Titre: 1:8, 1:16, etc.)'] }
    ]
  },
  {
    code: 'CARD_MALARIA',
    name: 'Malaria Antigen Rapid Card Test (Pf / Pv)',
    category: 'Card Tests',
    sampleType: 'Whole Blood EDTA',
    price: 300,
    turnaroundTime: '1 Hour',
    testType: 'panel',
    parameters: [
      { name: 'Plasmodium vivax (Pv)', unit: '', refRangeGeneral: 'Negative', options: ['Negative', 'Positive'] },
      { name: 'Plasmodium falciparum (Pf)', unit: '', refRangeGeneral: 'Negative', options: ['Negative', 'Positive'] }
    ]
  },
  {
    code: 'CARD_TYPHOID',
    name: 'Typhoid IgG & IgM Rapid Card Test',
    category: 'Card Tests',
    sampleType: 'Serum',
    price: 600,
    turnaroundTime: '1 Hour',
    testType: 'panel',
    parameters: [
      { name: 'Typhoid IgM (Acute Infection)', unit: '', refRangeGeneral: 'Negative', options: ['Negative', 'Positive'] },
      { name: 'Typhoid IgG (Past Infection / Immunity)', unit: '', refRangeGeneral: 'Negative', options: ['Negative', 'Positive'] }
    ]
  },
  {
    code: 'CARD_KALAZAR',
    name: 'Kala-Azar (rK39 Antigen Rapid Test)',
    category: 'Card Tests',
    sampleType: 'Serum',
    price: 600,
    turnaroundTime: '1 Hour',
    testType: 'qualitative',
    parameters: [
      { name: 'Leishmania donovani (rK39 Antibody)', unit: '', refRangeGeneral: 'Non-Reactive (Negative)', options: ['Non-Reactive (Negative)', 'Reactive (Positive)'] }
    ]
  },
  {
    code: 'CARD_DENGUE',
    name: 'Dengue Duo Rapid Card (NS1 Ag + IgG/IgM Ab)',
    category: 'Card Tests',
    sampleType: 'Serum',
    price: 1600,
    turnaroundTime: '1 Hour',
    testType: 'panel',
    parameters: [
      { name: 'Dengue NS1 Antigen (Early Infection)', unit: '', refRangeGeneral: 'Negative', options: ['Negative', 'Positive'] },
      { name: 'Dengue IgM Antibody (Primary Infection)', unit: '', refRangeGeneral: 'Negative', options: ['Negative', 'Positive'] },
      { name: 'Dengue IgG Antibody (Secondary Infection)', unit: '', refRangeGeneral: 'Negative', options: ['Negative', 'Positive'] }
    ]
  },
  {
    code: 'CARD_TB',
    name: 'Tuberculosis Rapid Antibody Card Test',
    category: 'Card Tests',
    sampleType: 'Serum / Blood',
    price: 1600,
    turnaroundTime: '1 Hour',
    testType: 'qualitative',
    parameters: [
      { name: 'TB Rapid Antibodies (IgG, IgM, IgA)', unit: '', refRangeGeneral: 'Negative', options: ['Negative', 'Positive'] }
    ]
  },

  // ==========================================
  // 6. CLINICAL PATHOLOGY & MICROSCOPY
  // ==========================================
  {
    code: 'STOOL_RE',
    name: 'Stool Routine & Microscopic Examination (Stool R/E)',
    category: 'Clinical Pathology',
    sampleType: 'Fresh Stool Specimen',
    price: 200,
    turnaroundTime: '2 Hours',
    testType: 'panel',
    parameters: [
      { name: 'Color', unit: '', refRangeGeneral: 'Yellowish / Brownish' },
      { name: 'Consistency', unit: '', refRangeGeneral: 'Formed / Semisolid' },
      { name: 'Mucus', unit: '', refRangeGeneral: 'Absent', options: ['Absent', 'Present'] },
      { name: 'Blood', unit: '', refRangeGeneral: 'Absent', options: ['Absent', 'Present'] },
      { name: 'Occult Blood', unit: '', refRangeGeneral: 'Negative', options: ['Negative', 'Positive'] },
      { name: 'Ova / Cysts / Parasites', unit: '', refRangeGeneral: 'Not Seen', options: ['Not Seen', 'E. histolytica Cyst', 'Giardia Cyst', 'Ascaris Ova'] },
      { name: 'Pus Cells', unit: '/HPF', refRangeGeneral: '0 - 2' },
      { name: 'RBCs', unit: '/HPF', refRangeGeneral: 'Nil' }
    ]
  },
  {
    code: 'URINE_RE',
    name: 'Urine Routine & Microscopic Examination (Urine R/E)',
    category: 'Clinical Pathology',
    sampleType: 'Clean Catch Midstream Urine',
    price: 100,
    turnaroundTime: '1 Hour',
    testType: 'panel',
    parameters: [
      { name: 'Color', unit: '', refRangeGeneral: 'Pale Yellow' },
      { name: 'Appearance', unit: '', refRangeGeneral: 'Clear', options: ['Clear', 'Hazy', 'Turbid'] },
      { name: 'Specific Gravity', unit: '', refRangeGeneral: '1.010 - 1.030' },
      { name: 'Reaction (pH)', unit: '', refRangeGeneral: '5.0 - 7.5' },
      { name: 'Albumin / Protein', unit: '', refRangeGeneral: 'Nil', options: ['Nil', 'Trace', '1+ (+)', '2+ (++)', '3+ (+++)'] },
      { name: 'Sugar / Glucose', unit: '', refRangeGeneral: 'Nil', options: ['Nil', 'Trace', '1+ (+)', '2+ (++)', '3+ (+++)'] },
      { name: 'Pus Cells (WBC)', unit: '/HPF', refRangeGeneral: '1 - 3' },
      { name: 'Epithelial Cells', unit: '/HPF', refRangeGeneral: '2 - 4' },
      { name: 'Red Blood Cells (RBC)', unit: '/HPF', refRangeGeneral: 'Nil' },
      { name: 'Casts', unit: '', refRangeGeneral: 'Nil' },
      { name: 'Crystals', unit: '', refRangeGeneral: 'Nil' },
      { name: 'Bacteria', unit: '', refRangeGeneral: 'Absent', options: ['Absent', 'Few', 'Moderate', 'Numerous'] }
    ]
  },
  {
    code: 'URINE_CS',
    name: 'Urine Culture & Sensitivity (Urine C/S)',
    category: 'Clinical Pathology',
    sampleType: 'Sterile Midstream Urine',
    price: 200,
    turnaroundTime: '48 Hours',
    testType: 'narrative',
    parameters: [
      { name: 'Culture Growth', unit: '', refRangeGeneral: 'No Pathogenic Bacterial Growth after 48h Incubation' },
      { name: 'Colony Count', unit: 'CFU/mL', refRangeGeneral: '< 10,000 CFU/mL (Sterile)' },
      { name: 'Antibiotic Sensitivity Pattern', unit: '', refRangeGeneral: 'Descriptive' }
    ]
  },
  {
    code: 'PREGNANCY_RAPID',
    name: 'Pregnancy Rapid Card Test (UPT / hCG)',
    category: 'Clinical Pathology',
    sampleType: 'Early Morning Urine',
    price: 100,
    turnaroundTime: '30 Minutes',
    testType: 'qualitative',
    parameters: [
      { name: 'Urine hCG (Pregnancy Test)', unit: '', refRangeGeneral: 'Negative', options: ['Negative (Non-Pregnant)', 'Positive (Pregnant)'] }
    ]
  },
  {
    code: 'SPUTUM_CS',
    name: 'Sputum for Culture & Sensitivity (Sputum C/S)',
    category: 'Clinical Pathology',
    sampleType: 'Deep Cough Sputum',
    price: 200,
    turnaroundTime: '48 Hours',
    testType: 'narrative',
    parameters: [
      { name: 'Bacterial Growth', unit: '', refRangeGeneral: 'Normal Commensal Respiratory Flora. No Pathogens Isolated.' },
      { name: 'Gram Staining', unit: '', refRangeGeneral: 'Descriptive' },
      { name: 'Antibiotic Susceptibility', unit: '', refRangeGeneral: 'Descriptive' }
    ]
  },
  {
    code: 'SKIN_SCRAPE_AFB',
    name: 'Skin Scrape for AFB (Skin Snape for AFB)',
    category: 'Clinical Pathology',
    sampleType: 'Slit Skin Scraping',
    price: 200,
    turnaroundTime: '24 Hours',
    testType: 'qualitative',
    parameters: [
      { name: 'Slit Skin Smear (ZN Staining)', unit: '', refRangeGeneral: 'Negative for Acid Fast Bacilli (M. leprae)', options: ['Negative for Acid Fast Bacilli', 'Positive (Bacteriological Index noted)'] }
    ]
  },
  {
    code: 'SPUTUM_AFB',
    name: 'Sputum for AFB (Acid Fast Bacilli / ZN Staining)',
    category: 'Clinical Pathology',
    sampleType: 'Early Morning Sputum',
    price: 150,
    turnaroundTime: '4 Hours',
    testType: 'qualitative',
    parameters: [
      { name: 'Acid Fast Bacilli (ZN Stain)', unit: '', refRangeGeneral: 'Negative (No AFB seen in 100 oil immersion fields)', options: ['Negative for Acid Fast Bacilli', 'Positive (1+)', 'Positive (2+)', 'Positive (3+)'] }
    ]
  },
  {
    code: 'SEMEN_ANALYSIS',
    name: 'Semen Analysis (Seminogram)',
    category: 'Clinical Pathology',
    sampleType: 'Fresh Ejaculate (3-5 Days Abstinence)',
    price: 200,
    turnaroundTime: '2 Hours',
    testType: 'panel',
    parameters: [
      { name: 'Liquefaction Time', unit: 'minutes', refRangeGeneral: '15 - 30' },
      { name: 'Volume', unit: 'mL', refRangeGeneral: '1.5 - 5.0' },
      { name: 'Viscosity', unit: '', refRangeGeneral: 'Normal' },
      { name: 'Total Sperm Count', unit: 'million/mL', refRangeGeneral: '15 - 200' },
      { name: 'Rapid Progressive Motility (Grade A)', unit: '%', refRangeGeneral: '> 25' },
      { name: 'Total Motility (Grade A + B)', unit: '%', refRangeGeneral: '> 40' },
      { name: 'Normal Morphology', unit: '%', refRangeGeneral: '> 4 (WHO 5th)' },
      { name: 'Pus Cells', unit: '/HPF', refRangeGeneral: '1 - 3' }
    ]
  },

  // ==========================================
  // 7. CYTOLOGY, PAP SMEAR & BIOPSY
  // ==========================================
  {
    code: 'FNAC',
    name: 'Fine Needle Aspiration Cytology (FNAC)',
    category: 'Cytology & Biopsy',
    sampleType: 'Fine Needle Aspirate Smear',
    price: 2300,
    turnaroundTime: '24 Hours',
    testType: 'narrative',
    parameters: [
      { name: 'Site of Aspiration', unit: '', refRangeGeneral: 'Specified site' },
      { name: 'Microscopic Description', unit: '', refRangeGeneral: 'Descriptive' },
      { name: 'Cytological Impression / Diagnosis', unit: '', refRangeGeneral: 'Descriptive' }
    ]
  },
  {
    code: 'PAP_SMEAR',
    name: 'Pap Smear (Cervical Cytology)',
    category: 'Cytology & Biopsy',
    sampleType: 'Cervical Smear',
    price: 2300,
    turnaroundTime: '24 Hours',
    testType: 'narrative',
    parameters: [
      { name: 'Specimen Adequacy', unit: '', refRangeGeneral: 'Satisfactory for evaluation' },
      { name: 'General Categorization', unit: '', refRangeGeneral: 'Negative for Intraepithelial Lesion or Malignancy (NILM)' },
      { name: 'Cytological Impression', unit: '', refRangeGeneral: 'Benign Cellular Changes / Normal' }
    ]
  },
  {
    code: 'BIOPSY',
    name: 'Biopsy / Histopathology Examination',
    category: 'Cytology & Biopsy',
    sampleType: 'Formalin Fixed Tissue Specimen',
    price: 2300,
    turnaroundTime: '3 - 5 Days',
    testType: 'narrative',
    parameters: [
      { name: 'Gross Examination', unit: '', refRangeGeneral: 'Descriptive' },
      { name: 'Microscopic Examination', unit: '', refRangeGeneral: 'Descriptive' },
      { name: 'Histopathological Diagnosis', unit: '', refRangeGeneral: 'Definitive tissue diagnosis' }
    ]
  },

  // ==========================================
  // 8. ENDOCRINE & HORMONES
  // ==========================================
  {
    code: 'PROLACTIN',
    name: 'Serum Prolactin',
    category: 'Endocrine & Thyroid',
    sampleType: 'Serum',
    price: 1000,
    turnaroundTime: 'Same Day',
    testType: 'quantitative',
    parameters: [
      { name: 'Serum Prolactin', unit: 'ng/mL', refRangeMale: '4.0 - 15.2', refRangeFemale: '4.8 - 23.3 (Non-pregnant)', refRangeGeneral: '4.0 - 20.0', refRangeMin: 4.0, refRangeMax: 20.0, method: 'CLIA' }
    ]
  },
  {
    code: 'TSH',
    name: 'Thyroid Stimulating Hormone (TSH)',
    category: 'Endocrine & Thyroid',
    sampleType: 'Serum',
    price: 500,
    turnaroundTime: 'Same Day',
    testType: 'quantitative',
    parameters: [
      { name: 'TSH (Ultra-sensitive)', unit: 'uIU/mL', refRangeGeneral: '0.35 - 4.94', refRangeMin: 0.35, refRangeMax: 4.94, method: 'ECLIA' }
    ]
  },
  {
    code: 'TOTAL_THYROID_PROFILE',
    name: 'T3 T4 TSH (Total Thyroid Profile)',
    category: 'Endocrine & Thyroid',
    sampleType: 'Serum',
    price: 1000,
    turnaroundTime: 'Same Day',
    testType: 'panel',
    parameters: [
      { name: 'Total Triiodothyronine (T3)', unit: 'ng/mL', refRangeGeneral: '0.80 - 2.00', refRangeMin: 0.80, refRangeMax: 2.00 },
      { name: 'Total Thyroxine (T4)', unit: 'ug/dL', refRangeGeneral: '5.1 - 14.1', refRangeMin: 5.1, refRangeMax: 14.1 },
      { name: 'Thyroid Stimulating Hormone (TSH)', unit: 'uIU/mL', refRangeGeneral: '0.35 - 4.94', refRangeMin: 0.35, refRangeMax: 4.94 }
    ]
  },
  {
    code: 'FREE_THYROID_PROFILE',
    name: 'FT3 FT4 TSH (Free Thyroid Profile)',
    category: 'Endocrine & Thyroid',
    sampleType: 'Serum',
    price: 1600,
    turnaroundTime: 'Same Day',
    testType: 'panel',
    parameters: [
      { name: 'Free Triiodothyronine (FT3)', unit: 'pg/mL', refRangeGeneral: '2.3 - 4.2', refRangeMin: 2.3, refRangeMax: 4.2 },
      { name: 'Free Thyroxine (FT4)', unit: 'ng/dL', refRangeGeneral: '0.89 - 1.76', refRangeMin: 0.89, refRangeMax: 1.76 },
      { name: 'Thyroid Stimulating Hormone (TSH)', unit: 'uIU/mL', refRangeGeneral: '0.35 - 4.94', refRangeMin: 0.35, refRangeMax: 4.94 }
    ]
  },
  {
    code: 'LH',
    name: 'Luteinizing Hormone (LH)',
    category: 'Endocrine & Thyroid',
    sampleType: 'Serum',
    price: 1000,
    turnaroundTime: 'Same Day',
    testType: 'quantitative',
    parameters: [
      { name: 'Luteinizing Hormone (LH)', unit: 'mIU/mL', refRangeMale: '1.7 - 8.6', refRangeFemale: 'Follicular: 2.4 - 12.6', refRangeGeneral: '1.7 - 12.6', refRangeMin: 1.7, refRangeMax: 12.6, method: 'CLIA' }
    ]
  },
  {
    code: 'FSH',
    name: 'Follicle Stimulating Hormone (FSH)',
    category: 'Endocrine & Thyroid',
    sampleType: 'Serum',
    price: 1000,
    turnaroundTime: 'Same Day',
    testType: 'quantitative',
    parameters: [
      { name: 'FSH', unit: 'mIU/mL', refRangeMale: '1.5 - 12.4', refRangeFemale: 'Follicular: 3.5 - 12.5', refRangeGeneral: '1.5 - 12.5', refRangeMin: 1.5, refRangeMax: 12.5, method: 'CLIA' }
    ]
  },
  {
    code: 'PSA',
    name: 'Prostate Specific Antigen (PSA Total)',
    category: 'Endocrine & Thyroid',
    sampleType: 'Serum',
    price: 1500,
    turnaroundTime: 'Same Day',
    testType: 'quantitative',
    parameters: [
      { name: 'Total PSA', unit: 'ng/mL', refRangeGeneral: '0.0 - 4.0', refRangeMin: 0.0, refRangeMax: 4.0, method: 'ECLIA' }
    ]
  },

  // ==========================================
  // 9. SEROLOGY, IMMUNOLOGY & SPECIAL TESTS
  // ==========================================
  {
    code: 'TORCH_8',
    name: 'TORCH All Eight (IgG & IgM Panel)',
    category: 'Serology & Immunology',
    sampleType: 'Serum',
    price: 4000,
    turnaroundTime: '24 Hours',
    testType: 'panel',
    parameters: [
      { name: 'Toxoplasma gondii IgG', unit: 'IU/mL', refRangeGeneral: 'Negative (< 1.6)' },
      { name: 'Toxoplasma gondii IgM', unit: 'Index', refRangeGeneral: 'Negative (< 0.8)' },
      { name: 'Rubella Virus IgG', unit: 'IU/mL', refRangeGeneral: 'Immune / Protective' },
      { name: 'Rubella Virus IgM', unit: 'Index', refRangeGeneral: 'Negative (< 0.8)' },
      { name: 'Cytomegalovirus (CMV) IgG', unit: 'U/mL', refRangeGeneral: 'Negative (< 0.5)' },
      { name: 'Cytomegalovirus (CMV) IgM', unit: 'Index', refRangeGeneral: 'Negative (< 0.7)' },
      { name: 'Herpes Simplex (HSV 1 & 2) IgG', unit: 'Index', refRangeGeneral: 'Negative (< 0.9)' },
      { name: 'Herpes Simplex (HSV 1 & 2) IgM', unit: 'Index', refRangeGeneral: 'Negative (< 0.9)' }
    ]
  },
  {
    code: 'TORCH_10',
    name: 'TORCH All Ten (Expanded Panel)',
    category: 'Serology & Immunology',
    sampleType: 'Serum',
    price: 4500,
    turnaroundTime: '24 Hours',
    testType: 'panel',
    parameters: [
      { name: 'Toxoplasma gondii IgG', unit: 'IU/mL', refRangeGeneral: 'Negative' },
      { name: 'Toxoplasma gondii IgM', unit: 'Index', refRangeGeneral: 'Negative' },
      { name: 'Rubella Virus IgG', unit: 'IU/mL', refRangeGeneral: 'Immune / Negative' },
      { name: 'Rubella Virus IgM', unit: 'Index', refRangeGeneral: 'Negative' },
      { name: 'Cytomegalovirus (CMV) IgG', unit: 'U/mL', refRangeGeneral: 'Negative' },
      { name: 'Cytomegalovirus (CMV) IgM', unit: 'Index', refRangeGeneral: 'Negative' },
      { name: 'Herpes Simplex Virus 1 (HSV-1) IgG', unit: 'Index', refRangeGeneral: 'Negative' },
      { name: 'Herpes Simplex Virus 1 (HSV-1) IgM', unit: 'Index', refRangeGeneral: 'Negative' },
      { name: 'Herpes Simplex Virus 2 (HSV-2) IgG', unit: 'Index', refRangeGeneral: 'Negative' },
      { name: 'Herpes Simplex Virus 2 (HSV-2) IgM', unit: 'Index', refRangeGeneral: 'Negative' }
    ]
  },
  {
    code: 'ADA_TB',
    name: 'ADA TB (Adenosine Deaminase)',
    category: 'Serology & Immunology',
    sampleType: 'Pleural / CSF / Ascitic / Serum',
    price: 3500,
    turnaroundTime: '24 Hours',
    testType: 'quantitative',
    parameters: [
      { name: 'Adenosine Deaminase (ADA)', unit: 'U/L', refRangeGeneral: '< 30 U/L (Normal), > 40 U/L (Highly Suggestive of TB)', refRangeMin: 0, refRangeMax: 30, method: 'Enzymatic Deamination' }
    ]
  },
  {
    code: 'TB_GOLD',
    name: 'TB Gold (Interferon Gamma Release / Quantiferon)',
    category: 'Serology & Immunology',
    sampleType: 'Special Whole Blood Tubes (Nil, TB-Ag, Mitogen)',
    price: 4000,
    turnaroundTime: '48 Hours',
    testType: 'qualitative',
    parameters: [
      { name: 'TB Antigen (Nil Corrected)', unit: 'IU/mL', refRangeGeneral: 'Negative (< 0.35)', options: ['Negative (< 0.35 IU/mL)', 'Positive (>= 0.35 IU/mL)', 'Indeterminate'] }
    ]
  },
  {
    code: 'WIDAL',
    name: 'Widal Agglutination Test (Typhoid)',
    category: 'Serology & Immunology',
    sampleType: 'Serum',
    price: 100,
    turnaroundTime: '2 Hours',
    testType: 'panel',
    parameters: [
      { name: 'Salmonella typhi "O"', unit: 'Titre', refRangeGeneral: '< 1:80 (Negative)', options: ['Negative (< 1:80)', 'Positive 1:80', 'Positive 1:160', 'Positive 1:320'] },
      { name: 'Salmonella typhi "H"', unit: 'Titre', refRangeGeneral: '< 1:80 (Negative)', options: ['Negative (< 1:80)', 'Positive 1:80', 'Positive 1:160', 'Positive 1:320'] },
      { name: 'Salmonella paratyphi "AH"', unit: 'Titre', refRangeGeneral: '< 1:80 (Negative)', options: ['Negative (< 1:80)', 'Positive 1:80', 'Positive 1:160'] },
      { name: 'Salmonella paratyphi "BH"', unit: 'Titre', refRangeGeneral: '< 1:80 (Negative)', options: ['Negative (< 1:80)', 'Positive 1:80', 'Positive 1:160'] }
    ]
  },
  {
    code: 'ASO',
    name: 'ASO Titre (Anti-Streptolysin O)',
    category: 'Serology & Immunology',
    sampleType: 'Serum',
    price: 500,
    turnaroundTime: '2 Hours',
    testType: 'quantitative',
    parameters: [
      { name: 'ASO Titre', unit: 'IU/mL', refRangeGeneral: '< 200', refRangeMin: 0, refRangeMax: 200, method: 'Latex Agglutination / Turbidimetry' }
    ]
  },
  {
    code: 'RA_FACTOR',
    name: 'RA Factor (Rheumatoid Arthritis Factor)',
    category: 'Serology & Immunology',
    sampleType: 'Serum',
    price: 500,
    turnaroundTime: '2 Hours',
    testType: 'quantitative',
    parameters: [
      { name: 'RA Factor Quantitative', unit: 'IU/mL', refRangeGeneral: '< 20 (Negative)', refRangeMin: 0, refRangeMax: 20, method: 'Immunoturbidimetry' }
    ]
  },
  {
    code: 'CRP',
    name: 'C-Reactive Protein (CRP Quantitative)',
    category: 'Serology & Immunology',
    sampleType: 'Serum',
    price: 500,
    turnaroundTime: '2 Hours',
    testType: 'quantitative',
    parameters: [
      { name: 'C-Reactive Protein (CRP)', unit: 'mg/L', refRangeGeneral: '< 6.0', refRangeMin: 0, refRangeMax: 6.0, method: 'Turbidimetric Immunoassay' }
    ]
  },
  {
    code: 'MT',
    name: 'Mantoux Test (MT / Tuberculin PPD)',
    category: 'Serology & Immunology',
    sampleType: 'Intradermal Injection (0.1 mL PPD 5TU)',
    price: 100,
    turnaroundTime: '48 - 72 Hours',
    testType: 'qualitative',
    parameters: [
      { name: 'Induration Diameter (after 48-72h)', unit: 'mm', refRangeGeneral: '< 5 mm: Negative, >= 10 mm: Positive', options: ['Negative (< 5 mm)', 'Equivocal (5 - 9 mm)', 'Positive (>= 10 mm)'] }
    ]
  },
  {
    code: 'CA_125',
    name: 'CA 125 (Ovarian Cancer Antigen)',
    category: 'Serology & Immunology',
    sampleType: 'Serum',
    price: 3000,
    turnaroundTime: 'Same Day',
    testType: 'quantitative',
    parameters: [
      { name: 'Cancer Antigen 125 (CA-125)', unit: 'U/mL', refRangeGeneral: '0.0 - 35.0', refRangeMin: 0.0, refRangeMax: 35.0, method: 'CLIA' }
    ]
  },

  // ==========================================
  // 10. RADIOLOGY & DIAGNOSTIC PROCEDURES
  // ==========================================
  {
    code: 'USG_SCROTUM',
    name: 'USG Scrotum / Scrotal Doppler',
    category: 'Radiology & Diagnostic',
    sampleType: 'Ultrasound Imaging Scan',
    price: 1600,
    turnaroundTime: 'Immediate',
    testType: 'narrative',
    parameters: [
      { name: 'Right Testis', unit: '', refRangeGeneral: 'Normal size, contour and homogeneous echotexture' },
      { name: 'Left Testis', unit: '', refRangeGeneral: 'Normal size, contour and homogeneous echotexture' },
      { name: 'Epididymis', unit: '', refRangeGeneral: 'Normal bilateral morphology' },
      { name: 'Hydrocele / Varicocele', unit: '', refRangeGeneral: 'None detected' },
      { name: 'Impression', unit: '', refRangeGeneral: 'Normal Scrotal Ultrasound Examination' }
    ]
  },
  {
    code: 'USG_BREAST',
    name: 'USG Breast (Sonomammography)',
    category: 'Radiology & Diagnostic',
    sampleType: 'Ultrasound Imaging Scan',
    price: 1600,
    turnaroundTime: 'Immediate',
    testType: 'narrative',
    parameters: [
      { name: 'Fibroglandular Tissue', unit: '', refRangeGeneral: 'Normal symmetric distribution' },
      { name: 'Focal Lesion / Solid or Cystic Mass', unit: '', refRangeGeneral: 'None detected' },
      { name: 'Axillary Lymph Nodes', unit: '', refRangeGeneral: 'No pathological lymphadenopathy' },
      { name: 'BIRADS Category', unit: '', refRangeGeneral: 'BIRADS 1 (Negative / Normal)' }
    ]
  },
  {
    code: 'USG_WA',
    name: 'USG W/A (Ultrasound Whole Abdomen & Pelvis)',
    category: 'Radiology & Diagnostic',
    sampleType: 'Ultrasound Scan (Fasting & Full Bladder)',
    price: 800,
    turnaroundTime: 'Immediate',
    testType: 'narrative',
    parameters: [
      { name: 'Liver', unit: '', refRangeGeneral: 'Normal size, smooth margins, homogeneous parenchymal echotexture' },
      { name: 'Gall Bladder', unit: '', refRangeGeneral: 'Normal lumen, no calculi, normal wall thickness' },
      { name: 'Common Bile Duct (CBD)', unit: '', refRangeGeneral: 'Normal caliber' },
      { name: 'Pancreas', unit: '', refRangeGeneral: 'Visualized portions normal in size and echotexture' },
      { name: 'Spleen', unit: '', refRangeGeneral: 'Normal size, homogeneous echotexture' },
      { name: 'Kidneys (Right & Left)', unit: '', refRangeGeneral: 'Normal size, position, shape and good corticomedullary differentiation' },
      { name: 'Urinary Bladder', unit: '', refRangeGeneral: 'Well distended, smooth wall, no intravesical lesion' },
      { name: 'Prostate / Uterus & Adnexa', unit: '', refRangeGeneral: 'Normal study' },
      { name: 'Impression', unit: '', refRangeGeneral: 'Normal Ultrasound Study of Whole Abdomen' }
    ]
  },
  {
    code: 'ECG',
    name: 'Electrocardiogram (12-Lead ECG)',
    category: 'Radiology & Diagnostic',
    sampleType: 'Surface 12-Lead ECG Recording',
    price: 300,
    turnaroundTime: 'Immediate',
    testType: 'narrative',
    parameters: [
      { name: 'Heart Rate', unit: 'bpm', refRangeGeneral: '60 - 100 (Normal Sinus Rhythm)' },
      { name: 'Rhythm', unit: '', refRangeGeneral: 'Regular Sinus Rhythm' },
      { name: 'PR Interval', unit: 'sec', refRangeGeneral: '0.12 - 0.20' },
      { name: 'QRS Duration', unit: 'sec', refRangeGeneral: '< 0.12' },
      { name: 'ST-T Wave Changes', unit: '', refRangeGeneral: 'No acute ST elevation or depression' },
      { name: 'ECG Impression', unit: '', refRangeGeneral: 'Normal 12-Lead Electrocardiogram' }
    ]
  }
];

module.exports = tariffMaster;

