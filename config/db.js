const dns = require('dns');
const mongoose = require('mongoose');

// Configure reliable DNS resolvers to support mongodb+srv:// lookups on Windows
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Use system default if restricted
}

/**
 * Connect to MongoDB with URI check and descriptive error handling
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  // URI presence check
  if (!uri || !uri.trim()) {
    console.error('❌ [Database Error] MONGODB_URI is not defined in .env file!');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri.trim(), {
      serverSelectionTimeoutMS: 10000
    });

    console.log(`✅ [MongoDB] Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ [MongoDB] Connection Failed: ${error.message}`);

    // Contextual error handling tips
    if (error.message.includes('querySrv ECONNREFUSED')) {
      console.error('👉 DNS SRV resolution issue. Ensure internet access or use Google DNS (8.8.8.8).');
    } else if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
      console.error('👉 Authentication failed. Verify username and password in MONGODB_URI.');
    } else if (error.name === 'MongoServerSelectionError') {
      console.error('👉 Server selection timeout. Ensure your current IP is whitelisted in MongoDB Atlas.');
    }

    process.exit(1);
  }
};

// Event listeners for runtime connection monitoring
mongoose.connection.on('error', (err) => {
  console.error(`[MongoDB] Runtime connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] Disconnected from database.');
});

module.exports = connectDB;

