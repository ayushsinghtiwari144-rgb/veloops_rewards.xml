import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRewardsApi, getChallengesApi, getTransactionsApi, claimChallengeApi, redeemRewardApi } from '../services/hubService';
import {
  Coins,
  Zap,
  Gift,
  Trophy,
  CheckCircle,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Clock,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export const Dashboard = () => {
  const { user, refreshUser } = useAuth();
  const [featuredRewards, setFeaturedRewards] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [redeemingReward, setRedeemingReward] = useState(null);
  const [shippingAddress, setShippingAddress] = useState('');
  const [redeemSuccess, setRedeemSuccess] = useState(null);
  const [redeemError, setRedeemError] = useState('');
  const [claimingId, setClaimingId] = useState(null);
  const [claimMessage, setClaimMessage] = useState('');

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [rewardsData, challengesData, txData] = await Promise.all([
        getRewardsApi({ featured: true }),
        getChallengesApi(),
        getTransactionsApi()
      ]);
      setFeaturedRewards(rewardsData.slice(0, 4));
      setChallenges(challengesData.slice(0, 3));
      setTransactions(txData.slice(0, 5));
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleClaimChallenge = async (challengeId) => {
    setClaimingId(challengeId);
    setClaimMessage('');
    try {
      const result = await claimChallengeApi(challengeId);
      setClaimMessage(`+${result.pointsAwarded} VE Points Claimed!`);
      await refreshUser();
      await loadDashboardData();
    } catch (err) {
      setClaimMessage(err.message || 'Failed to claim challenge');
    } finally {
      setClaimingId(null);
    }
  };

  const handleExecuteRedeem = async (e) => {
    e.preventDefault();
    if (!redeemingReward) return;
    setRedeemError('');
    setRedeemSuccess(null);

    try {
      const result = await redeemRewardApi(redeemingReward._id, { shippingAddress });
      setRedeemSuccess(result);
      await refreshUser();
      await loadDashboardData();
    } catch (err) {
      setRedeemError(err.message || 'Redemption failed. Check your points balance.');
    }
  };

  const xpProgress = user ? Math.min(100, Math.floor((user.xp / (user.level * 500)) * 100)) : 0;

  return (
    <div className="container py-4">
      {/* Welcome Banner */}
      <div
        className="p-4 p-md-5 rounded-4 mb-4 text-white position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
          boxShadow: '0 10px 30px rgba(67, 56, 202, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div className="row align-items-center">
          <div className="col-lg-8">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-warning text-dark font-weight-bold px-3 py-1 rounded-pill fs-7">
                🔥 {user?.streakDays || 1} Day Streak
              </span>
              <span className="badge bg-indigo text-white font-weight-bold px-3 py-1 rounded-pill fs-7">
                Level {user?.level || 1} Explorer
              </span>
            </div>
            <h2 className="display-6 font-weight-bold mb-2">
              Welcome back, {user?.name?.split(' ')[0] || 'Member'}! 👋
            </h2>
            <p className="text-light opacity-75 mb-3">
              Earn points through daily challenges, rank on the weekly leaderboard, and redeem premium tech rewards.
            </p>

            {/* Level & XP Progress Bar */}
            <div className="mw-100" style={{ maxWidth: '480px' }}>
              <div className="d-flex justify-content-between small mb-1 font-weight-medium">
                <span>XP Progress to Level {(user?.level || 1) + 1}</span>
                <span>{user?.xp || 0} / {(user?.level || 1) * 500} XP</span>
              </div>
              <div className="progress bg-black bg-opacity-30 rounded-pill" style={{ height: '10px' }}>
                <div
                  className="progress-bar bg-gradient-indigo-purple rounded-pill"
                  role="progressbar"
                  style={{ width: `${xpProgress}%`, background: 'linear-gradient(90deg, #818cf8, #a855f7)' }}
                  aria-valuenow={xpProgress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                />
              </div>
            </div>
          </div>

          <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">
            <Link to="/store" className="btn btn-warning btn-lg rounded-3 px-4 font-weight-bold shadow-lg">
              <ShoppingBag size={20} className="me-2" />
              Explore Rewards Store
            </Link>
          </div>
        </div>
      </div>

      {claimMessage && (
        <div className="alert alert-info alert-dismissible fade show rounded-3 mb-4" role="alert">
          <Sparkles size={18} className="me-2" />
          {claimMessage}
          <button type="button" className="btn-close" onClick={() => setClaimMessage('')} />
        </div>
      )}

      {/* 5 Statistics Cards */}
      <div className="row g-3 mb-4">
        <div className="col-xl-2 col-md-4 col-6">
          <div className="p-3 bg-dark border border-secondary rounded-3 text-white h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-secondary small">VE Points</span>
              <Coins size={20} className="text-warning" />
            </div>
            <h4 className="mb-0 font-weight-bold text-warning">{user?.pointsBalance?.toLocaleString() || 0}</h4>
            <span className="small text-secondary">Available balance</span>
          </div>
        </div>

        <div className="col-xl-2 col-md-4 col-6">
          <div className="p-3 bg-dark border border-secondary rounded-3 text-white h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-secondary small">Current Level</span>
              <Zap size={20} className="text-indigo" />
            </div>
            <h4 className="mb-0 font-weight-bold text-indigo">Lvl {user?.level || 1}</h4>
            <span className="small text-secondary">{xpProgress}% to Lvl {(user?.level || 1) + 1}</span>
          </div>
        </div>

        <div className="col-xl-2 col-md-4 col-6">
          <div className="p-3 bg-dark border border-secondary rounded-3 text-white h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-secondary small">Active Streak</span>
              <TrendingUp size={20} className="text-danger" />
            </div>
            <h4 className="mb-0 font-weight-bold text-danger">{user?.streakDays || 1} Days</h4>
            <span className="small text-secondary">Daily login streak</span>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 col-6">
          <div className="p-3 bg-dark border border-secondary rounded-3 text-white h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-secondary small">Redemptions</span>
              <Gift size={20} className="text-success" />
            </div>
            <h4 className="mb-0 font-weight-bold text-success">
              {transactions.filter(t => t.type === 'REDEEMED').length} Items
            </h4>
            <span className="small text-secondary">Rewards claimed</span>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 col-12">
          <div className="p-3 bg-dark border border-secondary rounded-3 text-white h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-secondary small">Challenges</span>
              <CheckCircle size={20} className="text-info" />
            </div>
            <h4 className="mb-0 font-weight-bold text-info">
              {challenges.filter(c => c.completed).length} / {challenges.length}
            </h4>
            <span className="small text-secondary">Completed today</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Active Challenges & Recent Transactions */}
      <div className="row g-4 mb-4">
        {/* Daily Challenges Preview */}
        <div className="col-lg-7">
          <div className="p-4 bg-dark border border-secondary rounded-4 text-white h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="mb-0 font-weight-bold">⚡ Daily Challenges</h5>
                <span className="small text-secondary">Earn bonus points every 24 hours</span>
              </div>
              <Link to="/challenges" className="btn btn-sm btn-outline-indigo rounded-3">
                View All <ChevronRight size={16} />
              </Link>
            </div>

            <div className="d-flex flex-column gap-3">
              {challenges.length === 0 ? (
                <div className="text-center py-4 text-secondary">Loading challenges...</div>
              ) : (
                challenges.map(c => (
                  <div
                    key={c.id}
                    className="p-3 bg-dark-subtle border border-secondary rounded-3 d-flex align-items-center justify-content-between gap-3"
                  >
                    <div>
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-indigo-subtle text-indigo px-2 py-1 rounded">
                          +{c.pointsReward} VE Pts
                        </span>
                        <h6 className="mb-0 font-weight-bold text-white">{c.title}</h6>
                      </div>
                      <p className="small text-secondary mb-0 mt-1">{c.description}</p>
                    </div>

                    <div>
                      {c.claimed ? (
                        <span className="badge bg-success-subtle text-success px-3 py-2 rounded-3">
                          <CheckCircle size={14} className="me-1" /> Claimed
                        </span>
                      ) : (
                        <button
                          className="btn btn-sm btn-warning rounded-3 px-3 font-weight-bold"
                          disabled={claimingId === c.id}
                          onClick={() => handleClaimChallenge(c.id)}
                        >
                          {claimingId === c.id ? 'Claiming...' : 'Claim Points'}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="col-lg-5">
          <div className="p-4 bg-dark border border-secondary rounded-4 text-white h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="mb-0 font-weight-bold">📜 Points Activity</h5>
                <span className="small text-secondary">Recent ledger transactions</span>
              </div>
              <Link to="/history" className="btn btn-sm btn-outline-secondary rounded-3">
                Full History
              </Link>
            </div>

            <div className="d-flex flex-column gap-2">
              {transactions.length === 0 ? (
                <div className="text-center py-4 text-secondary">No transactions logged yet.</div>
              ) : (
                transactions.map(t => (
                  <div key={t._id} className="p-2 border-bottom border-secondary d-flex justify-content-between align-items-center">
                    <div>
                      <span className="small font-weight-bold text-white d-block">{t.description}</span>
                      <span className="small text-secondary">
                        <Clock size={12} className="me-1" />
                        {new Date(t.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <span className={`font-weight-bold ${t.amount > 0 ? 'text-success' : 'text-danger'}`}>
                      {t.amount > 0 ? `+${t.amount}` : t.amount} VE
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Rewards Store Preview */}
      <div className="p-4 bg-dark border border-secondary rounded-4 text-white">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="mb-0 font-weight-bold">🎁 Featured Rewards Store</h4>
            <span className="small text-secondary">Redeem physical products & digital gift cards using your VE Points</span>
          </div>
          <Link to="/store" className="btn btn-indigo rounded-3 px-3">
            View Full Store <ArrowRight size={16} />
          </Link>
        </div>

        <div className="row g-4">
          {featuredRewards.map(item => (
            <div key={item._id} className="col-xl-3 col-lg-4 col-md-6">
              <div className="card h-100 bg-dark-subtle border-secondary text-white rounded-3 overflow-hidden shadow-sm">
                <div className="position-relative" style={{ height: '180px', overflow: 'hidden', background: '#1e293b' }}>
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-100 h-100 object-fit-cover"
                  />
                  <span className="position-absolute top-0 end-0 m-2 badge bg-warning text-dark font-weight-bold px-2 py-1 rounded">
                    <Coins size={12} className="me-1" />
                    {item.pointsRequired?.toLocaleString()} Pts
                  </span>
                </div>

                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <span className="badge bg-secondary text-light small mb-1">{item.category}</span>
                    <h6 className="card-title font-weight-bold text-white mb-2">{item.title}</h6>
                    <p className="card-text small text-secondary line-clamp-2">{item.description}</p>
                  </div>

                  <div className="mt-3">
                    <button
                      className="btn btn-primary w-100 rounded-3 font-weight-bold"
                      onClick={() => {
                        setRedeemingReward(item);
                        setRedeemError('');
                        setRedeemSuccess(null);
                      }}
                    >
                      Redeem Reward
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Redeem Modal */}
      {redeemingReward && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark border border-secondary text-white rounded-4">
              <div className="modal-header border-secondary">
                <h5 className="modal-title font-weight-bold">Redeem {redeemingReward.title}</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setRedeemingReward(null)}
                />
              </div>

              <div className="modal-body">
                {redeemSuccess ? (
                  <div className="text-center py-3">
                    <div className="p-3 bg-success bg-opacity-20 rounded-circle d-inline-block text-success mb-3">
                      <CheckCircle size={48} />
                    </div>
                    <h4 className="font-weight-bold text-white mb-2">Redemption Successful!</h4>
                    <p className="text-secondary small mb-3">
                      You spent <strong>{redeemingReward.pointsRequired} VE Points</strong>. Your updated balance is{' '}
                      <span className="text-warning font-weight-bold">{redeemSuccess.newBalance} VE Points</span>.
                    </p>

                    {redeemingReward.itemType === 'DIGITAL' && redeemSuccess.redemption?.digitalCode && (
                      <div className="p-3 bg-dark-subtle border border-warning rounded-3 mb-3">
                        <span className="small text-secondary d-block">Digital Code:</span>
                        <code className="h5 text-warning font-weight-bold">{redeemSuccess.redemption.digitalCode}</code>
                      </div>
                    )}

                    <button
                      className="btn btn-secondary rounded-3 px-4"
                      onClick={() => setRedeemingReward(null)}
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleExecuteRedeem}>
                    <div className="d-flex align-items-center gap-3 p-3 bg-dark-subtle rounded-3 mb-3 border border-secondary">
                      <img src={redeemingReward.imageUrl} alt={redeemingReward.title} style={{ width: '60px', height: '60px', objectFit: 'cover' }} className="rounded" />
                      <div>
                        <h6 className="mb-1 text-white">{redeemingReward.title}</h6>
                        <span className="text-warning font-weight-bold small">
                          <Coins size={14} className="me-1" />
                          {redeemingReward.pointsRequired?.toLocaleString()} VE Points
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <span className="small text-secondary d-block">Your Current Balance:</span>
                      <span className="h6 text-white font-weight-bold">{user?.pointsBalance?.toLocaleString()} VE Points</span>
                      {user?.pointsBalance < redeemingReward.pointsRequired && (
                        <div className="text-danger small mt-1">
                          <AlertCircle size={14} className="me-1" />
                          Insufficient points. You need {redeemingReward.pointsRequired - user.pointsBalance} more points.
                        </div>
                      )}
                    </div>

                    {redeemingReward.itemType === 'PHYSICAL' && (
                      <div className="mb-3">
                        <label className="form-label small text-secondary">Shipping Address</label>
                        <textarea
                          className="form-control bg-dark border-secondary text-white"
                          rows="3"
                          placeholder="Enter your street address, city, country..."
                          value={shippingAddress}
                          onChange={(e) => setShippingAddress(e.target.value)}
                          required
                        />
                      </div>
                    )}

                    {redeemError && (
                      <div className="alert alert-danger small p-2 rounded mb-3">{redeemError}</div>
                    )}

                    <div className="d-flex justify-content-end gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-secondary rounded-3"
                        onClick={() => setRedeemingReward(null)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-warning font-weight-bold rounded-3 px-4"
                        disabled={user?.pointsBalance < redeemingReward.pointsRequired}
                      >
                        Confirm Redemption
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
