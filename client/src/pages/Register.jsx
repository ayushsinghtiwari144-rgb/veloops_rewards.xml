import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, AlertCircle, Sparkles, Coins } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Register = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      await register({ name, email, password });
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div style={{ maxWidth: '480px', width: '100%' }}>
        <div className="p-4 p-md-5 bg-dark border border-secondary text-white rounded-4 shadow-lg">
          <div className="text-center mb-4">
            <div className="p-3 rounded-circle bg-indigo bg-opacity-20 text-indigo d-inline-flex mb-2">
              <UserPlus size={32} />
            </div>
            <h3 className="fw-bold">Create Free Account</h3>
            <p className="text-secondary small mb-2">Join VELOOP Rewards Hub platform</p>
            <span className="badge bg-warning text-dark font-weight-bold px-3 py-1.5 rounded-pill">
              <Coins size={14} className="me-1" /> Get +500 VE Starter Points
            </span>
          </div>

          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 small mb-4" role="alert">
              <AlertCircle size={18} className="flex-shrink-0" />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-secondary small">Full Name</label>
              <input
                type="text"
                className="form-control bg-dark-subtle border-secondary text-white py-2"
                placeholder="Ayush Tiwari"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-secondary small">Email Address</label>
              <input
                type="email"
                className="form-control bg-dark-subtle border-secondary text-white py-2"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-secondary small">Password (Min 6 characters)</label>
              <input
                type="password"
                className="form-control bg-dark-subtle border-secondary text-white py-2"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label text-secondary small">Confirm Password</label>
              <input
                type="password"
                className="form-control bg-dark-subtle border-secondary text-white py-2"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-indigo w-100 py-2.5 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account & Claim +500 VE'}
            </button>
          </form>

          <hr className="border-secondary my-4" />

          <div className="text-center small text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="fw-semibold text-indigo">
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
