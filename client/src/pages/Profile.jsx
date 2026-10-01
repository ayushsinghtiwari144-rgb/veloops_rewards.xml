import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfileApi } from '../services/hubService';
import { User as UserIcon, Coins, Zap, Shield, CheckCircle, Save } from 'lucide-react';

export const Profile = () => {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await updateProfileApi({ name, avatarUrl });
      setMessage('Profile updated successfully!');
      await refreshUser();
    } catch (err) {
      setMessage(`Error: ${err.message || 'Failed to update profile'}`);
    } finally {
      setSaving(false);
    }
  };

  const xpProgress = user ? Math.min(100, Math.floor((user.xp / (user.level * 500)) * 100)) : 0;

  return (
    <div className="container py-4">
      <div className="row g-4">
        {/* User Card */}
        <div className="col-lg-4">
          <div className="p-4 bg-dark border border-secondary rounded-4 text-white text-center">
            <div className="avatar-circle mx-auto bg-indigo text-white font-weight-bold display-6 d-flex align-items-center justify-content-center rounded-circle mb-3 shadow-lg" style={{ width: '90px', height: '90px' }}>
              {user?.name?.substring(0, 2).toUpperCase()}
            </div>
            <h4 className="font-weight-bold text-white mb-1">{user?.name}</h4>
            <p className="text-secondary small mb-3">{user?.email}</p>

            <span className="badge bg-warning text-dark font-weight-bold px-3 py-1.5 rounded-pill mb-3">
              Role: {user?.role}
            </span>

            <hr className="border-secondary my-3" />

            <div className="d-flex justify-content-around text-center">
              <div>
                <span className="small text-secondary d-block">Points</span>
                <span className="h5 font-weight-bold text-warning">{user?.pointsBalance?.toLocaleString()}</span>
              </div>
              <div>
                <span className="small text-secondary d-block">Level</span>
                <span className="h5 font-weight-bold text-indigo">Lvl {user?.level}</span>
              </div>
              <div>
                <span className="small text-secondary d-block">Streak</span>
                <span className="h5 font-weight-bold text-danger">{user?.streakDays}d</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Settings Form */}
        <div className="col-lg-8">
          <div className="p-4 bg-dark border border-secondary rounded-4 text-white">
            <h4 className="font-weight-bold mb-3">Account Settings</h4>

            {message && (
              <div className="alert alert-info rounded-3 mb-3">{message}</div>
            )}

            <form onSubmit={handleUpdate}>
              <div className="mb-3">
                <label className="form-label text-secondary small">Display Name</label>
                <input
                  type="text"
                  className="form-control bg-dark-subtle border-secondary text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary small">Email Address</label>
                <input
                  type="email"
                  className="form-control bg-dark-subtle border-secondary text-secondary"
                  value={user?.email || ''}
                  disabled
                />
                <span className="small text-secondary">Email address cannot be modified.</span>
              </div>

              <div className="mb-4">
                <label className="form-label text-secondary small">Level Progress</label>
                <div className="d-flex justify-content-between small text-secondary mb-1">
                  <span>Current XP</span>
                  <span>{user?.xp} / {(user?.level || 1) * 500} XP</span>
                </div>
                <div className="progress bg-dark-subtle rounded-pill" style={{ height: '10px' }}>
                  <div className="progress-bar bg-indigo rounded-pill" style={{ width: `${xpProgress}%` }} />
                </div>
              </div>

              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-primary font-weight-bold rounded-3 px-4" disabled={saving}>
                  <Save size={16} className="me-1" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
