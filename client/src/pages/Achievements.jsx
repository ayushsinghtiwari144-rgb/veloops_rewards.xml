import React, { useState, useEffect } from 'react';
import { getAchievementsApi } from '../services/hubService';
import { Award, Lock, CheckCircle, Gift, Zap, Trophy, ShoppingBag } from 'lucide-react';

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
    const colorClass = unlocked ? 'text-warning' : 'text-secondary';
    switch (iconName) {
      case 'Gift': return <Gift size={32} className={colorClass} />;
      case 'Zap': return <Zap size={32} className={colorClass} />;
      case 'Trophy': return <Trophy size={32} className={colorClass} />;
      case 'ShoppingBag': return <ShoppingBag size={32} className={colorClass} />;
      default: return <Award size={32} className={colorClass} />;
    }
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="display-6 text-white font-weight-bold mb-1">🏅 Platform Achievements</h2>
          <p className="text-secondary mb-0">Unlock milestone badges across store redemptions, login streaks, and challenges</p>
        </div>

        <div className="p-3 bg-dark border border-warning rounded-3 text-white">
          <span className="small text-secondary d-block">Achievements Unlocked</span>
          <span className="h5 text-warning font-weight-bold mb-0">
            {unlockedCount} / {achievements.length} Badges
          </span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5 text-secondary">Loading achievements...</div>
      ) : (
        <div className="row g-4">
          {achievements.map(ach => (
            <div key={ach.id} className="col-lg-6">
              <div className={`p-4 rounded-4 border h-100 d-flex flex-column justify-content-between ${ach.unlocked ? 'bg-dark border-warning shadow-sm' : 'bg-dark-subtle border-secondary opacity-75'}`}>
                <div>
                  <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className={`p-3 rounded-3 border ${ach.unlocked ? 'bg-warning bg-opacity-10 border-warning' : 'bg-dark border-secondary'}`}>
                        {getAchievementIcon(ach.icon, ach.unlocked)}
                      </div>
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <h5 className="font-weight-bold text-white mb-0">{ach.title}</h5>
                          {ach.unlocked ? (
                            <span className="badge bg-success-subtle text-success small">
                              <CheckCircle size={12} className="me-1" /> Unlocked
                            </span>
                          ) : (
                            <span className="badge bg-secondary small">
                              <Lock size={12} className="me-1" /> Locked
                            </span>
                          )}
                        </div>
                        <p className="small text-secondary mb-0">{ach.description}</p>
                      </div>
                    </div>

                    <span className="badge bg-warning text-dark font-weight-bold px-2.5 py-1.5 rounded">
                      +{ach.pointsReward} VE Pts
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="d-flex justify-content-between small text-secondary mb-1">
                    <span>Progress</span>
                    <span>{ach.progress} / {ach.requirementValue}</span>
                  </div>
                  <div className="progress bg-dark border border-secondary rounded-pill" style={{ height: '8px' }}>
                    <div
                      className={`progress-bar rounded-pill ${ach.unlocked ? 'bg-warning' : 'bg-indigo'}`}
                      style={{ width: `${Math.min(100, (ach.progress / ach.requirementValue) * 100)}%` }}
                    />
                  </div>

                  {ach.unlockedAt && (
                    <span className="small text-success d-block mt-2">
                      Unlocked on {new Date(ach.unlockedAt).toLocaleDateString()}
                    </span>
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
