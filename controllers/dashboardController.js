const {
  PatientStore,
  TestStore,
  BillStore,
  ReportStore
} = require('../config/store');

exports.getStats = async (req, res) => {
  try {
    const patients = await PatientStore.find();
    const bills = await BillStore.find({ status: { $ne: 'Cancelled' } });
    const reports = await ReportStore.find();
    const tests = await TestStore.find();

    const totalPatients = patients.length;
    const totalTestsCatalog = tests.length;

    // Revenue calculations
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    let totalRevenue = 0;
    let todayRevenue = 0;
    let monthlyRevenue = 0;
    let totalOutstandingDue = 0;
    let unpaidBillsCount = 0;

    const paymentModes = { Cash: 0, UPI: 0, Card: 0, Other: 0 };
    const testCounts = {};

    bills.forEach(bill => {
      totalOutstandingDue += bill.dueAmount || 0;
      if (bill.paymentStatus !== 'Paid') {
        unpaidBillsCount++;
      }

      // Calculate tests count
      (bill.items || []).forEach(item => {
        const name = item.testName || item.testCode;
        testCounts[name] = (testCounts[name] || 0) + (item.quantity || 1);
      });

      // Payments
      (bill.payments || []).forEach(p => {
        const pDate = new Date(p.receivedAt || bill.createdAt);
        const amount = p.amount || 0;
        totalRevenue += amount;

        if (pDate >= today) {
          todayRevenue += amount;
        }
        if (pDate >= firstDayOfMonth) {
          monthlyRevenue += amount;
        }

        const mode = p.mode || 'Cash';
        if (mode === 'Cash') paymentModes.Cash += amount;
        else if (mode === 'UPI') paymentModes.UPI += amount;
        else if (mode === 'Card') paymentModes.Card += amount;
        else paymentModes.Other += amount;
      });
    });

    // Report status counts
    const reportStatusCounts = {
      'Sample Collected': 0,
      'In Progress': 0,
      'Completed': 0,
      'Approved': 0,
      'Delivered': 0
    };

    reports.forEach(r => {
      const s = r.status || 'Sample Collected';
      if (reportStatusCounts[s] !== undefined) {
        reportStatusCounts[s]++;
      }
    });

    const pendingReportsCount =
      reportStatusCounts['Sample Collected'] +
      reportStatusCounts['In Progress'] +
      reportStatusCounts['Completed'];

    // Top tests
    const topTests = Object.entries(testCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Recent 5 bills
    const recentBills = bills.slice(0, 5);

    // Recent 5 reports
    const recentReports = reports.slice(0, 5);

    res.json({
      success: true,
      stats: {
        totalPatients,
        totalTestsCatalog,
        totalBillsCount: bills.length,
        totalRevenue: Math.round(totalRevenue),
        todayRevenue: Math.round(todayRevenue),
        monthlyRevenue: Math.round(monthlyRevenue),
        totalOutstandingDue: Math.round(totalOutstandingDue),
        unpaidBillsCount,
        pendingReportsCount,
        reportStatusCounts,
        paymentModes,
        topTests,
        recentBills,
        recentReports
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

