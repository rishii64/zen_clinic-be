const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    clinic: 'Zen Clinic',
    service: 'Diagnostic Report & Billing Engine',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/tests', require('./routes/testRoutes'));
app.use('/api/billing', require('./routes/billingRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/config', require('./routes/configRoutes'));

// Serve static frontend build if present
const frontendDistPath = path.join(__dirname, '..', 'frontend', 'dist');
const fs = require('fs');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(frontendDistPath, 'index.html'));
    }
    next();
  });
} else {
  // 404 Handler for API
  app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Initialize DB and Start Server
async function startServer() {
  try {
    await connectDB();


    const server = app.listen(PORT, () => {
      console.log(`🚀 App & API active on http://localhost:${PORT}`);
    });

    return server;
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
