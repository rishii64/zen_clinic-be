const {
  BillStore,
  PatientStore,
  TestStore,
  ReportStore,
  ConfigStore
} = require('../config/store');

async function getNextInvoiceNumber() {
  const config = await ConfigStore.findOne();
  const prefix = (config && config.invoicePrefix) || 'INV';
  const year = new Date().getFullYear();
  const total = await BillStore.countDocuments();
  const padded = String(total + 1).padStart(4, '0');
  return `${prefix}-${year}-${padded}`;
}

async function getNextReportNumber() {
  const config = await ConfigStore.findOne();
  const prefix = (config && config.reportPrefix) || 'RPT';
  const year = new Date().getFullYear();
  const total = await ReportStore.countDocuments();
  const padded = String(total + 1).padStart(4, '0');
  return `${prefix}-${year}-${padded}`;
}

exports.getBills = async (req, res) => {
  try {
    const { status, search, startDate, endDate } = req.query;
    let filter = {};

    if (status && status !== 'All') {
      filter.paymentStatus = status;
    }

    if (search && search.trim()) {
      const s = search.trim();
      filter.$or = [
        { invoiceNumber: new RegExp(s, 'i') },
        { 'patientSnapshot.name': new RegExp(s, 'i') },
        { 'patientSnapshot.phone': new RegExp(s, 'i') },
        { 'patientSnapshot.patientId': new RegExp(s, 'i') }
      ];
    }

    const bills = await BillStore.find(filter, { createdAt: -1 });
    res.json({ success: true, count: bills.length, bills });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getBillById = async (req, res) => {
  try {
    const { id } = req.params;
    const bill = await BillStore.findById(id);
    if (!bill) {
      return res.status(404).json({ success: false, message: 'Invoice not found.' });
    }
    const config = await ConfigStore.findOne();
    res.json({ success: true, bill, clinicConfig: config });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createBill = async (req, res) => {
  try {
    const {
      patientId,
      referringDoctor,
      testIds,
      customItems,
      discountType,
      discountValue,
      discountReason,
      isGstBill,
      customGstRate,
      isInterState,
      initialPaymentAmount,
      paymentMode,
      transactionId,
      notes
    } = req.body;

    const patient = await PatientStore.findById(patientId);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Selected patient does not exist.' });
    }

    const clinicConfig = await ConfigStore.findOne();

    // Prepare bill items
    let billItems = [];
    let testsForReport = [];

    if (Array.isArray(testIds) && testIds.length > 0) {
      for (const tId of testIds) {
        const testDoc = await TestStore.findById(tId);
        if (testDoc) {
          billItems.push({
            testId: testDoc._id,
            testCode: testDoc.code,
            testName: testDoc.name,
            category: testDoc.category,
            sampleType: testDoc.sampleType,
            unitPrice: testDoc.price,
            quantity: 1,
            totalAmount: testDoc.price
          });

          // Build default parameters for report
          const paramResults = (testDoc.parameters || []).map(p => ({
            paramName: p.name,
            resultValue: p.defaultValue || '',
            unit: p.unit || '',
            refRange: p.refRangeGeneral || `${p.refRangeMale || ''} / ${p.refRangeFemale || ''}`.trim(),
            flag: 'Normal',
            notes: ''
          }));

          testsForReport.push({
            testId: testDoc._id,
            testCode: testDoc.code,
            testName: testDoc.name,
            category: testDoc.category,
            sampleType: testDoc.sampleType,
            method: (testDoc.parameters && testDoc.parameters[0] && testDoc.parameters[0].method) || '',
            results: paramResults,
            impression: '',
            status: 'Pending'
          });
        }
      }
    }

    // Support manual custom items if any
    if (Array.isArray(customItems) && customItems.length > 0) {
      for (const item of customItems) {
        billItems.push({
          testCode: item.code || 'CUSTOM',
          testName: item.name,
          category: item.category || 'Diagnostic',
          unitPrice: Number(item.unitPrice || 0),
          quantity: Number(item.quantity || 1),
          totalAmount: Number(item.unitPrice || 0) * Number(item.quantity || 1)
        });
      }
    }

    if (billItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Please select at least one diagnostic test.' });
    }

    // Compute Subtotal
    const subtotal = billItems.reduce((acc, it) => acc + it.totalAmount, 0);

    // Compute Discount
    let discountAmount = 0;
    const dVal = Number(discountValue || 0);
    if (discountType === 'percentage') {
      discountAmount = Math.round((subtotal * Math.min(100, Math.max(0, dVal))) / 100);
    } else {
      discountAmount = Math.min(subtotal, Math.max(0, dVal));
    }

    const taxableAmount = Math.max(0, subtotal - discountAmount);

    // Compute GST
    let gstRate = 0;
    let cgstRate = 0;
    let cgstAmount = 0;
    let sgstRate = 0;
    let sgstAmount = 0;
    let igstRate = 0;
    let igstAmount = 0;

    const useGst = Boolean(isGstBill !== undefined ? isGstBill : (clinicConfig && clinicConfig.isGstEnabled));

    if (useGst) {
      gstRate = customGstRate !== undefined ? Number(customGstRate) : ((clinicConfig && clinicConfig.defaultGstRate) || 18);
      if (isInterState) {
        igstRate = gstRate;
        igstAmount = Number(((taxableAmount * igstRate) / 100).toFixed(2));
      } else {
        cgstRate = gstRate / 2;
        sgstRate = gstRate / 2;
        cgstAmount = Number(((taxableAmount * cgstRate) / 100).toFixed(2));
        sgstAmount = Number(((taxableAmount * sgstRate) / 100).toFixed(2));
      }
    }

    const grandTotal = Number((taxableAmount + cgstAmount + sgstAmount + igstAmount).toFixed(2));

    // Handle initial payment
    const initPay = Number(initialPaymentAmount || 0);
    const paidAmount = Math.min(grandTotal, Math.max(0, initPay));
    const dueAmount = Number((grandTotal - paidAmount).toFixed(2));

    let paymentStatus = 'Unpaid';
    if (dueAmount <= 0) {
      paymentStatus = 'Paid';
    } else if (paidAmount > 0) {
      paymentStatus = 'Partially Paid';
    }

    const payments = [];
    if (paidAmount > 0) {
      payments.push({
        amount: paidAmount,
        mode: paymentMode || 'Cash',
        transactionId: transactionId || '',
        receivedAt: new Date(),
        receivedBy: req.user ? req.user._id : null,
        note: 'Initial payment at invoice generation'
      });
    }

    const invoiceNumber = await getNextInvoiceNumber();

    const newBill = await BillStore.create({
      invoiceNumber,
      patient: patient._id,
      patientSnapshot: {
        patientId: patient.patientId,
        name: patient.name,
        age: patient.age,
        ageUnit: patient.ageUnit,
        gender: patient.gender,
        phone: patient.phone,
        address: patient.address
      },
      referringDoctor: referringDoctor || (clinicConfig && clinicConfig.doctorDetails && clinicConfig.doctorDetails.name) || 'Self',
      items: billItems,
      subtotal,
      discountType: discountType || 'flat',
      discountValue: dVal,
      discountAmount,
      discountReason: discountReason || '',
      isGstBill: useGst,
      gstRate,
      cgstRate,
      cgstAmount,
      sgstRate,
      sgstAmount,
      igstRate,
      igstAmount,
      isInterState: Boolean(isInterState),
      grandTotal,
      paidAmount,
      dueAmount,
      paymentStatus,
      payments,
      notes: notes || '',
      createdBy: req.user ? req.user._id : null
    });

    // Auto-create linked Diagnostic Report draft
    let newReport = null;
    if (testsForReport.length > 0) {
      const reportNumber = await getNextReportNumber();
      newReport = await ReportStore.create({
        reportNumber,
        patient: patient._id,
        patientSnapshot: {
          patientId: patient.patientId,
          name: patient.name,
          age: patient.age,
          ageUnit: patient.ageUnit,
          gender: patient.gender,
          phone: patient.phone,
          address: patient.address
        },
        bill: newBill._id,
        invoiceNumber: newBill.invoiceNumber,
        sampleCollectedAt: new Date(),
        sampleReceivedAt: new Date(),
        referringDoctor: newBill.referringDoctor,
        status: 'Sample Collected',
        technician: (clinicConfig && clinicConfig.technicianDetails) || {
          name: '',
          qualifications: ''
        },
        doctor: (clinicConfig && clinicConfig.doctorDetails) || {
          name: '',
          qualifications: '',
          regNo: ''
        },
        tests: testsForReport,
        createdBy: req.user ? req.user._id : null
      });

      // Link report back to bill
      await BillStore.findByIdAndUpdate(newBill._id, { report: newReport._id });
      newBill.report = newReport._id;
    }

    // Increment patient visit count
    await PatientStore.findByIdAndUpdate(patient._id, {
      totalVisits: (patient.totalVisits || 1) + 1,
      lastVisitDate: new Date()
    });

    res.status(201).json({
      success: true,
      bill: newBill,
      report: newReport,
      message: 'Invoice generated and diagnostic report linked successfully!'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, mode, transactionId, note } = req.body;

    const bill = await BillStore.findById(id);
    if (!bill) {
      return res.status(404).json({ success: false, message: 'Invoice not found.' });
    }

    const payAmt = Number(amount);
    if (!payAmt || payAmt <= 0) {
      return res.status(400).json({ success: false, message: 'Please provide a valid payment amount.' });
    }

    const newPaid = Number((bill.paidAmount + payAmt).toFixed(2));
    const newDue = Number(Math.max(0, bill.grandTotal - newPaid).toFixed(2));

    let paymentStatus = 'Partially Paid';
    if (newDue <= 0) {
      paymentStatus = 'Paid';
    }

    const paymentRecord = {
      amount: payAmt,
      mode: mode || 'Cash',
      transactionId: transactionId || '',
      receivedAt: new Date(),
      receivedBy: req.user ? req.user._id : null,
      note: note || ''
    };

    const currentPayments = bill.payments || [];
    currentPayments.push(paymentRecord);

    const updated = await BillStore.findByIdAndUpdate(id, {
      paidAmount: newPaid,
      dueAmount: newDue,
      paymentStatus,
      payments: currentPayments
    });

    res.json({
      success: true,
      bill: updated,
      message: `Payment of ₹${payAmt} recorded successfully.`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.cancelBill = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const updated = await BillStore.findByIdAndUpdate(id, {
      status: 'Cancelled',
      notes: reason ? `[Cancelled: ${reason}]` : '[Cancelled]'
    });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Invoice not found.' });
    }
    res.json({ success: true, message: 'Invoice marked as cancelled.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.deleteBill = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await BillStore.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Invoice not found.' });
    }
    // Unlink any diagnostic reports pointing to this bill
    await ReportStore.updateMany({ bill: id }, { $unset: { bill: 1, invoiceNumber: 1 } });

    res.json({ success: true, message: 'Invoice deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
