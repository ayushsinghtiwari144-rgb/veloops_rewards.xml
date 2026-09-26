const express = require('express');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/authorizationMiddleware');
const winnerService = require('../services/winnerService');
const { AuditLog, FraudEvent } = require('../models');
const { successResponse } = require('../utils/apiResponse');

const router = express.Router();

// All admin routes require authentication and ADMIN role
router.use(requireAuth, requireRole('ADMIN'));

// GET /api/admin/test
router.get('/test', (req, res) => {
  return successResponse(
    res,
    {
      adminUser: {
        id: req.user._id,
        email: req.user.email,
        role: req.user.role
      }
    },
    'Admin authorization check passed successfully'
  );
});

// POST /api/admin/giveaways/:id/select-winners (Execute Server-Side Winner Selection)
router.post('/giveaways/:id/select-winners', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { selectionMethod } = req.body || {};

    const winners = await winnerService.selectWinnersForGiveaway(
      id,
      selectionMethod || 'ADMIN',
      req.user._id
    );

    return successResponse(
      res,
      {
        winnerCount: winners.length,
        winners: winners.map(w => ({
          id: w._id.toString(),
          userId: w.userId,
          selectedAt: w.selectedAt,
          status: w.status
        }))
      },
      'Winner selection completed successfully',
      201
    );
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/audit-logs - Query security audit logs
router.get('/audit-logs', async (req, res, next) => {
  try {
    const logs = await AuditLog.find()
      .populate('userId', 'name email role')
      .populate('giveawayId', 'title slug')
      .sort({ timestamp: -1 })
      .limit(50);

    return successResponse(res, logs, 'Audit logs retrieved successfully');
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/fraud-events - Query risk & fraud events
router.get('/fraud-events', async (req, res, next) => {
  try {
    const events = await FraudEvent.find()
      .populate('userId', 'name email role status')
      .populate('giveawayId', 'title slug')
      .sort({ createdAt: -1 })
      .limit(50);

    return successResponse(res, events, 'Fraud events retrieved successfully');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
