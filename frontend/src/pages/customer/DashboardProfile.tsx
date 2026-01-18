import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCustomerProfile,
  updateCustomerProfile,
  changeCustomerPassword,
  uploadCustomerAvatar,
  deleteCustomerAvatar,
} from '../../api/customersApi';
import './DashboardProfile.css';

interface CustomerProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
}

const DashboardProfile: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

  // Profile form
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Photo upload
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const authUser = localStorage.getItem("auth_user");
      if (!authUser) {
        navigate("/");
        return;
      }

      const user = JSON.parse(authUser);
      const profileData = await getCustomerProfile(user.id);

      setProfile(profileData);
      setFullName(profileData.full_name);
      setEmail(profileData.email);
      setPhone(profileData.phone || "");
    } catch (err: any) {
      console.error("Error loading profile:", err);
      setError(err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }

      setPhotoFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile) return;

    try {
      setProfileLoading(true);
      setError("");
      setSuccess("");

      const updateData: any = {};
      if (fullName !== profile.full_name) updateData.full_name = fullName;
      if (email !== profile.email) updateData.email = email;
      if (phone !== profile.phone) updateData.phone = phone;

      if (Object.keys(updateData).length === 0 && !photoFile) {
        setError("No changes to save");
        return;
      }

      // Upload avatar if photo selected
      if (photoFile) {
        await uploadCustomerAvatar(profile.id, photoFile);
        setPhotoFile(null);
        setPhotoPreview(null);
      }

      // Update profile if there are text field changes
      if (Object.keys(updateData).length > 0) {
        const response = await updateCustomerProfile(profile.id, updateData);

        // Update localStorage
        const authUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
        authUser.full_name = response.data.full_name;
        authUser.email = response.data.email;
        localStorage.setItem('auth_user', JSON.stringify(authUser));

        setProfile(response.data);
        setSuccess(response.message);
      } else {
        // If only avatar was uploaded
        setSuccess('Avatar uploaded successfully');
      }

      // Reload profile to get latest data (including avatar)
      await loadProfile();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile) return;

    // Validation
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setPasswordLoading(true);
      setError("");
      setSuccess("");

      const response = await changeCustomerPassword(profile.id, {
        current_password: currentPassword,
        new_password: newPassword,
      });

      setSuccess(response.message);

      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Error changing password:", err);
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      window.location.reload();
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="dashboard-profile-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-profile-container">
      {/* Header */}
      <div className="profile-header">
        <button className="back-btn" onClick={handleBack}>
          <span>←</span>
        </button>
        <div className="header-content">
          <h1 className="header-title">Account Settings</h1>
          <p className="header-subtitle">Manage your account</p>
        </div>
        <button className="logout-header-btn" onClick={handleLogout}>
          <span>🚪</span>
        </button>
      </div>

      {/* Profile Avatar Section */}
      <div className="profile-avatar-section">
        <div className="profile-avatar-large">
          {photoPreview ? (
            <img src={photoPreview} alt="Profile Preview" />
          ) : profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="Profile" />
          ) : (
            profile?.full_name?.charAt(0).toUpperCase() || 'U'
          )}
        </div>
        <h2 className="profile-name">{profile?.full_name}</h2>
        <p className="profile-email">{profile?.email}</p>

        {/* Photo Upload */}
        <div className="photo-upload-section">
          <input
            type="file"
            id="photo-upload"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ display: 'none' }}
          />
          <label htmlFor="photo-upload" className="upload-photo-btn">
            📸 Upload Photo
          </label>
          {photoFile && (
            <p className="upload-hint">Photo ready to save</p>
          )}
          {profile?.avatar_url && !photoFile && (
            <button
              type="button"
              className="delete-photo-btn"
              onClick={async () => {
                if (confirm('Are you sure you want to delete your avatar?')) {
                  try {
                    await deleteCustomerAvatar(profile.id);
                    setSuccess('Avatar deleted successfully');
                    await loadProfile();
                    setTimeout(() => setSuccess(''), 3000);
                  } catch (err: any) {
                    setError(err.response?.data?.message || 'Failed to delete avatar');
                  }
                }
              }}
            >
              🗑️ Remove Photo
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <span className="tab-icon">👤</span>
          Profile Info
        </button>
        <button
          className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
          onClick={() => setActiveTab('password')}
        >
          <span className="tab-icon">🔒</span>
          Password
        </button>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <span className="alert-icon">✅</span>
          {success}
        </div>
      )}

      {/* Content */}
      <div className="profile-content">
        {activeTab === 'profile' && (
          <form className="profile-form" onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">👤</span>
                Full Name
              </label>
              <input
                type="text"
                className="form-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                minLength={2}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📧</span>
                Email
              </label>
              <input
                type="email"
                className="form-input"
                value={email}
                disabled
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📞</span>
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+84 123 456 789"
              />
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={profileLoading}
            >
              {profileLoading ? (
                <>
                  <div className="btn-spinner"></div>
                  Saving...
                </>
              ) : (
                <>
                  <span className="btn-icon">💾</span>
                  Save Changes
                </>
              )}
            </button>
          </form>
        )}

        {activeTab === 'password' && (
          <form className="profile-form" onSubmit={handleChangePassword}>
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">🔐</span>
                Current Password
              </label>
              <input
                type="password"
                className="form-input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">🔑</span>
                New Password
              </label>
              <input
                type="password"
                className="form-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                placeholder="At least 6 characters"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">✓</span>
                Confirm New Password
              </label>
              <input
                type="password"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={passwordLoading}
            >
              {passwordLoading ? (
                <>
                  <div className="btn-spinner"></div>
                  Changing...
                </>
              ) : (
                <>
                  <span className="btn-icon">🔒</span>
                  Change Password
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default DashboardProfile;
