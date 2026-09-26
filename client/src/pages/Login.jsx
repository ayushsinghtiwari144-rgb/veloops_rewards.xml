import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname || '/account';

  // If already authenticated, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/account', { replace: true });
    }
  }, [isAuthenticated, navigate]);

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
    <div className="container py-5 d-flex justify-content-center">
      <div style={{ maxWidth: '440px', width: '100%' }}>
        <Card>
          <div className="text-center mb-4">
            <div className="p-3 rounded-circle bg-primary bg-opacity-10 text-primary d-inline-flex mb-2">
              <LogIn size={32} />
            </div>
            <h3 className="fw-bold">Member Sign In</h3>
            <p className="text-muted small">Sign in to manage your VELOOP Rewards account</p>
          </div>

          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 small mb-4" role="alert">
              <AlertCircle size={18} className="flex-shrink-0" />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label font-semibold small">Email Address</label>
              <input
                type="email"
                className="form-control py-2"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label font-semibold small">Password</label>
              <input
                type="password"
                className="form-control py-2"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
              disabled={loading}
            >
              {loading ? (
                'Logging in...'
              ) : (
                <>
                  <Lock size={18} /> Sign In
                </>
              )}
            </Button>
          </form>

          <hr className="my-4" />

          <div className="text-center small text-muted">
            Don't have an account yet?{' '}
            <Link to="/register" className="fw-semibold text-primary">
              Create Free Account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
