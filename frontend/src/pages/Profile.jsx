import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfileApi } from '../services/hubService';
import { Save } from 'lucide-react';

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

  const xpProgress = user ? Math.min(100, Math.floor(((user.xp || 0) / ((user.level || 1) * 500)) * 100)) : 0;

  return (
    <div className="container py-5">
      <div className="row g-4">
        {/* User Card */}
        <div className="col-lg-4">
          <div className="card-saas p-4 text-center">
            <div className="avatar-circle mx-auto bg-primary text-white font-weight-bold display-6 d-flex align-items-center justify-content-center rounded-circle mb-3 shadow-md" style={{ width: '90px', height: '90px' }}>
              {user?.name?.substring(0, 2)?.toUpperCase() || 'U'}
            </div>
            <h4 className="font-weight-bold text-dark mb-1">{user?.name || 'User'}</h4>
            <p className="text-muted small mb-3">{user?.email || ''}</p>

            <span className="badge badge-gold px-3 py-1.5 rounded-pill mb-3">
              Role: {user?.role || 'USER'}
            </span>

            <hr className="my-3 border-light" />

            <div className="d-flex justify-content-around text-center">
              <div>
                <span className="small text-muted d-block font-weight-medium">Points</span>
                <span className="h5 font-weight-bold text-primary">{(user?.pointsBalance ?? 0).toLocaleString()}</span>
              </div>
              <div>
                <span className="small text-muted d-block font-weight-medium">Level</span>
                <span className="h5 font-weight-bold text-indigo">Lvl {user?.level || 1}</span>
              </div>
              <div>
                <span className="small text-muted d-block font-weight-medium">Streak</span>
                <span className="h5 font-weight-bold text-danger">{user?.streakDays || 0}d</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Settings Form */}
        <div className="col-lg-8">
          <div className="card-saas p-4 p-md-5">
            <h4 className="font-weight-bold text-dark mb-3">Account Settings</h4>

            {message && (
              <div className="alert alert-info rounded-3 mb-3">{message}</div>
            )}

            <form onSubmit={handleUpdate}>
              <div className="mb-3">
                <label className="form-label text-muted small font-weight-medium">Display Name</label>
                <input
                  type="text"
                  className="form-control border text-dark"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small font-weight-medium">Email Address</label>
                <input
                  type="email"
                  className="form-control bg-light border text-muted"
                  value={user?.email || ''}
                  disabled
                />
                <span className="small text-muted">Email address cannot be modified.</span>
              </div>

              <div className="mb-4">
                <label className="form-label text-muted small font-weight-medium">Level Progress</label>
                <div className="d-flex justify-content-between small text-muted mb-1">
                  <span>Current XP</span>
                  <span>{user?.xp || 0} / {(user?.level || 1) * 500} XP</span>
                </div>
                <div className="progress bg-light border rounded-pill" style={{ height: '10px' }}>
                  <div
                    className="progress-bar bg-primary rounded-pill"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-indigo font-weight-bold rounded-3 px-4 d-flex align-items-center gap-2"
                disabled={saving}
              >
                <Save size={18} />
                <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
