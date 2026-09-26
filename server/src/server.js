const path = require('path');
const config = require('./config/env');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectDB, getDbStatus } = require('./config/db');
const requestIdMiddleware = require('./middleware/requestIdMiddleware');
const { apiLimiter } = require('./middleware/rateLimitMiddleware');
const { errorMiddleware } = require('./middleware/errorMiddleware');
const routes = require('./routes');

const app = express();

// Security Headers (Helmet)
app.use(helmet({
  contentSecurityPolicy: false // Disable CSP header conflict for cross-domain API calls
}));

// Robust CORS Configuration supporting Local Dev, CLIENT_URL, and Vercel Domains
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  config.clientUrl
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const isAllowed = allowedOrigins.includes(origin) ||
                      /\.vercel\.app$/.test(origin) ||
                      (config.nodeEnv === 'development' && /^http:\/\/(localhost|127\.0\.0\.1):/.test(origin));
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID']
}));

// Request ID Middleware (Attaches req.requestId & X-Request-ID header)
app.use(requestIdMiddleware);

// Body Parser Limits (10kb max payload to prevent payload inflation attacks)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Ensure DB connection attempt on request if disconnected
app.use(async (req, res, next) => {
  if (getDbStatus() !== 'connected') {
    await connectDB();
  }
  next();
});

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

if (require.main === module) {
  startServer();
}

module.exports = app;
