import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Lock, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '75vh' }}>
      <div style={{ maxWidth: '440px', width: '100%' }}>
        <div className="p-4 p-md-5 bg-dark border border-secondary text-white rounded-4 shadow-lg">
          <div className="text-center mb-4">
            <div className="p-3 rounded-circle bg-indigo bg-opacity-20 text-indigo d-inline-flex mb-2">
              <Sparkles size={32} />
            </div>
            <h3 className="fw-bold">Member Sign In</h3>
            <p className="text-secondary small">Access your VELOOP Rewards Hub points & rewards</p>
          </div>

          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 small mb-4" role="alert">
              <AlertCircle size={18} className="flex-shrink-0" />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
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

            <div className="mb-4">
              <label className="form-label text-secondary small">Password</label>
              <input
                type="password"
                className="form-control bg-dark-subtle border-secondary text-white py-2"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-indigo w-100 py-2.5 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2"
              disabled={loading}
            >
              {loading ? (
                'Signing In...'
              ) : (
                <>
                  <Lock size={18} /> Sign In
                </>
              )}
            </button>
          </form>

          <hr className="border-secondary my-4" />

          <div className="text-center small text-secondary">
            Don't have an account yet?{' '}
            <Link to="/register" className="fw-semibold text-indigo">
              Create Free Account (+500 VE Points)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
