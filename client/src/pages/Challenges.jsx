import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getChallengesApi, claimChallengeApi } from '../services/hubService';
import { Zap, CheckCircle, Clock, Sparkles, Award, Gift, Sun, Users, UserCheck } from 'lucide-react';

export const Challenges = () => {
  const { user, refreshUser } = useAuth();
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
      default: return <Zap size={24} className="text-indigo" />;
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="display-6 text-white font-weight-bold mb-1">⚡ Daily & Weekly Challenges</h2>
          <p className="text-secondary mb-0">Complete platform activities every 24 hours to earn VE Points and XP bonuses</p>
        </div>

        <div className="d-flex align-items-center gap-2 bg-dark p-2 rounded-3 border border-secondary text-secondary small">
          <Clock size={16} />
          <span>Resets every midnight (UTC)</span>
        </div>
      </div>

      {message && (
        <div className="alert alert-info alert-dismissible fade show rounded-3 mb-4" role="alert">
          {message}
          <button type="button" className="btn-close" onClick={() => setMessage('')} />
        </div>
      )}

      {/* Tabs */}
      <div className="d-flex gap-2 mb-4">
        <button
          className={`btn ${activeTab === 'ALL' ? 'btn-indigo' : 'btn-outline-secondary text-white'}`}
          onClick={() => setActiveTab('ALL')}
        >
          All Challenges
        </button>
        <button
          className={`btn ${activeTab === 'DAILY' ? 'btn-indigo' : 'btn-outline-secondary text-white'}`}
          onClick={() => setActiveTab('DAILY')}
        >
          Daily ({challenges.filter(c => c.category === 'DAILY').length})
        </button>
        <button
          className={`btn ${activeTab === 'WEEKLY' ? 'btn-indigo' : 'btn-outline-secondary text-white'}`}
          onClick={() => setActiveTab('WEEKLY')}
        >
          Weekly ({challenges.filter(c => c.category === 'WEEKLY').length})
        </button>
      </div>

      {/* Challenges List */}
      {loading ? (
        <div className="text-center py-5 text-secondary">Loading challenges...</div>
      ) : (
        <div className="row g-3">
          {filteredChallenges.map(c => (
            <div key={c.id} className="col-lg-6">
              <div className="p-4 bg-dark border border-secondary rounded-4 text-white h-100 d-flex flex-column justify-content-between">
                <div className="d-flex align-items-start gap-3 mb-3">
                  <div className="p-3 bg-dark-subtle border border-secondary rounded-3">
                    {getChallengeIcon(c.icon)}
                  </div>

                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="badge bg-secondary text-light small">{c.category}</span>
                      <span className="badge bg-warning text-dark font-weight-bold">
                        +{c.pointsReward} VE Pts
                      </span>
                    </div>
                    <h5 className="font-weight-bold text-white mb-1">{c.title}</h5>
                    <p className="small text-secondary mb-0">{c.description}</p>
                  </div>
                </div>

                <div>
                  <div className="d-flex justify-content-between small text-secondary mb-1">
                    <span>Progress</span>
                    <span>{c.progress} / {c.targetCount}</span>
                  </div>
                  <div className="progress bg-dark-subtle rounded-pill mb-3" style={{ height: '8px' }}>
                    <div
                      className="progress-bar bg-success rounded-pill"
                      style={{ width: `${Math.min(100, (c.progress / c.targetCount) * 100)}%` }}
                    />
                  </div>

                  {c.claimed ? (
                    <button className="btn btn-outline-success w-100 rounded-3 disabled" disabled>
                      <CheckCircle size={16} className="me-1" /> Claimed Today
                    </button>
                  ) : (
                    <button
                      className="btn btn-warning w-100 font-weight-bold rounded-3"
                      disabled={claimingId === c.id}
                      onClick={() => handleClaim(c.id)}
                    >
                      {claimingId === c.id ? 'Claiming...' : `Claim +${c.pointsReward} VE Points`}
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
