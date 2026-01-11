import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useNotification } from '../context/NotificationContext';
import Layout from '../components/Layout/Layout';
import '../styles/profile.css';

// Form Group Component
const FormGroup = ({ label, error, required, children, fullWidth }) => (
  <div className={`form-group ${fullWidth ? 'full-width' : ''}`}>
    <label>
      {label}
      {required && <span className="required-indicator">*</span>}
    </label>
    {children}
    {error && <span className="error-message" role="alert">{error}</span>}
  </div>
);

// Skeleton Loader Component
const SkeletonLoader = () => (
  <div className="skeleton-loader">
    <div className="skeleton-header">
      <div className="skeleton-avatar pulse"></div>
      <div className="skeleton-info">
        <div className="skeleton-line skeleton-title pulse"></div>
        <div className="skeleton-line skeleton-subtitle pulse"></div>
      </div>
    </div>
    <div className="skeleton-form">
      <div className="skeleton-line pulse"></div>
      <div className="skeleton-line pulse"></div>
      <div className="skeleton-line pulse"></div>
    </div>
  </div>
);

const ProfilePage = () => {
  const { userData, updateUserData, updateAvatar } = useUser();
  const { showNotification } = useNotification();
  
  const [profileData, setProfileData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    bio: '',
    avatar: null
  });

  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userData) {
      setProfileData({
        fullName: userData.fullName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        username: userData.username || '',
        bio: userData.bio || '',
        avatar: userData.avatar || null
      });
      setIsLoading(false);
    }
  }, [userData]);

  const validateForm = () => {
    const newErrors = {};

    if (!profileData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, avatar: 'Please upload a JPG or PNG image' }));
      showNotification({
        type: 'error',
        message: 'Please upload a JPG or PNG image'
      });
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, avatar: 'File size must be less than 2MB' }));
      showNotification({
        type: 'error',
        message: 'File size must be less than 2MB'
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const avatarUrl = reader.result;
      setProfileData(prev => ({ ...prev, avatar: avatarUrl }));
      updateAvatar(avatarUrl);
      setErrors(prev => ({ ...prev, avatar: '' }));
      showNotification({
        type: 'success',
        message: 'Profile photo updated successfully!'
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setProfileData(prev => ({ ...prev, avatar: null }));
    updateAvatar(null);
  };

  const handleSave = () => {
    if (!validateForm()) {
      showNotification({
        type: 'error',
        message: 'Please fix the errors before saving'
      });
      return;
    }

    setIsSaving(true);
    
    // Simulate async save
    setTimeout(() => {
      updateUserData(profileData);
      setIsEditing(false);
      setIsSaving(false);
      showNotification({
        type: 'success',
        message: 'Profile updated successfully!'
      });
    }, 500);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    // Reset to original userData
    setProfileData({
      fullName: userData.fullName || '',
      email: userData.email || '',
      phone: userData.phone || '',
      username: userData.username || '',
      bio: userData.bio || '',
      avatar: userData.avatar || null
    });
  };

  const getInitials = (name) => {
    if (!name) return 'AU';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="settings-page">
          <SkeletonLoader />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="settings-page">
        {/* Header */}
        <div className="settings-header">
          <div className="header-content">
            <h1>👤 My Profile</h1>
            <p className="subtitle">Manage your personal information and preferences</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="settings-content">
          <div className="settings-card">
            {/* Profile Header with Avatar */}
            <div className="profile-header-section">
              {/* Avatar Block */}
              <div className="avatar-section">
                {profileData.avatar ? (
                  <img 
                    src={profileData.avatar} 
                    alt={`${profileData.fullName}'s profile`}
                    className="profile-avatar-large" 
                  />
                ) : (
                  <div 
                    className="profile-avatar-large no-image"
                    aria-label="Default avatar with initials"
                  >
                    {getInitials(profileData.fullName)}
                  </div>
                )}
                
                <div className="avatar-actions">
                  <label className="btn-upload" htmlFor="avatar-upload">
                    📸 Upload Photo
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={handlePhotoUpload}
                      style={{ display: 'none' }}
                      aria-label="Upload profile photo"
                    />
                  </label>
                  {profileData.avatar && (
                    <button 
                      className="btn-remove" 
                      onClick={handleRemovePhoto}
                      aria-label="Remove profile photo"
                    >
                      🗑️ Remove
                    </button>
                  )}
                </div>
                
                <p className="avatar-hint">Max file size: 2MB. Accepted formats: JPG, PNG</p>
                {errors.avatar && (
                  <span className="error-message" role="alert">{errors.avatar}</span>
                )}
              </div>

              {/* Profile Info Summary */}
              <div className="profile-info-section">
                <h2>{profileData.fullName || 'User Name'}</h2>
                <p className="user-role">{userData?.role || 'User'}</p>
                <p className="user-email">✉️ {profileData.email || 'No email provided'}</p>
                {profileData.username && (
                  <p className="user-username">@{profileData.username}</p>
                )}
              </div>
            </div>

            <div className="divider" role="separator"></div>

            {/* Profile Form */}
            <div className="form-section">
              <div className="section-header">
                <h3>Personal Information</h3>
                {!isEditing ? (
                  <button 
                    className="btn-edit" 
                    onClick={() => setIsEditing(true)}
                    aria-label="Edit profile information"
                  >
                    ✏️ Edit Profile
                  </button>
                ) : (
                  <div className="edit-actions">
                    <button 
                      className="btn-cancel" 
                      onClick={handleCancel}
                      disabled={isSaving}
                      aria-label="Cancel editing"
                    >
                      Cancel
                    </button>
                    <button 
                      className="btn-save" 
                      onClick={handleSave}
                      disabled={isSaving}
                      aria-label="Save changes"
                    >
                      {isSaving ? (
                        <>
                          <span className="spinner"></span>
                          Saving...
                        </>
                      ) : (
                        <>💾 Save Changes</>
                      )}
                    </button>
                  </div>
                )}
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} noValidate>
                <div className="form-grid">
                  <FormGroup 
                    label="Full Name" 
                    error={errors.fullName}
                    required
                  >
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Enter your full name"
                      aria-required="true"
                      aria-invalid={!!errors.fullName}
                      aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                    />
                  </FormGroup>

                  <FormGroup label="Username">
                    <input
                      type="text"
                      value={profileData.username}
                      onChange={(e) => handleChange('username', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Enter username"
                      aria-label="Username"
                    />
                  </FormGroup>

                  <FormGroup 
                    label="Email Address" 
                    error={errors.email}
                    required
                  >
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Enter email"
                      aria-required="true"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                  </FormGroup>

                  <FormGroup label="Phone Number">
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Enter phone number"
                      aria-label="Phone number"
                    />
                  </FormGroup>

                  <FormGroup label="Bio" fullWidth>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => handleChange('bio', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Tell us about yourself"
                      rows="4"
                      aria-label="Biography"
                    />
                  </FormGroup>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
