import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getChallengesApi, claimChallengeApi } from '../services/hubService';
import { Zap, CheckCircle2, Clock, Gift, Sun, Users, UserCheck } from 'lucide-react';

export const Challenges = () => {
  const { refreshUser } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [claimingId, setClaimingId] = useState(null);
  const [message, setMessage] = useState('');

  const loadChallenges = async () => {
    setLoading(true);
    try {
      const data = await getChallengesApi();
      setChallenges(data);
    } catch (err) {
      console.error('Failed to load challenges:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChallenges();
  }, []);

  const handleClaim = async (id) => {
    setClaimingId(id);
    setMessage('');
    try {
      const result = await claimChallengeApi(id);
      setMessage(`🎉 Successfully claimed +${result.pointsAwarded} VE Points for '${result.title}'!`);
      await refreshUser();
      await loadChallenges();
    } catch (err) {
      setMessage(`❌ ${err.message || 'Failed to claim challenge'}`);
    } finally {
      setClaimingId(null);
    }
  };

  const filteredChallenges = challenges.filter(c => {
    if (activeTab === 'DAILY') return c.category === 'DAILY';
    if (activeTab === 'WEEKLY') return c.category === 'WEEKLY';
    return true;
  });

  const getChallengeIcon = (iconName) => {
    switch (iconName) {
      case 'Sun': return <Sun size={24} className="text-warning" />;
      case 'UserCheck': return <UserCheck size={24} className="text-info" />;
      case 'Users': return <Users size={24} className="text-success" />;
      case 'Gift': return <Gift size={24} className="text-danger" />;
      default: return <Zap size={24} className="text-primary" />;
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <span className="badge badge-indigo mb-2">Interactive Tasks</span>
          <h2 className="section-title h1 mb-1">⚡ Daily & Weekly Challenges</h2>
          <p className="text-muted mb-0">Complete platform activities every 24 hours to earn VE Points and XP bonuses</p>
        </div>

        <div className="d-flex align-items-center gap-2 bg-white p-2 px-3 rounded-3 border text-muted small">
          <Clock size={16} />
          <span>Resets daily at 00:00 UTC</span>
        </div>
      </div>

      {message && (
        <div className="alert alert-info alert-dismissible fade show rounded-3 mb-4 shadow-sm" role="alert">
          {message}
          <button type="button" className="btn-close" onClick={() => setMessage('')} />
        </div>
      )}

      {/* Tabs */}
      <div className="d-flex gap-2 mb-4">
        <button
          type="button"
          className={`btn btn-sm rounded-pill px-4 font-weight-medium ${activeTab === 'ALL' ? 'btn-indigo' : 'btn-outline-secondary'}`}
          onClick={() => setActiveTab('ALL')}
        >
          All Challenges
        </button>
        <button
          type="button"
          className={`btn btn-sm rounded-pill px-4 font-weight-medium ${activeTab === 'DAILY' ? 'btn-indigo' : 'btn-outline-secondary'}`}
          onClick={() => setActiveTab('DAILY')}
        >
          Daily ({challenges.filter(c => c.category === 'DAILY').length})
        </button>
        <button
          type="button"
          className={`btn btn-sm rounded-pill px-4 font-weight-medium ${activeTab === 'WEEKLY' ? 'btn-indigo' : 'btn-outline-secondary'}`}
          onClick={() => setActiveTab('WEEKLY')}
        >
          Weekly ({challenges.filter(c => c.category === 'WEEKLY').length})
        </button>
      </div>

      {/* Challenge Grid */}
      {loading ? (
        <div className="text-center py-5 text-muted">Loading challenges...</div>
      ) : filteredChallenges.length === 0 ? (
        <div className="text-center py-5 text-muted card-saas">
          <Zap size={48} className="mb-2 opacity-50 text-indigo" />
          <h5 className="font-weight-bold text-dark">No challenges found in this view</h5>
          <p className="small mb-0">Check back later for newly published daily tasks.</p>
        </div>
      ) : (
        <div className="row g-4">
          {filteredChallenges.map(c => (
            <div key={c.id} className="col-md-6 col-lg-4">
              <div className="card-saas p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="p-2 rounded-3 bg-primary-light">
                      {getChallengeIcon(c.icon)}
                    </div>
                    <span className="badge badge-gold font-weight-bold">
                      +{c.pointsReward} VE Pts
                    </span>
                  </div>

                  <span className="badge badge-indigo small mb-2">{c.category}</span>
                  <h5 className="font-weight-bold text-dark mb-2">{c.title}</h5>
                  <p className="small text-muted mb-4">{c.description}</p>
                </div>

                <div>
                  {c.claimed ? (
                    <div className="alert alert-success py-2 px-3 mb-0 text-center small font-weight-bold rounded-3">
                      <CheckCircle2 size={16} className="me-1" /> Claimed
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-indigo w-100 font-weight-bold"
                      disabled={claimingId === c.id}
                      onClick={() => handleClaim(c.id)}
                    >
                      {claimingId === c.id ? 'Claiming...' : 'Claim Points'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Challenges;
