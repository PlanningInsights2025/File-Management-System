import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import '../styles/login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Removed useEffect redirect to prevent login/dashboard blinking loop. Let App's ProtectedRoute handle redirection.

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    // Check if fields are not empty
    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    // Authenticate user
    setTimeout(() => {
      const trimmedEmail = formData.email.trim();
      const trimmedPassword = formData.password.trim();
      
      if (trimmedEmail === 'admin@company.com' && trimmedPassword === 'admin123') {
        localStorage.setItem('isAuthenticated', 'true');
        window.dispatchEvent(new Event('authChanged'));
        navigate('/dashboard'); // Use SPA navigation to avoid 404
      } else {
        setError('Invalid credentials. Please try again.');
      }
      setLoading(false);
    }, 500);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <LockIcon className="logo-icon" />
            <h1>File Management System</h1>
          </div>
          <p className="login-subtitle">Admin Login Portal</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">
              <EmailIcon className="input-icon" /> Email Address
            </label>
            <div className="input-wrapper">
              <EmailIcon className="input-icon-left" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input with-icon"
                placeholder="admin@company.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <LockIcon className="input-icon" /> Password
            </label>
            <div className="input-wrapper password-input">
              <LockIcon className="input-icon-left" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input with-icon with-toggle"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={formData.rememberMe}
                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
              />
              <span>Remember me</span>
            </label>
            <a href="#" className="forgot-password" onClick={(e) => e.preventDefault()}>Forgot Password?</a>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="login-footer">
            <p className="demo-title">Demo Credentials:</p>
            <p className="demo-info">Email: admin@company.com | Password: admin123</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;