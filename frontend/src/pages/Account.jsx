import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Coins, LogOut, CheckCircle2 } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const Account = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="container py-5 d-flex justify-content-center">
      <div style={{ maxWidth: '580px', width: '100%' }}>
        <Card>
          <div className="text-center mb-4">
            <div className="p-3 rounded-circle bg-primary bg-opacity-10 text-primary d-inline-flex mb-2">
              <User size={40} />
            </div>
            <h3 className="fw-bold">{user?.name || 'Member Account'}</h3>
            <span className="badge bg-success bg-opacity-10 text-success font-monospace px-3 py-1">
              <CheckCircle2 size={12} className="me-1 inline-block" /> Status: {user?.status || 'ACTIVE'}
            </span>
          </div>

          <div className="list-group list-group-flush mb-4 rounded-3 border">
            <div className="list-group-item d-flex align-items-center justify-content-between py-3">
              <span className="text-muted small d-flex align-items-center gap-2">
                <Mail size={18} className="text-primary" /> Email Address
              </span>
              <span className="fw-semibold text-dark">{user?.email}</span>
            </div>

            <div className="list-group-item d-flex align-items-center justify-content-between py-3">
              <span className="text-muted small d-flex align-items-center gap-2">
                <Shield size={18} className="text-indigo" /> Role Permission
              </span>
              <span className="badge bg-primary px-3 py-2 font-monospace">{user?.role}</span>
            </div>

            <div className="list-group-item d-flex align-items-center justify-content-between py-3">
              <span className="text-muted small d-flex align-items-center gap-2">
                <Coins size={18} className="text-warning" /> VELOOP Points Balance
              </span>
              <span className="fw-bold text-success fs-5">{user?.pointsBalance ?? 500} PTS</span>
            </div>
          </div>

          <Button
            variant="outline-danger"
            className="w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
            onClick={handleLogout}
          >
            <LogOut size={18} /> Sign Out of Account
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Account;
