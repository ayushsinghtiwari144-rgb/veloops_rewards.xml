const path = require('path');
const config = require('./config/env');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectDB } = require('./config/db');
const requestIdMiddleware = require('./middleware/requestIdMiddleware');
const { apiLimiter } = require('./middleware/rateLimitMiddleware');
const { errorMiddleware } = require('./middleware/errorMiddleware');
const routes = require('./routes');

const app = express();

// Security Headers (Helmet)
app.use(helmet());

// CORS Configuration using CLIENT_URL environment variable
app.use(cors({
  origin: config.clientUrl,
  credentials: true
}));

// Request ID Middleware (Attaches req.requestId & X-Request-ID header)
app.use(requestIdMiddleware);

// Body Parser Limits (10kb max payload to prevent payload inflation attacks)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Global API Rate Limiting
app.use('/api', apiLimiter);

// API Routes
app.use('/api', routes);

// Centralized Error Handling Middleware
app.use(errorMiddleware);

// Initialize Database Connection and Start Server
const startServer = async () => {
  console.log(`[INFO] Initializing VELOOP Rewards Server (${config.nodeEnv})...`);
  
  // Connect to MongoDB
  const dbConnected = await connectDB();
  if (!dbConnected) {
    console.warn('[WARN] Server starting without active MongoDB connection. Database status is monitored on /api/health.');
  }

  app.listen(config.port, () => {
    console.log(`[INFO] VELOOP Rewards Server listening on port ${config.port}`);
    console.log(`[INFO] Allowed CORS Origin: ${config.clientUrl}`);
    console.log(`[INFO] Health Check Endpoint: http://localhost:${config.port}/api/health`);
  });
};

startServer();
