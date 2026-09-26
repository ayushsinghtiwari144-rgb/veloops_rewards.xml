const { getDbStatus } = require('../config/db');

const getHealthStatus = (req, res) => {
  const dbStatus = getDbStatus();
  const isHealthy = dbStatus === 'connected';

  res.status(isHealthy ? 200 : 503).json({
    success: isHealthy,
    message: isHealthy ? 'VELOOP Rewards API is running' : 'VELOOP Rewards API running in degraded mode (Database unavailable)',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  getHealthStatus
};
