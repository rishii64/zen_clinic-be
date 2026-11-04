const { ReportStore, BillStore, ConfigStore } = require('../config/store');

exports.getReports = async (req, res) => {
  try {
    const { status, search } = req.query;
    let filter = {};

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (search && search.trim()) {
      const s = search.trim();
      filter.$or = [
        { reportNumber: new RegExp(s, 'i') },
        { invoiceNumber: new RegExp(s, 'i') },
        { 'patientSnapshot.name': new RegExp(s, 'i') },
        { 'patientSnapshot.phone': new RegExp(s, 'i') },
        { 'patientSnapshot.patientId': new RegExp(s, 'i') }
      ];
    }

    const reports = await ReportStore.find(filter, { createdAt: -1 });
    res.json({ success: true, count: reports.length, reports });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await ReportStore.findById(id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Diagnostic Report not found.' });
    }

    // Include clinic configuration for print/download branding
    const clinicConfig = await ConfigStore.findOne();
    let linkedBill = null;
    if (report.bill) {
      linkedBill = await BillStore.findById(report.bill);
    }

    res.json({
      success: true,
      report,
      clinicConfig,
      linkedBill
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateResults = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      tests,
      overallImpression,
      doctorRemarks,
      status,
      technician,
      doctor
    } = req.body;

    const report = await ReportStore.findById(id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Diagnostic Report not found.' });
    }

    const updatePayload = {};

    if (tests && Array.isArray(tests)) {
      updatePayload.tests = tests;
    }
    if (overallImpression !== undefined) {
      updatePayload.overallImpression = overallImpression;
    }
    if (doctorRemarks !== undefined) {
      updatePayload.doctorRemarks = doctorRemarks;
    }
    if (status) {
      updatePayload.status = status;
    }
    if (technician) {
      updatePayload.technician = { ...report.technician, ...technician };
    }
    if (doctor) {
      updatePayload.doctor = { ...report.doctor, ...doctor };
    }

    // If all tests are marked completed and status not explicitly given, move to Completed
    if (!status && tests && tests.length > 0) {
      const allDone = tests.every(t => t.status === 'Completed' || (t.results && t.results.some(r => r.resultValue)));
      if (allDone && report.status === 'Sample Collected') {
        updatePayload.status = 'In Progress';
      }
    }

    const updated = await ReportStore.findByIdAndUpdate(id, updatePayload);
    res.json({
      success: true,
      report: updated,
      message: 'Test results updated successfully.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.approveReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { overallImpression, doctorRemarks } = req.body;

    const report = await ReportStore.findById(id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Diagnostic Report not found.' });
    }

    const doctorUser = req.user;
    const updated = await ReportStore.findByIdAndUpdate(id, {
      status: 'Approved',
      approvedBy: doctorUser ? doctorUser._id : null,
      approvedAt: new Date(),
      reportedAt: new Date(),
      overallImpression: overallImpression !== undefined ? overallImpression : report.overallImpression,
      doctorRemarks: doctorRemarks !== undefined ? doctorRemarks : report.doctorRemarks,
      doctor: {
        name: doctorUser ? doctorUser.name : (report.doctor && report.doctor.name) || '',
        qualifications: doctorUser ? (doctorUser.qualifications || '') : (report.doctor && report.doctor.qualifications) || '',
        regNo: doctorUser ? (doctorUser.regNumber || '') : (report.doctor && report.doctor.regNo) || '',
        designation: doctorUser ? (doctorUser.designation || '') : (report.doctor && report.doctor.designation) || ''
      }
    });

    res.json({
      success: true,
      report: updated,
      message: 'Diagnostic Report verified and approved by Doctor.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deliverReport = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await ReportStore.findByIdAndUpdate(id, {
      status: 'Delivered'
    });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Report not found.' });
    }
    res.json({ success: true, report: updated, message: 'Report marked as delivered to patient.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

