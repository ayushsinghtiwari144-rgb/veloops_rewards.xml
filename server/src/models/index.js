const User = require('./User');
const Giveaway = require('./Giveaway');
const Prize = require('./Prize');
const GiveawayPrize = require('./GiveawayPrize');
const GiveawayParticipation = require('./GiveawayParticipation');
const GiveawayEntryTransaction = require('./GiveawayEntryTransaction');
const GiveawayWinner = require('./GiveawayWinner');
const PrizeClaim = require('./PrizeClaim');
const FraudEvent = require('./FraudEvent');
const AuditLog = require('./AuditLog');

module.exports = {
  User,
  Giveaway,
  Prize,
  GiveawayPrize,
  GiveawayParticipation,
  GiveawayEntryTransaction,
  GiveawayWinner,
  PrizeClaim,
  FraudEvent,
  AuditLog
};
