import React, { useState, useEffect } from 'react';
import { getAchievementsApi } from '../services/hubService';
import { Award, Lock, CheckCircle2, Gift, Zap, Trophy, ShoppingBag } from 'lucide-react';

export const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAchievements = async () => {
    setLoading(true);
    try {
      const data = await getAchievementsApi();
      setAchievements(data);
    } catch (err) {
      console.error('Failed to load achievements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAchievements();
  }, []);

  const getAchievementIcon = (iconName, unlocked) => {
    const colorClass = unlocked ? 'text-primary' : 'text-muted';
    switch (iconName) {
      case 'Gift': return <Gift size={28} className={colorClass} />;
      case 'Zap': return <Zap size={28} className={colorClass} />;
      case 'Trophy': return <Trophy size={28} className={colorClass} />;
      case 'ShoppingBag': return <ShoppingBag size={28} className={colorClass} />;
      default: return <Award size={28} className={colorClass} />;
    }
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <span className="badge badge-gold mb-2">Milestone System</span>
          <h2 className="section-title h1 mb-1">🏅 Platform Achievements</h2>
          <p className="text-muted mb-0">Unlock milestone badges across store redemptions, login streaks, and challenges</p>
        </div>

        <div className="p-3 bg-white border rounded-3 shadow-sm">
          <span className="small text-muted d-block font-weight-medium">Achievements Unlocked</span>
          <span className="h5 text-primary font-weight-bold mb-0">
            {unlockedCount} / {achievements.length} Badges
          </span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5 text-muted">Loading achievements...</div>
      ) : (
        <div className="row g-4">
          {achievements.map(ach => (
            <div key={ach.id} className="col-lg-6">
              <div className={`card-saas p-4 h-100 d-flex flex-column justify-content-between ${ach.unlocked ? 'border-primary' : 'opacity-75'}`}>
                <div>
                  <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className={`p-3 rounded-3 border ${ach.unlocked ? 'bg-primary-light border-primary' : 'bg-light'}`}>
                        {getAchievementIcon(ach.icon, ach.unlocked)}
                      </div>
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <h5 className="font-weight-bold text-dark mb-0">{ach.title}</h5>
                          {ach.unlocked ? (
                            <span className="badge bg-success-subtle text-success small">
                              <CheckCircle2 size={12} className="me-1" /> Unlocked
                            </span>
                          ) : (
                            <span className="badge bg-light text-muted border small">
                              <Lock size={12} className="me-1" /> Locked
                            </span>
                          )}
                        </div>
                        <p className="small text-muted mb-0">{ach.description}</p>
                      </div>
                    </div>

                    <span className="badge badge-gold font-weight-bold px-2.5 py-1.5 rounded">
                      +{ach.pointsReward} VE Pts
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-top">
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>Progress</span>
                    <span>{ach.progress} / {ach.requirementValue}</span>
                  </div>
                  <div className="progress bg-light border rounded-pill" style={{ height: '8px' }}>
                    <div
                      className={`progress-bar rounded-pill ${ach.unlocked ? 'bg-primary' : 'bg-secondary'}`}
                      style={{ width: `${Math.min(100, (ach.progress / ach.requirementValue) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Achievements;
