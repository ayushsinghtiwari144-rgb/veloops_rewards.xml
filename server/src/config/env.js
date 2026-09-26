const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/veloop_rewards',
  jwtSecret: process.env.JWT_SECRET || 'development_jwt_secret_change_in_production',
  refreshSecret: process.env.REFRESH_SECRET || 'development_refresh_secret_change_in_production',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development'
};

module.exports = config;
