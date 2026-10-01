const mongoose = require('mongoose');
const config = require('./env');

let cached = global.mongooseCached;
if (!cached) {
  cached = global.mongooseCached = { conn: null, promise: null };
}

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || config.mongoUri;
  if (!mongoUri) {
    console.warn('[WARN] Database Connection: MONGO_URI is not set in environment.');
    return false;
  }

  if (cached.conn && mongoose.connection.readyState === 1) {
    return true;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000
    };
    cached.promise = mongoose.connect(mongoUri, opts).then((m) => {
      console.log(`[INFO] MongoDB Connected: ${m.connection.host} / ${m.connection.name}`);
      return m;
    }).catch((err) => {
      cached.promise = null;
      console.error(`[ERROR] MongoDB Connection Failure: ${err.message}`);
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
    return true;
  } catch (error) {
    return false;
  }
};

const getDbStatus = () => {
  return mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
};

module.exports = {
  connectDB,
  getDbStatus
};
