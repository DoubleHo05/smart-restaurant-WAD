import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authApi } from '../../api/authApi';
import './CustomerAuth.css';

interface PasswordStrength {
  score: number;
  label: string;
  class: string;
}

const CustomerRegister: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    label: '',
    class: '',
  });

  // Calculate password strength
  useEffect(() => {
    if (!formData.password) {
      setPasswordStrength({ score: 0, label: '', class: '' });
      return;
    }

    let score = 0;
    const password = formData.password;

    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Character variety checks
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;

    // Determine strength level
    if (score <= 2) {
      setPasswordStrength({ score: 33, label: 'Weak', class: 'weak' });
    } else if (score <= 4) {
      setPasswordStrength({ score: 66, label: 'Medium', class: 'medium' });
    } else {
      setPasswordStrength({ score: 100, label: 'Strong', class: 'strong' });
    }
  }, [formData.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
      });

      login(response.access_token, response.user);
      navigate('/customer/menu', { replace: true });
    } catch (err: any) {
      setErrors({
        submit: err.response?.data?.message || 'Registration failed. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mobile-container customer-auth-container">
      {/* Logo Section */}
      <div className="auth-header">
        <div className="auth-logo">🍽️</div>
        <h1 className="auth-title">Create Account</h1>
      </div>

      {/* Register Form */}
      <div className="auth-form-container">
        {errors.submit && (
          <div className="error-message">
            <span>⚠️</span>
            <span>{errors.submit}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span className="form-hint error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="form-hint error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Phone (Optional)</label>
            <input
              type="tel"
              name="phone"
              className="form-input"
              placeholder="+84 123 456 789"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
            />
            <span className="form-hint">
              Min 8 characters with uppercase, lowercase, and number
            </span>
            {errors.password && <span className="form-hint error">{errors.password}</span>}
          </div>

          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="password-strength">
              <div className="strength-bar">
                <div
                  className={`strength-fill ${passwordStrength.class}`}
                  style={{ width: `${passwordStrength.score}%` }}
                ></div>
              </div>
              <span className={`strength-text ${passwordStrength.class}`}>
                {passwordStrength.label}
              </span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <span className="form-hint error">{errors.confirmPassword}</span>
            )}
          </div>

          {/* Terms & Conditions */}
          <div className="checkbox-container">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
              />
              <span>
                I agree to the <a href="#">Terms of Service</a> and{' '}
                <a href="#">Privacy Policy</a>
              </span>
            </label>
            {errors.agreeToTerms && (
              <span className="form-hint error">{errors.agreeToTerms}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>

          {/* Divider */}
          <div className="divider">
            <span>or continue with</span>
          </div>

          {/* Social Login */}
          <button type="button" className="btn btn-social">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Sign In Link */}
          <div className="auth-footer">
            Already have an account?{' '}
            <Link to="/customer/login" className="auth-link">
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerRegister;
