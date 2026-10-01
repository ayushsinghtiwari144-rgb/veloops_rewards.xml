import React, { useState, useEffect } from 'react';
import { getLeaderboardApi } from '../services/hubService';
import { Trophy, Coins } from 'lucide-react';

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

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <span className="badge badge-gold mb-2">Community Ranks</span>
          <h2 className="section-title h1 mb-1">🏆 Community Leaderboard</h2>
          <p className="text-muted mb-0">Top VELOOP Rewards Hub members ranked by VE Points and level achievements</p>
        </div>

        <div className="d-flex align-items-center gap-2 bg-white p-1 rounded-3 border">
          <button
            type="button"
            className={`btn btn-sm px-4 rounded-2 font-weight-bold ${period === 'weekly' ? 'btn-indigo' : 'text-muted border-0 bg-transparent'}`}
            onClick={() => setPeriod('weekly')}
          >
            Weekly
          </button>
          <button
            type="button"
            className={`btn btn-sm px-4 rounded-2 font-weight-bold ${period === 'monthly' ? 'btn-indigo' : 'text-muted border-0 bg-transparent'}`}
            onClick={() => setPeriod('monthly')}
          >
            Monthly
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5 text-muted">Loading leaderboard rankings...</div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {top3.length > 0 && (
            <div className="row g-4 justify-content-center mb-5 align-items-end">
              {/* Rank 2 - Silver */}
              {top3[1] && (
                <div className="col-md-4 col-12 order-2 order-md-1">
                  <div className="card-saas p-4 text-center position-relative">
                    <span className="badge bg-secondary text-white position-absolute top-0 start-50 translate-middle px-3 py-1 rounded-pill">
                      🥈 2nd Place
                    </span>
                    <div className="mt-2 mb-3">
                      <div className="avatar-circle mx-auto bg-light border text-primary font-weight-bold h3 d-flex align-items-center justify-content-center rounded-circle" style={{ width: '70px', height: '70px' }}>
                        {top3[1].name.substring(0, 2)}
                      </div>
                    </div>
                    <h5 className="font-weight-bold text-dark mb-1">{top3[1].name}</h5>
                    <span className="badge badge-indigo mb-2">Lvl {top3[1].level}</span>
                    <h4 className="text-primary font-weight-bold mb-0">
                      <Coins size={18} className="me-1 text-warning" />
                      {top3[1].points?.toLocaleString()} VE
                    </h4>
                  </div>
                </div>
              )}

              {/* Rank 1 - Gold */}
              {top3[0] && (
                <div className="col-md-4 col-12 order-1 order-md-2">
                  <div className="card-saas p-4 text-center position-relative shadow-lg border-primary" style={{ transform: 'scale(1.05)', background: 'linear-gradient(180deg, #ffffff 0%, #eef2ff 100%)' }}>
                    <span className="badge badge-gold position-absolute top-0 start-50 translate-middle px-3 py-1 rounded-pill font-weight-bold">
                      🥇 1st Champion
                    </span>
                    <div className="mt-2 mb-3">
                      <div className="avatar-circle mx-auto bg-primary text-white font-weight-bold h2 d-flex align-items-center justify-content-center rounded-circle shadow-md" style={{ width: '85px', height: '85px' }}>
                        {top3[0].name.substring(0, 2)}
                      </div>
                    </div>
                    <h4 className="font-weight-bold text-dark mb-1">{top3[0].name}</h4>
                    <span className="badge badge-gold font-weight-bold mb-2">Lvl {top3[0].level} Champion</span>
                    <h3 className="text-primary font-weight-bold mb-0">
                      <Coins size={22} className="me-1 text-warning" />
                      {top3[0].points?.toLocaleString()} VE
                    </h3>
                  </div>
                </div>
              )}

              {/* Rank 3 - Bronze */}
              {top3[2] && (
                <div className="col-md-4 col-12 order-3">
                  <div className="card-saas p-4 text-center position-relative">
                    <span className="badge bg-danger text-white position-absolute top-0 start-50 translate-middle px-3 py-1 rounded-pill">
                      🥉 3rd Place
                    </span>
                    <div className="mt-2 mb-3">
                      <div className="avatar-circle mx-auto bg-light border text-primary font-weight-bold h3 d-flex align-items-center justify-content-center rounded-circle" style={{ width: '70px', height: '70px' }}>
                        {top3[2].name.substring(0, 2)}
                      </div>
                    </div>
                    <h5 className="font-weight-bold text-dark mb-1">{top3[2].name}</h5>
                    <span className="badge badge-indigo mb-2">Lvl {top3[2].level}</span>
                    <h4 className="text-primary font-weight-bold mb-0">
                      <Coins size={18} className="me-1 text-warning" />
                      {top3[2].points?.toLocaleString()} VE
                    </h4>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Full Leaderboard Table */}
          <div className="card-saas overflow-hidden border">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="py-3 px-4 text-muted small text-uppercase font-weight-bold" style={{ width: '90px' }}>Rank</th>
                    <th className="py-3 px-4 text-muted small text-uppercase font-weight-bold">Member (Masked)</th>
                    <th className="py-3 px-4 text-muted small text-uppercase font-weight-bold text-end">Level</th>
                    <th className="py-3 px-4 text-muted small text-uppercase font-weight-bold text-end">VE Points</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((entry, idx) => (
                    <tr key={entry.userId || idx} className={entry.isCurrentUser ? 'bg-primary-light' : ''}>
                      <td className="py-3 px-4 font-weight-bold text-muted">
                        #{entry.rank || idx + 1}
                      </td>
                      <td className="py-3 px-4 font-weight-bold text-dark">
                        {entry.maskedName}
                        {entry.isCurrentUser && <span className="badge bg-primary ms-2">You</span>}
                      </td>
                      <td className="py-3 px-4 text-end">
                        <span className="badge badge-indigo">Lvl {entry.level}</span>
                      </td>
                      <td className="py-3 px-4 text-end font-weight-bold text-primary">
                        {entry.points?.toLocaleString()} VE
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Leaderboard;
