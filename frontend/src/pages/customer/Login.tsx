import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authApi } from '../../api/authApi';
import './CustomerAuth.css';

const CustomerLogin: React.FC = () => {
  const navigate = useNavigate();
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
      
      // Redirect to menu or previous page
      const from = (location.state as any)?.from?.pathname || '/customer/menu';
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

          {/* Divider */}
          <div className="divider">
            <span>or continue with</span>
          </div>

          {/* Social Login */}
          <button type="button" className="btn btn-social">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Sign Up Link */}
          <div className="auth-footer">
            Don't have an account?{' '}
            <Link to="/customer/register" className="auth-link">
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerLogin;
