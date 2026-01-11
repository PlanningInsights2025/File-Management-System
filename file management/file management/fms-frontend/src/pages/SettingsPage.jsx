import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useNotification } from '../context/NotificationContext';
import Layout from '../components/Layout/Layout';
import '../styles/settings.css';

// Reusable Components
const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  React.useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn-destructive" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

const SectionCard = ({ title, description, children }) => (
  <div className="section-card">
    <div className="section-card-header">
      <h2>{title}</h2>
      {description && <p className="section-description">{description}</p>}
    </div>
    <div className="section-card-body">
      {children}
    </div>
  </div>
);

const FormRow = ({ label, description, children, htmlFor }) => (
  <div className="form-row">
    <div className="form-row-label">
      <label htmlFor={htmlFor}>{label}</label>
      {description && <span className="form-row-description">{description}</span>}
    </div>
    <div className="form-row-input">
      {children}
    </div>
  </div>
);

const SwitchToggle = ({ id, checked, onChange, label, disabled = false }) => (
  <label className="switch-toggle" htmlFor={id}>
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      disabled={disabled}
      role="switch"
      aria-checked={checked}
    />
    <span className="switch-slider"></span>
    <span className="switch-label">{label}</span>
  </label>
);

const RadioGroup = ({ name, options, selected, onChange }) => (
  <div className="radio-group">
    {options.map((option) => (
      <label key={option.value} className="radio-option">
        <input
          type="radio"
          name={name}
          value={option.value}
          checked={selected === option.value}
          onChange={() => onChange(option.value)}
        />
        <span className="radio-icon">{option.icon}</span>
        <span className="radio-label">{option.label}</span>
      </label>
    ))}
  </div>
);

const SegmentedControl = ({ options, selected, onChange }) => (
  <div className="segmented-control">
    {options.map((option) => (
      <button
        key={option.value}
        className={`segment ${selected === option.value ? 'active' : ''}`}
        onClick={() => onChange(option.value)}
        type="button"
      >
        {option.label}
      </button>
    ))}
  </div>
);

const ColorSwatch = ({ color, selected, onClick }) => (
  <button
    className={`color-swatch ${selected ? 'selected' : ''}`}
    style={{ backgroundColor: color }}
    onClick={onClick}
    aria-label={`Select ${color} color`}
    type="button"
  >
    {selected && <span className="checkmark">✓</span>}
  </button>
);

const PasswordStrengthMeter = ({ password }) => {
  const getStrength = (pwd) => {
    if (!pwd) return { level: 'none', label: '', color: '#e2e8f0' };
    if (pwd.length < 6) return { level: 'weak', label: 'Weak', color: '#ef4444' };
    if (pwd.length < 10) return { level: 'medium', label: 'Medium', color: '#f59e0b' };
    if (pwd.length >= 10 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) {
      return { level: 'strong', label: 'Strong', color: '#10b981' };
    }
    return { level: 'medium', label: 'Medium', color: '#f59e0b' };
  };

  const strength = getStrength(password);
  if (strength.level === 'none') return null;

  return (
    <div className="password-strength">
      <div className="strength-bar-container">
        <div 
          className={`strength-bar ${strength.level}`}
          style={{ 
            width: strength.level === 'weak' ? '33%' : strength.level === 'medium' ? '66%' : '100%',
            backgroundColor: strength.color 
          }}
        ></div>
      </div>
      <span className="strength-label" style={{ color: strength.color }}>{strength.label}</span>
    </div>
  );
};

