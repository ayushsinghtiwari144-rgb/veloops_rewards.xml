const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    giveawayId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Giveaway',
      default: null,
      index: true
    },
    action: {
      type: String,
      enum: [
        'JOIN_GIVEAWAY',
        'ENTRY_FEE_DEDUCTED',
        'JOIN_REJECTED',
        'DUPLICATE_ATTEMPT',
        'FRAUD_FLAGGED',
        'CLAIM_SUBMITTED',
        'WINNER_SELECTED'
      ],
      required: true,
      index: true
    },
    requestId: {
      type: String,
      default: null,
      index: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index for auditing action by user and timestamp
auditLogSchema.index({ userId: 1, action: 1, timestamp: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
