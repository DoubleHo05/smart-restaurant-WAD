import React, { useState } from 'react';
import { useNavigate, useLocation, Link, Location } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authApi } from '../../api/authApi';
import './CustomerAuth.css';

const CustomerLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authApi.login(formData);
      login(response.access_token, response.user);

      // Redirect to restaurant list or previous page
      const from = (location.state as { from?: Location })?.from?.pathname || '/customer/restaurants';
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mobile-container customer-auth-container">
      {/* Logo Section */}
      <div className="auth-header">
        <div className="auth-logo">🍽️</div>
        <h1 className="auth-title">Smart Restaurant</h1>
        <p className="auth-subtitle">Scan. Order. Enjoy.</p>
      </div>

      {/* Login Form */}
      <div className="auth-form-container">
        <h2 className="form-title">Welcome Back</h2>

        {error && (
          <div className="error-message">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="forgot-password">
            <a href="#">Forgot Password?</a>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>

          {/* Sign Up Link */}
          <div className="auth-footer">
            Don't have an account?{' '}
            <Link to="/customer/register" state={location.state} className="auth-link">
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerLogin;