const SettingsPage = () => {
  const navigate = useNavigate();
  const { userData } = useUser();
  const { showNotification } = useNotification();

  // Appearance State
  const [appearance, setAppearance] = useState({
    theme: 'light',
    density: 'comfortable',
    primaryColor: '#667eea'
  });
  const [appearanceLoading, setAppearanceLoading] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState({
    fileOutAlerts: true,
    overdueReminders: true,
    movementConfirmations: false,
    weeklySummary: true,
    frequency: 'immediate'
  });

  // Security State
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [securityErrors, setSecurityErrors] = useState({});

  // Sessions State
  const [sessions] = useState([
    { id: 1, device: 'Windows PC - Chrome', location: 'New York, US', lastActive: '2 minutes ago', current: true },
    { id: 2, device: 'iPhone 13 - Safari', location: 'New York, US', lastActive: '2 hours ago', current: false },
    { id: 3, device: 'MacBook Pro - Firefox', location: 'San Francisco, US', lastActive: '1 day ago', current: false }
  ]);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  // Appearance Handlers
  const handleAppearanceSave = () => {
    setAppearanceLoading(true);
    setTimeout(() => {
      setAppearanceLoading(false);
      showNotification({
        type: 'success',
        message: 'Appearance settings saved successfully!'
      });
      // Apply theme to document
      document.documentElement.setAttribute('data-theme', appearance.theme);
    }, 800);
  };

  const handleAppearanceReset = () => {
    setAppearance({
      theme: 'light',
      density: 'comfortable',
      primaryColor: '#667eea'
    });
    showNotification({
      type: 'info',
      message: 'Reset to default settings'
    });
  };

  // Notifications Handlers
  const handleNotificationToggle = (key, value) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    setTimeout(() => {
      showNotification({
        type: 'success',
        message: 'Notification preference updated'
      });
    }, 200);
  };

  const handleFrequencyChange = (value) => {
    setNotifications(prev => ({ ...prev, frequency: value }));
    showNotification({
      type: 'success',
      message: 'Notification frequency updated'
    });
  };

  // Security Handlers
  const validatePassword = () => {
    const errors = {};
    
    if (!security.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!security.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (security.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (security.newPassword !== security.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setSecurityErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordChange = () => {
    if (!validatePassword()) {
      showNotification({
        type: 'error',
        message: 'Please fix the errors below'
      });
      return;
    }

    // Simulate password change
    setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setSecurityErrors({});
    showNotification({
      type: 'success',
      message: 'Password changed successfully!'
    });
  };

  // Sessions Handlers
  const handleSignOutAll = () => {
    setShowSignOutModal(false);
    showNotification({
      type: 'success',
      message: 'Signed out of all other sessions'
    });
  };

  const themeOptions = [
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'system', label: 'System', icon: '💻' }
  ];

  const densityOptions = [
    { value: 'comfortable', label: 'Comfortable' },
    { value: 'compact', label: 'Compact' }
  ];

  const colorPresets = ['#667eea', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const frequencyOptions = [
    { value: 'immediate', label: 'Immediate' },
    { value: 'hourly', label: 'Hourly Digest' },
    { value: 'daily', label: 'Daily Digest' }
  ];

  return (
    <Layout>
      <div className="settings-wrapper">
        {/* Header */}
        <div className="settings-top-header">
          <div className="header-content">
            <div className="title-section">
              <svg width="32" height="32" fill="#475569" viewBox="0 0 16 16">
                <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319z"/>
              </svg>
              <div>
                <h1>Settings</h1>
                <p>Manage your application preferences and account settings</p>
              </div>
            </div>
          </div>
          <button className="back-button" onClick={() => navigate('/dashboard')}>
            ← Back
          </button>
        </div>

        {/* Main Content */}
        <div className="settings-container">
          <div className="settings-main">
            {/* Appearance Section */}
            {/* <SectionCard title="Appearance" description="Customize how the application looks and feels">
              <FormRow label="Theme" description="Choose your preferred color scheme">
                <RadioGroup
                  name="theme"
                  options={themeOptions}
                  selected={appearance.theme}
                  onChange={(value) => setAppearance(prev => ({ ...prev, theme: value }))}
                />
              </FormRow>

              <FormRow label="Density" description="Adjust spacing and element sizes">
                <SegmentedControl
                  options={densityOptions}
                  selected={appearance.density}
                  onChange={(value) => setAppearance(prev => ({ ...prev, density: value }))}
                />
              </FormRow>

              <FormRow label="Primary Color" description="Select your preferred accent color">
                <div className="color-swatches">
                  {colorPresets.map((color) => (
                    <ColorSwatch
                      key={color}
                      color={color}
                      selected={appearance.primaryColor === color}
                      onClick={() => setAppearance(prev => ({ ...prev, primaryColor: color }))}
                    />
                  ))}
                </div>
              </FormRow>

              <div className="section-actions">
                <button 
                  className="btn-link" 
                  onClick={handleAppearanceReset}
                  type="button"
                >
                  Reset to defaults
                </button>
                <button 
                  className="btn-primary" 
                  onClick={handleAppearanceSave}
                  disabled={appearanceLoading}
                >
                  {appearanceLoading ? (
                    <>
                      <span className="spinner"></span>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </SectionCard> */}

            {/* Notifications Section */}
            <SectionCard title="Notifications" description="Manage your notification preferences">
              <FormRow label="Email Alerts">
                <div className="notification-toggles">
                  <SwitchToggle
                    id="fileOutAlerts"
                    label="File OUT alerts"
                    checked={notifications.fileOutAlerts}
                    onChange={(val) => handleNotificationToggle('fileOutAlerts', val)}
                  />
                  <SwitchToggle
                    id="overdueReminders"
                    label="Overdue reminders"
                    checked={notifications.overdueReminders}
                    onChange={(val) => handleNotificationToggle('overdueReminders', val)}
                  />
                  <SwitchToggle
                    id="movementConfirmations"
                    label="Movement confirmations"
                    checked={notifications.movementConfirmations}
                    onChange={(val) => handleNotificationToggle('movementConfirmations', val)}
                  />
                  <SwitchToggle
                    id="weeklySummary"
                    label="Weekly summary emails"
                    checked={notifications.weeklySummary}
                    onChange={(val) => handleNotificationToggle('weeklySummary', val)}
                  />
                </div>
              </FormRow>

              <FormRow label="Frequency" description="How often to receive notifications" htmlFor="frequency">
                <select
                  id="frequency"
                  className="select-input"
                  value={notifications.frequency}
                  onChange={(e) => handleFrequencyChange(e.target.value)}
                >
                  {frequencyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FormRow>
            </SectionCard>

            {/* Security Section */}
            <SectionCard title="Security" description="Manage your password and security settings">
              <FormRow label="Change Password">
                <div className="password-form">
                  <div className="form-group">
                    <label htmlFor="currentPassword">Current Password</label>
                    <input
                      type="password"
                      id="currentPassword"
                      value={security.currentPassword}
                      onChange={(e) => {
                        setSecurity(prev => ({ ...prev, currentPassword: e.target.value }));
                        setSecurityErrors(prev => ({ ...prev, currentPassword: '' }));
                      }}
                      className={securityErrors.currentPassword ? 'error' : ''}
                      aria-invalid={!!securityErrors.currentPassword}
                    />
                    {securityErrors.currentPassword && (
                      <span className="error-message">{securityErrors.currentPassword}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      value={security.newPassword}
                      onChange={(e) => {
                        setSecurity(prev => ({ ...prev, newPassword: e.target.value }));
                        setSecurityErrors(prev => ({ ...prev, newPassword: '' }));
                      }}
                      className={securityErrors.newPassword ? 'error' : ''}
                      aria-invalid={!!securityErrors.newPassword}
                    />
                    {securityErrors.newPassword && (
                      <span className="error-message">{securityErrors.newPassword}</span>
                    )}
                    <PasswordStrengthMeter password={security.newPassword} />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={security.confirmPassword}
                      onChange={(e) => {
                        setSecurity(prev => ({ ...prev, confirmPassword: e.target.value }));
                        setSecurityErrors(prev => ({ ...prev, confirmPassword: '' }));
                      }}
                      className={securityErrors.confirmPassword ? 'error' : ''}
                      aria-invalid={!!securityErrors.confirmPassword}
                    />
                    {securityErrors.confirmPassword && (
                      <span className="error-message">{securityErrors.confirmPassword}</span>
                    )}
                  </div>

                  <button className="btn-primary" onClick={handlePasswordChange}>
                    Change Password
                  </button>
                </div>
              </FormRow>

              <FormRow label="Two-Factor Authentication">
                <div className="tfa-section">
                  <div className="tfa-status">
                    <span className="status-badge disabled">Disabled</span>
                    <span className="coming-soon-badge">Coming Soon</span>
                  </div>
                  <p className="tfa-description">
                    Add an extra layer of security to your account with two-factor authentication.
                  </p>
                </div>
              </FormRow>
            </SectionCard>

            {/* Sessions Section */}
            <SectionCard title="Active Sessions" description="Manage devices and sessions">
              <div className="sessions-list">
                {sessions.map((session) => (
                  <div key={session.id} className="session-item">
                    <div className="session-icon">💻</div>
                    <div className="session-info">
                      <div className="session-device">
                        {session.device}
                        {session.current && <span className="current-badge">Current</span>}
                      </div>
                      <div className="session-details">
                        <span>{session.location}</span>
                        <span className="separator">•</span>
                        <span>{session.lastActive}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                className="btn-destructive-outline"
                onClick={() => setShowSignOutModal(true)}
              >
                Sign out of all other sessions
              </button>
            </SectionCard>
          </div>

          {/* Sidebar */}
          <aside className="settings-sidebar">
            <SectionCard title="App Information">
              <div className="app-info">
                <div className="info-item">
                  <span className="info-label">Version</span>
                  <span className="info-value">1.0.0</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Environment</span>
                  <span className="info-value">Frontend Prototype</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Data Storage</span>
                  <span className="info-value">Local Browser</span>
                </div>
                <div className="info-note">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                  </svg>
                  <p>No backend writes yet. All changes are stored locally in your browser.</p>
                </div>
                <a href="#" className="privacy-link">Privacy Statement →</a>
              </div>
            </SectionCard>
          </aside>
        </div>

        {/* Modals */}
        <ConfirmModal
          isOpen={showSignOutModal}
          title="Sign Out All Sessions"
          message="Are you sure you want to sign out of all other devices? This action cannot be undone."
          onConfirm={handleSignOutAll}
          onCancel={() => setShowSignOutModal(false)}
        />
      </div>
    </Layout>
  );
};

export default SettingsPage;

