import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const Register = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // If already authenticated, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/account', { replace: true });
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
      navigate('/account', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center">
      <div style={{ maxWidth: '480px', width: '100%' }}>
        <Card>
          <div className="text-center mb-4">
            <div className="p-3 rounded-circle bg-primary bg-opacity-10 text-primary d-inline-flex mb-2">
              <UserPlus size={32} />
            </div>
            <h3 className="fw-bold">Create Free Account</h3>
            <p className="text-muted small">Join VELOOP Rewards to participate in giveaways</p>
          </div>

          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 small mb-4" role="alert">
              <AlertCircle size={18} className="flex-shrink-0" />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label font-semibold small">Full Name</label>
              <input
                type="text"
                className="form-control py-2"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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

            <div className="mb-3">
              <label className="form-label font-semibold small">Password (Min 6 characters)</label>
              <input
                type="password"
                className="form-control py-2"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label font-semibold small">Confirm Password</label>
              <input
                type="password"
                className="form-control py-2"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <hr className="my-4" />

          <div className="text-center small text-muted">
            Already have an account?{' '}
            <Link to="/login" className="fw-semibold text-primary">
              Sign In Here
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;
