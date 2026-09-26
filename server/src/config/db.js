const mongoose = require('mongoose');
const config = require('./env');

let isConnected = false;

const connectDB = async () => {
  if (!config.mongoUri) {
    console.warn('[WARN] Database Connection: MONGO_URI is not set in environment.');
    isConnected = false;
    return false;
  }

  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000 // 5 sec timeout for local/remote DB check
    });

    isConnected = true;
    console.log(`[INFO] MongoDB Connected: ${conn.connection.host} / ${conn.connection.name}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.error(`[ERROR] MongoDB Connection Failure: ${error.message}`);
    return false;
  }
};

const getDbStatus = () => {
  // Mongoose connection state: 1 = connected
  return mongoose.connection.readyState === 1 || isConnected ? 'connected' : 'disconnected';
};

module.exports = {
  connectDB,
  getDbStatus
};
