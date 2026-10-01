import React, { useState, useEffect } from 'react';
import { getLeaderboardApi } from '../services/hubService';
import { Trophy, Award, Coins, Zap, Shield } from 'lucide-react';

export const Leaderboard = () => {
  const [period, setPeriod] = useState('weekly');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const data = await getLeaderboardApi(period);
      setLeaderboardData(data.leaderboard || []);
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, [period]);

  const top3 = leaderboardData.slice(0, 3);
  const restList = leaderboardData.slice(3);

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="display-6 text-white font-weight-bold mb-1">🏆 Community Leaderboard</h2>
          <p className="text-secondary mb-0">Top VELOOP Rewards Hub members ranked by VE Points and level achievements</p>
        </div>

        <div className="d-flex align-items-center gap-2 bg-dark p-1 rounded-3 border border-secondary">
          <button
            className={`btn btn-sm px-3 rounded-2 ${period === 'weekly' ? 'btn-primary' : 'text-secondary'}`}
            onClick={() => setPeriod('weekly')}
          >
            Weekly
          </button>
          <button
            className={`btn btn-sm px-3 rounded-2 ${period === 'monthly' ? 'btn-primary' : 'text-secondary'}`}
            onClick={() => setPeriod('monthly')}
          >
            Monthly
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5 text-secondary">Loading leaderboard rankings...</div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {top3.length > 0 && (
            <div className="row g-4 justify-content-center mb-5 align-items-end">
              {/* Rank 2 - Silver */}
              {top3[1] && (
                <div className="col-md-4 col-12 order-2 order-md-1">
                  <div className="p-4 bg-dark border border-secondary rounded-4 text-center position-relative">
                    <span className="badge bg-secondary position-absolute top-0 start-50 translate-middle px-3 py-1 rounded-pill">
                      🥈 2nd Place
                    </span>
                    <div className="mt-2 mb-3">
                      <div className="avatar-circle mx-auto bg-secondary text-white font-weight-bold h3 d-flex align-items-center justify-content-center rounded-circle" style={{ width: '70px', height: '70px' }}>
                        {top3[1].name.substring(0, 2)}
                      </div>
                    </div>
                    <h5 className="font-weight-bold text-white mb-1">{top3[1].name}</h5>
                    <span className="badge bg-indigo-subtle text-indigo mb-2">Lvl {top3[1].level}</span>
                    <h4 className="text-warning font-weight-bold mb-0">
                      <Coins size={18} className="me-1" />
                      {top3[1].points?.toLocaleString()} VE
                    </h4>
                  </div>
                </div>
              )}

              {/* Rank 1 - Gold */}
              {top3[0] && (
                <div className="col-md-4 col-12 order-1 order-md-2">
                  <div className="p-4 bg-dark border border-warning rounded-4 text-center position-relative shadow-lg" style={{ transform: 'scale(1.05)', background: 'linear-gradient(180deg, #1e1b4b 0%, #0f172a 100%)' }}>
                    <span className="badge bg-warning text-dark position-absolute top-0 start-50 translate-middle px-3 py-1 rounded-pill font-weight-bold">
                      🥇 1st Champion
                    </span>
                    <div className="mt-2 mb-3">
                      <div className="avatar-circle mx-auto bg-warning text-dark font-weight-bold h2 d-flex align-items-center justify-content-center rounded-circle shadow-lg" style={{ width: '85px', height: '85px' }}>
                        {top3[0].name.substring(0, 2)}
                      </div>
                    </div>
                    <h4 className="font-weight-bold text-white mb-1">{top3[0].name}</h4>
                    <span className="badge bg-warning text-dark font-weight-bold mb-2">Lvl {top3[0].level} Legend</span>
                    <h3 className="text-warning font-weight-bold mb-0">
                      <Coins size={22} className="me-1" />
                      {top3[0].points?.toLocaleString()} VE
                    </h3>
                  </div>
                </div>
              )}

              {/* Rank 3 - Bronze */}
              {top3[2] && (
                <div className="col-md-4 col-12 order-3">
                  <div className="p-4 bg-dark border border-secondary rounded-4 text-center position-relative">
                    <span className="badge bg-danger position-absolute top-0 start-50 translate-middle px-3 py-1 rounded-pill">
                      🥉 3rd Place
                    </span>
                    <div className="mt-2 mb-3">
                      <div className="avatar-circle mx-auto bg-danger text-white font-weight-bold h3 d-flex align-items-center justify-content-center rounded-circle" style={{ width: '70px', height: '70px' }}>
                        {top3[2].name.substring(0, 2)}
                      </div>
                    </div>
                    <h5 className="font-weight-bold text-white mb-1">{top3[2].name}</h5>
                    <span className="badge bg-indigo-subtle text-indigo mb-2">Lvl {top3[2].level}</span>
                    <h4 className="text-warning font-weight-bold mb-0">
                      <Coins size={18} className="me-1" />
                      {top3[2].points?.toLocaleString()} VE
                    </h4>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Table Ranks 4-50 */}
          <div className="p-4 bg-dark border border-secondary rounded-4 text-white">
            <div className="d-flex align-items-center gap-2 mb-3 text-secondary small">
              <Shield size={16} className="text-success" />
              <span>User identities are anonymized for privacy compliance.</span>
            </div>

            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle mb-0">
                <thead>
                  <tr className="text-secondary small border-secondary">
                    <th style={{ width: '80px' }}>Rank</th>
                    <th>Member</th>
                    <th>Level</th>
                    <th className="text-end">VE Points</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-secondary">
                        No members ranked on the leaderboard yet.
                      </td>
                    </tr>
                  ) : (
                    leaderboardData.map(item => (
                      <tr key={item.id} className="border-secondary">
                        <td className="font-weight-bold text-warning">#{item.rank}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center font-weight-bold small" style={{ width: '32px', height: '32px' }}>
                              {item.name.substring(0, 2)}
                            </div>
                            <span className="font-weight-medium text-white">{item.name}</span>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-dark-subtle border border-secondary text-indigo">
                            Lvl {item.level}
                          </span>
                        </td>
                        <td className="text-end font-weight-bold text-warning">
                          {item.points?.toLocaleString()} VE
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
