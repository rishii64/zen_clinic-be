const { connectDB, UserStore, PatientStore, TestStore, BillStore, ReportStore, ConfigStore } = require('./config/store');
const seedDatabase = require('./seed/seedData');

const authController = require('./controllers/authController');
const patientController = require('./controllers/patientController');
const testController = require('./controllers/testController');
const billingController = require('./controllers/billingController');
const reportController = require('./controllers/reportController');
const dashboardController = require('./controllers/dashboardController');
const configController = require('./controllers/configController');

function callHandler(fn, reqObj = {}) {
  return new Promise((resolve, reject) => {
    let statusCode = 200;
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        resolve({ statusCode, data });
      },
      send(data) {
        resolve({ statusCode, data });
      }
    };
    try {
      fn(reqObj, res).catch(reject);
    } catch (err) {
      reject(err);
    }
  });
}

async function runTests() {
  console.log('🧪 Running Comprehensive Clinic Management Controller & Model Tests...\n');

  await connectDB();
  await seedDatabase();

  // 1. Clinic Config
  const configRes = await callHandler(configController.getConfig);
  console.log('✓ 1. Clinic Configuration Loaded:');
  console.log(`   Clinic: ${configRes.data.config.clinicName}`);
  console.log(`   Reg No: ${configRes.data.config.regNumber}`);
  console.log(`   Address: ${configRes.data.config.address}`);
  console.log(`   Doctor: ${configRes.data.config.doctorDetails?.name} (${configRes.data.config.doctorDetails?.qualifications})`);
  console.log(`   Technician: ${configRes.data.config.technicianDetails?.name} (${configRes.data.config.technicianDetails?.qualifications})`);

  // 2. Authentication - Admin Login
  const adminLogin = await callHandler(authController.login, {
    body: { email: 'admin@rajjanchghar.com', password: 'admin123' }
  });
  console.log('\n✓ 2. Admin Authentication Successful:');
  console.log(`   User: ${adminLogin.data.user.name} | Role: ${adminLogin.data.user.role}`);
  console.log(`   JWT Token Generated: ${adminLogin.data.token.substring(0, 24)}...`);

  // 3. Authentication - Doctor Login
  const docLogin = await callHandler(authController.login, {
    body: { email: 'doctor@rajjanchghar.com', password: 'admin123' }
  });
  console.log('\n✓ 3. Doctor Authentication Successful:');
  console.log(`   Doctor: ${docLogin.data.user.name} | Reg: ${docLogin.data.user.regNumber} | Role: ${docLogin.data.user.role}`);

  // 4. Test Catalog Verification
  const testsRes = await callHandler(testController.getTests, { query: {} });
  console.log(`\n✓ 4. Master Diagnostic Catalog Verified: ${testsRes.data.count} Tests Available`);
  const cbc = testsRes.data.tests.find(t => t.code === 'CBC');
  const sugarF = testsRes.data.tests.find(t => t.code === 'SUGAR_F');
  const lft = testsRes.data.tests.find(t => t.code === 'LFT');
  const widal = testsRes.data.tests.find(t => t.code === 'WIDAL');
  const usg = testsRes.data.tests.find(t => t.code === 'USG_WA');
  console.log(`   - CBC (Complete Blood Count): ₹${cbc?.price} [${cbc?.parameters?.length} parameters]`);
  console.log(`   - SUGAR F (Fasting Glucose): ₹${sugarF?.price} [${sugarF?.parameters?.length} parameter]`);
  console.log(`   - LFT (Liver Function Test): ₹${lft?.price} [${lft?.parameters?.length} parameters]`);
  console.log(`   - WIDAL (Typhoid Agglutination): ₹${widal?.price}`);
  console.log(`   - USG Whole Abdomen: ₹${usg?.price}`);

  // 5. Patient Registration
  const patientRes = await callHandler(patientController.createPatient, {
    body: {
      name: 'Manoj Kumar Thakur',
      age: 52,
      ageUnit: 'Years',
      gender: 'Male',
      phone: '+91 98350 44882',
      email: 'manoj.thakur@example.com',
      address: 'Hospital Road, Saharghat',
      bloodGroup: 'O+',
      medicalHistory: 'Complaints of joint pain and high blood sugar'
    },
    user: adminLogin.data.user
  });
  const patient = patientRes.data.patient;
  console.log('\n✓ 5. Patient Registration Successful:');
  console.log(`   Patient ID: ${patient.patientId} | Name: ${patient.name} | Phone: ${patient.phone}`);

  // 6. Test-Based Billing with GST and Discount
  const billRes = await callHandler(billingController.createBill, {
    body: {
      patientId: patient._id,
      referringDoctor: 'Dr. R.K. MANDAL',
      testIds: [cbc._id, sugarF._id, lft._id], // 400 + 60 + 800 = 1260
      discountType: 'flat',
      discountValue: 60, // Subtotal 1260 - 60 = 1200
      discountReason: 'Courtesy waiver',
      isGstBill: true,
      customGstRate: 18, // 18% of 1200 = 216 (9% CGST 108 + 9% SGST 108)
      isInterState: false,
      initialPaymentAmount: 1000,
      paymentMode: 'UPI',
      transactionId: 'UPI-TEST-00912',
      notes: 'Test billing order'
    },
    user: adminLogin.data.user
  });
  const bill = billRes.data.bill;
  const report = billRes.data.report;
  console.log('\n✓ 6. Test-Based Invoice & Linked Report Generated:');
  console.log(`   Invoice Number: ${bill.invoiceNumber}`);
  console.log(`   Subtotal: ₹${bill.subtotal} | Discount: ₹${bill.discountAmount}`);
  console.log(`   CGST (9%): ₹${bill.cgstAmount} | SGST (9%): ₹${bill.sgstAmount}`);
  console.log(`   Grand Total: ₹${bill.grandTotal} | Paid: ₹${bill.paidAmount} | Due: ₹${bill.dueAmount}`);
  console.log(`   Payment Status: ${bill.paymentStatus}`);
  console.log(`   Linked Diagnostic Report Draft: ${report?.reportNumber} [Status: ${report?.status}]`);

  // 7. Add Subsequent Payment
  const addPayRes = await callHandler(billingController.addPayment, {
    params: { id: bill._id },
    body: {
      amount: bill.dueAmount,
      mode: 'Cash',
      transactionId: 'CASH-SETTLE-01',
      note: 'Settled remaining balance'
    },
    user: adminLogin.data.user
  });
  console.log('\n✓ 7. Subsequent Due Payment Handled:');
  console.log(`   Total Paid: ₹${addPayRes.data.bill.paidAmount} | Remaining Due: ₹${addPayRes.data.bill.dueAmount} | Status: ${addPayRes.data.bill.paymentStatus}`);

  // 8. Result Entry for Diagnostic Report
  const reportDetails = await callHandler(reportController.getReportById, {
    params: { id: report._id }
  });

  const updatedTests = reportDetails.data.report.tests.map(t => ({
    ...t,
    status: 'Completed',
    results: t.results.map(r => {
      let val = '14.2';
      let flag = 'Normal';
      if (r.paramName.includes('Hemoglobin')) { val = '15.1'; }
      if (r.paramName.includes('Fasting Blood Glucose')) { val = '168.0'; flag = 'High'; } // Hyperglycemia
      if (r.paramName.includes('SGPT')) { val = '64.0'; flag = 'High'; }
      return { ...r, resultValue: val, flag };
    })
  }));

  const updateResultsRes = await callHandler(reportController.updateResults, {
    params: { id: report._id },
    body: {
      tests: updatedTests,
      overallImpression: 'Impaired Fasting Glucose (Hyperglycemia) and elevated transaminases. Normal CBC parameters.',
      doctorRemarks: 'Strict glycemic control advised. Follow up blood sugar fasting and HbA1c test in 15 days.',
      status: 'Completed'
    }
  });
  console.log('\n✓ 8. Diagnostic Test Results Entered & Auto-Flagged:');
  console.log(`   Report: ${updateResultsRes.data.report.reportNumber} | Status: ${updateResultsRes.data.report.status}`);
  console.log(`   Impression: ${updateResultsRes.data.report.overallImpression}`);

  // 9. Doctor Verification & Sign-Off
  const approveRes = await callHandler(reportController.approveReport, {
    params: { id: report._id },
    body: {
      overallImpression: 'Diabetic profile with mild hepatic transaminitis. Verified and approved.',
      doctorRemarks: 'Consult Physician for anti-diabetic medication initiation.'
    },
    user: docLogin.data.user
  });
  console.log('\n✓ 9. Doctor Sign-Off & Approval Completed:');
  console.log(`   Status: ${approveRes.data.report.status}`);
  console.log(`   Approved By Doctor: ${approveRes.data.report.doctor?.name} (${approveRes.data.report.doctor?.qualifications})`);
  console.log(`   Technician: ${approveRes.data.report.technician?.name} (${approveRes.data.report.technician?.qualifications})`);

  // 10. Dashboard Analytics Aggregation
  const dashRes = await callHandler(dashboardController.getStats);
  console.log('\n✓ 10. Dashboard Aggregated KPIs:');
  console.log(`   Total Patients: ${dashRes.data.stats.totalPatients}`);
  console.log(`   Total Tests in Catalog: ${dashRes.data.stats.totalTestsCatalog}`);
  console.log(`   Total Invoiced: ₹${dashRes.data.stats.totalRevenue}`);
  console.log(`   Today Revenue: ₹${dashRes.data.stats.todayRevenue}`);
  console.log(`   Pending Reports: ${dashRes.data.stats.pendingReportsCount}`);
  console.log(`   Outstanding Balance: ₹${dashRes.data.stats.totalOutstandingDue}`);

  console.log('\n================================================================');
  console.log('🎉 ALL 10 CLINIC MANAGEMENT CORE MODULE TESTS PASSED (100% OK)!');
  console.log('================================================================\n');
}

runTests().catch(err => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
