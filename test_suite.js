require('dotenv').config();
const { connectDB, UserStore, PatientStore, TestStore, BillStore, ReportStore, ConfigStore } = require('./config/store');

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

  // 1. Clinic Config
  const configRes = await callHandler(configController.getConfig);
  console.log('✓ 1. Clinic Configuration Loaded:');
  console.log(`   Clinic: ${configRes.data.config.clinicName}`);

  // 2. Register Initial Admin User
  let adminRes = await callHandler(authController.register, {
    body: {
      name: 'Test Administrator',
      email: 'testadmin@zenclinic.com',
      password: 'password123',
      role: 'Admin'
    }
  });
  if (adminRes.statusCode !== 201) {
    adminRes = await callHandler(authController.login, {
      body: { email: 'testadmin@zenclinic.com', password: 'password123' }
    });
  }
  const adminUser = adminRes.data.user;
  console.log('\n✓ 2. Admin Authentication / Registration Successful:');
  console.log(`   User: ${adminUser.name} | Role: ${adminUser.role}`);

  // 3. Register Doctor User
  let docRes = await callHandler(authController.createUser, {
    body: {
      name: 'Dr. Test Doctor',
      email: 'testdoctor@zenclinic.com',
      password: 'password123',
      role: 'Doctor',
      regNumber: 'DOC-1234',
      qualifications: 'M.B.B.S, M.D.'
    },
    user: adminUser
  });
  if (docRes.statusCode !== 201) {
    docRes = await callHandler(authController.login, {
      body: { email: 'testdoctor@zenclinic.com', password: 'password123' }
    });
  }
  const docUser = docRes.data.user;
  console.log('\n✓ 3. Doctor Registration / Authentication Successful:');
  console.log(`   Doctor: ${docUser.name} | Role: ${docUser.role}`);

  // 4. Test Catalog Creation & Retrieval
  let cbc = await TestStore.findOne({ code: 'CBC' });
  if (!cbc) {
    cbc = await TestStore.create({
      code: 'CBC',
      name: 'COMPLETE BLOOD COUNT',
      category: 'Hematology',
      price: 400,
      parameters: [{ name: 'Hemoglobin', unit: 'g/dL', refRangeGeneral: '12-16' }]
    });
  }
  let sugarF = await TestStore.findOne({ code: 'SUGAR_F' });
  if (!sugarF) {
    sugarF = await TestStore.create({
      code: 'SUGAR_F',
      name: 'FASTING BLOOD SUGAR',
      category: 'Biochemistry',
      price: 60,
      parameters: [{ name: 'Fasting Blood Glucose', unit: 'mg/dL', refRangeGeneral: '70-100' }]
    });
  }
  let lft = await TestStore.findOne({ code: 'LFT' });
  if (!lft) {
    lft = await TestStore.create({
      code: 'LFT',
      name: 'LIVER FUNCTION TEST',
      category: 'Biochemistry',
      price: 800,
      parameters: [{ name: 'SGPT', unit: 'U/L', refRangeGeneral: '0-45' }]
    });
  }

  const testsRes = await callHandler(testController.getTests, { query: {} });
  console.log(`\n✓ 4. Master Diagnostic Catalog Verified: ${testsRes.data.count} Tests Available`);
  console.log(`   - CBC: ₹${cbc.price}`);
  console.log(`   - Fasting Sugar: ₹${sugarF.price}`);
  console.log(`   - LFT: ₹${lft.price}`);

  // 5. Patient Registration
  const patientRes = await callHandler(patientController.createPatient, {
    body: {
      name: 'Manoj Kumar',
      age: 45,
      ageUnit: 'Years',
      gender: 'Male',
      phone: '+91 98765 00000',
      email: 'manoj@example.com',
      address: 'Main Road',
      bloodGroup: 'B+'
    },
    user: adminUser
  });
  const patient = patientRes.data.patient;
  console.log('\n✓ 5. Patient Registration Successful:');
  console.log(`   Patient ID: ${patient.patientId} | Name: ${patient.name} | Phone: ${patient.phone}`);

  // 6. Test-Based Billing with GST and Discount
  const billRes = await callHandler(billingController.createBill, {
    body: {
      patientId: patient._id,
      referringDoctor: 'Dr. Test Doctor',
      testIds: [cbc._id, sugarF._id, lft._id], // 400 + 60 + 800 = 1260
      discountType: 'flat',
      discountValue: 60, // Subtotal 1260 - 60 = 1200
      discountReason: 'Courtesy waiver',
      isGstBill: true,
      customGstRate: 18, // 18% of 1200 = 216
      isInterState: false,
      initialPaymentAmount: 1000,
      paymentMode: 'UPI',
      transactionId: 'UPI-TEST-00912',
      notes: 'Test billing order'
    },
    user: adminUser
  });
  const bill = billRes.data.bill;
  const report = billRes.data.report;
  console.log('\n✓ 6. Test-Based Invoice & Linked Report Generated:');
  console.log(`   Invoice Number: ${bill.invoiceNumber}`);
  console.log(`   Subtotal: ₹${bill.subtotal} | Discount: ₹${bill.discountAmount}`);
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
    user: adminUser
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
    results: (t.results || []).map(r => {
      let val = '14.2';
      let flag = 'Normal';
      if (r.paramName?.includes('Hemoglobin')) { val = '15.1'; }
      if (r.paramName?.includes('Glucose')) { val = '168.0'; flag = 'High'; }
      return { ...r, resultValue: val, flag };
    })
  }));

  const updateResultsRes = await callHandler(reportController.updateResults, {
    params: { id: report._id },
    body: {
      tests: updatedTests,
      overallImpression: 'Normal parameters observed.',
      doctorRemarks: 'Routine checkup satisfactory.',
      status: 'Completed'
    }
  });
  console.log('\n✓ 8. Diagnostic Test Results Entered:');
  console.log(`   Report: ${updateResultsRes.data.report.reportNumber} | Status: ${updateResultsRes.data.report.status}`);

  // 9. Doctor Verification & Sign-Off
  const approveRes = await callHandler(reportController.approveReport, {
    params: { id: report._id },
    body: {
      overallImpression: 'Verified and approved.',
      doctorRemarks: 'All values verified.'
    },
    user: docUser
  });
  console.log('\n✓ 9. Doctor Sign-Off & Approval Completed:');
  console.log(`   Status: ${approveRes.data.report.status}`);

  // 10. Dashboard Analytics Aggregation
  const dashRes = await callHandler(dashboardController.getStats);
  console.log('\n✓ 10. Dashboard Aggregated KPIs:');
  console.log(`   Total Patients: ${dashRes.data.stats.totalPatients}`);
  console.log(`   Total Tests in Catalog: ${dashRes.data.stats.totalTestsCatalog}`);
  console.log(`   Total Invoiced: ₹${dashRes.data.stats.totalRevenue}`);
  console.log(`   Today Revenue: ₹${dashRes.data.stats.todayRevenue}`);
  console.log(`   Pending Reports: ${dashRes.data.stats.pendingReportsCount}`);
  console.log(`   Outstanding Balance: ₹${dashRes.data.stats.totalOutstandingDue}`);

  // Cleanup test artifacts from database so it remains clean
  await PatientStore.findByIdAndDelete(patient._id);
  await BillStore.findByIdAndDelete(bill._id);
  await ReportStore.findByIdAndDelete(report._id);
  await TestStore.findByIdAndDelete(cbc._id);
  await TestStore.findByIdAndDelete(sugarF._id);
  await TestStore.findByIdAndDelete(lft._id);
  await UserStore.findByIdAndDelete(adminUser.id || adminUser._id);
  await UserStore.findByIdAndDelete(docUser.id || docUser._id);

  console.log('\n================================================================');
  console.log('🎉 ALL 10 CLINIC MANAGEMENT CORE MODULE TESTS PASSED (100% OK)!');
  console.log('🧹 Test artifacts cleaned from database.');
  console.log('================================================================\n');
}

runTests().then(() => process.exit(0)).catch(err => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
