import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { userAPI } from "../../services/api";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const [profileData, setProfileData] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    role: "",
    dob: "",
    address: "",
  });
  
  const [editData, setEditData] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Fetch profile data from API
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getProfile();
        
        // Handle nested response structure
        const profileInfo = response.data || response;
        
        setProfileData({
          fname: profileInfo.fname || user?.fname || "",
          lname: profileInfo.lname || user?.lname || "",
          email: profileInfo.email || user?.email || "",
          phone: profileInfo.phone || user?.phone || "",
          role: profileInfo.role || user?.role || "User",
          dob: profileInfo.dob ? new Date(profileInfo.dob).toISOString().split('T')[0] : "",
          address: profileInfo.address || "",
        });

        setEditData({
          fname: profileInfo.fname || user?.fname || "",
          lname: profileInfo.lname || user?.lname || "",
          email: profileInfo.email || user?.email || "",
          phone: profileInfo.phone || user?.phone || "",
          dob: profileInfo.dob ? new Date(profileInfo.dob).toISOString().split('T')[0] : "",
          address: profileInfo.address || "",
        });

        setError("");
      } catch (err) {
        console.error("Error fetching profile:", err);
        // Fallback to user data from auth context
        setProfileData({
          fname: user?.fname || "User",
          lname: user?.lname || "",
          email: user?.email || "",
          phone: user?.phone || "",
          role: user?.role || "User",
          dob: "",
          address: "",
        });
        setEditData({
          fname: user?.fname || "",
          lname: user?.lname || "",
          email: user?.email || "",
          phone: user?.phone || "",
          dob: "",
          address: "",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, navigate, user]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validatePasswordForm = () => {
    if (!passwordData.currentPassword.trim()) {
      setError("Current password is required");
      return false;
    }
    if (!passwordData.newPassword.trim()) {
      setError("New password is required");
      return false;
    }
    if (passwordData.newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return false;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!validatePasswordForm()) {
      return;
    }

    try {
      setLoading(true);
      await userAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setSuccessMessage("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsChangingPassword(false);

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      setError(err.message || "Failed to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!editData.fname.trim()) {
      setError("First name is required");
      return;
    }
    if (!editData.lname.trim()) {
      setError("Last name is required");
      return;
    }

    try {
      setLoading(true);
      const updatePayload = {
        fname: editData.fname.trim(),
        lname: editData.lname.trim(),
      };

      // Only add optional fields if they have values
      if (editData.email.trim()) updatePayload.email = editData.email.trim();
      if (editData.phone.trim()) updatePayload.phone = editData.phone.trim();
      if (editData.dob) updatePayload.dob = editData.dob;
      if (editData.address.trim()) updatePayload.address = editData.address.trim();

      await userAPI.updateProfile(updatePayload);

      setProfileData((prev) => ({
        ...prev,
        fname: editData.fname,
        lname: editData.lname,
        email: editData.email,
        phone: editData.phone,
        dob: editData.dob,
        address: editData.address,
      }));

      setSuccessMessage("Profile updated successfully!");
      setIsEditing(false);

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      setError(err.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading && !profileData.name) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#121212",
          color: "#DAFAF4",
          fontFamily: "'Red Hat Text', 'Red Hat Content', sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "3px solid #11E44F",
              borderTop: "3px solid transparent",
              borderRadius: "50%",
              margin: "0 auto 20px",
              animation: "spin 1s linear infinite",
            }}
          ></div>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#121212",
        padding: "40px 20px",
        fontFamily: "'Red Hat Text', 'Red Hat Content', sans-serif",
      }}
    >
      {/* Decorative Background */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0.03,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            backgroundColor: "#11E44F",
          }}
        ></div>
      </div>

      <div style={{ maxWidth: "1000px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <h1
            style={{
              fontSize: "32px",
              color: "#DAFAF4",
              margin: "0 0 10px 0",
              fontWeight: "bold",
            }}
          >
            My Profile
          </h1>
          <p style={{ color: "#8AFFAC", margin: 0 }}>
            Manage your account information and settings
          </p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div
            style={{
              marginBottom: "20px",
              padding: "12px 16px",
              backgroundColor: "#ff4444",
              color: "#fff",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        {successMessage && (
          <div
            style={{
              marginBottom: "20px",
              padding: "12px 16px",
              backgroundColor: "#11E44F",
              color: "#121212",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            {successMessage}
          </div>
        )}

        {/* Profile Card */}
        <div
          style={{
            backgroundColor: "#1a1a1a",
            border: "1px solid #313131",
            borderRadius: "16px",
            padding: "40px",
            marginBottom: "30px",
          }}
        >
          {/* Avatar Section */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "40px",
              paddingBottom: "30px",
              borderBottom: "1px solid #313131",
            }}
          >
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                backgroundColor: "#11E44F",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "30px",
                fontSize: "48px",
                fontWeight: "bold",
                color: "#121212",
              }}
            >
              {profileData.fname?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <h2
                style={{
                  color: "#DAFAF4",
                  fontSize: "24px",
                  margin: "0 0 8px 0",
                }}
              >
                {profileData.fname} {profileData.lname}
              </h2>
              <p
                style={{
                  color: "#8AFFAC",
                  margin: "0 0 5px 0",
                  fontSize: "14px",
                }}
              >
                {profileData.email}
              </p>
              <p style={{ color: "#8AFFAC", margin: 0, fontSize: "14px" }}>
                Role: <span style={{ color: "#11E44F" }}>{profileData.role}</span>
              </p>
            </div>
          </div>

          {/* Profile Information */}
          {!isEditing ? (
            <div>
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#8AFFAC",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                    fontWeight: "bold",
                  }}
                >
                  First Name
                </label>
                <p
                  style={{
                    color: "#DAFAF4",
                    fontSize: "16px",
                    margin: 0,
                    padding: "12px 0",
                  }}
                >
                  {profileData.fname}
                </p>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#8AFFAC",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                    fontWeight: "bold",
                  }}
                >
                  Last Name
                </label>
                <p
                  style={{
                    color: "#DAFAF4",
                    fontSize: "16px",
                    margin: 0,
                    padding: "12px 0",
                  }}
                >
                  {profileData.lname}
                </p>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#8AFFAC",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                    fontWeight: "bold",
                  }}
                >
                  Email Address
                </label>
                <p
                  style={{
                    color: "#DAFAF4",
                    fontSize: "16px",
                    margin: 0,
                    padding: "12px 0",
                  }}
                >
                  {profileData.email}
                </p>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#8AFFAC",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                    fontWeight: "bold",
                  }}
                >
                  Phone Number
                </label>
                <p
                  style={{
                    color: "#DAFAF4",
                    fontSize: "16px",
                    margin: 0,
                    padding: "12px 0",
                  }}
                >
                  {profileData.phone}
                </p>
              </div>

              {profileData.dob && (
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      color: "#8AFFAC",
                      fontSize: "12px",
                      textTransform: "uppercase",
                      marginBottom: "8px",
                      fontWeight: "bold",
                    }}
                  >
                    Date of Birth
                  </label>
                  <p
                    style={{
                      color: "#DAFAF4",
                      fontSize: "16px",
                      margin: 0,
                      padding: "12px 0",
                    }}
                  >
                    {profileData.dob}
                  </p>
                </div>
              )}

              {profileData.address && (
                <div style={{ marginBottom: "30px" }}>
                  <label
                    style={{
                      display: "block",
                      color: "#8AFFAC",
                      fontSize: "12px",
                      textTransform: "uppercase",
                      marginBottom: "8px",
                      fontWeight: "bold",
                    }}
                  >
                    Address
                  </label>
                  <p
                    style={{
                      color: "#DAFAF4",
                      fontSize: "16px",
                      margin: 0,
                      padding: "12px 0",
                    }}
                  >
                    {profileData.address}
                  </p>
                </div>
              )}

              <button
                onClick={() => setIsEditing(true)}
                style={{
                  backgroundColor: "#11E44F",
                  color: "#121212",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#0FCC41";
                  e.target.style.transform = "scale(1.05)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#11E44F";
                  e.target.style.transform = "scale(1)";
                }}
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile}>
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#8AFFAC",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                    fontWeight: "bold",
                  }}
                >
                  First Name
                </label>
                <input
                  type="text"
                  name="fname"
                  value={editData.fname}
                  onChange={handleEditChange}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    backgroundColor: "#252525",
                    border: "1px solid #313131",
                    borderRadius: "8px",
                    color: "#DAFAF4",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#8AFFAC",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                    fontWeight: "bold",
                  }}
                >
                  Last Name
                </label>
                <input
                  type="text"
                  name="lname"
                  value={editData.lname}
                  onChange={handleEditChange}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    backgroundColor: "#252525",
                    border: "1px solid #313131",
                    borderRadius: "8px",
                    color: "#DAFAF4",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#8AFFAC",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                    fontWeight: "bold",
                  }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleEditChange}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    backgroundColor: "#252525",
                    border: "1px solid #313131",
                    borderRadius: "8px",
                    color: "#DAFAF4",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#8AFFAC",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                    fontWeight: "bold",
                  }}
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={editData.phone}
                  onChange={handleEditChange}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    backgroundColor: "#252525",
                    border: "1px solid #313131",
                    borderRadius: "8px",
                    color: "#DAFAF4",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#8AFFAC",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                    fontWeight: "bold",
                  }}
                >
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={editData.dob}
                  onChange={handleEditChange}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    backgroundColor: "#252525",
                    border: "1px solid #313131",
                    borderRadius: "8px",
                    color: "#DAFAF4",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: "30px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#8AFFAC",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                    fontWeight: "bold",
                  }}
                >
                  Address
                </label>
                <textarea
                  name="address"
                  value={editData.address}
                  onChange={handleEditChange}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    backgroundColor: "#252525",
                    border: "1px solid #313131",
                    borderRadius: "8px",
                    color: "#DAFAF4",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    minHeight: "80px",
                    fontFamily: "'Red Hat Text', 'Red Hat Content', sans-serif",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    backgroundColor: "#11E44F",
                    color: "#121212",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease",
                    opacity: loading ? 0.6 : 1,
                  }}
                  onMouseOver={(e) => {
                    if (!loading) {
                      e.target.style.backgroundColor = "#0FCC41";
                      e.target.style.transform = "scale(1.05)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!loading) {
                      e.target.style.backgroundColor = "#11E44F";
                      e.target.style.transform = "scale(1)";
                    }
                  }}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditData({
                      fname: profileData.fname,
                      lname: profileData.lname,
                      email: profileData.email,
                      phone: profileData.phone,
                      dob: profileData.dob,
                      address: profileData.address,
                    });
                  }}
                  style={{
                    backgroundColor: "transparent",
                    color: "#8AFFAC",
                    border: "1px solid #313131",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#252525";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "transparent";
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Change Password Section */}
        <div
          style={{
            backgroundColor: "#1a1a1a",
            border: "1px solid #313131",
            borderRadius: "16px",
            padding: "40px",
            marginBottom: "30px",
          }}
        >
          <h3
            style={{
              color: "#DAFAF4",
              fontSize: "20px",
              margin: "0 0 30px 0",
            }}
          >
            Security Settings
          </h3>

          {!isChangingPassword ? (
            <button
              onClick={() => setIsChangingPassword(true)}
              style={{
                backgroundColor: "#252525",
                color: "#8AFFAC",
                border: "1px solid #313131",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#313131";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#252525";
              }}
            >
              Change Password
            </button>
          ) : (
            <form onSubmit={handleChangePassword}>
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#8AFFAC",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                    fontWeight: "bold",
                  }}
                >
                  Current Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      backgroundColor: "#252525",
                      border: "1px solid #313131",
                      borderRadius: "8px",
                      color: "#DAFAF4",
                      fontSize: "14px",
                      boxSizing: "border-box",
                      paddingRight: "40px",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      backgroundColor: "transparent",
                      border: "none",
                      color: "#8AFFAC",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    {showCurrentPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#8AFFAC",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                    fontWeight: "bold",
                  }}
                >
                  New Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      backgroundColor: "#252525",
                      border: "1px solid #313131",
                      borderRadius: "8px",
                      color: "#DAFAF4",
                      fontSize: "14px",
                      boxSizing: "border-box",
                      paddingRight: "40px",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      backgroundColor: "transparent",
                      border: "none",
                      color: "#8AFFAC",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    {showNewPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: "30px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#8AFFAC",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                    fontWeight: "bold",
                  }}
                >
                  Confirm New Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      backgroundColor: "#252525",
                      border: "1px solid #313131",
                      borderRadius: "8px",
                      color: "#DAFAF4",
                      fontSize: "14px",
                      boxSizing: "border-box",
                      paddingRight: "40px",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      backgroundColor: "transparent",
                      border: "none",
                      color: "#8AFFAC",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    backgroundColor: "#11E44F",
                    color: "#121212",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease",
                    opacity: loading ? 0.6 : 1,
                  }}
                  onMouseOver={(e) => {
                    if (!loading) {
                      e.target.style.backgroundColor = "#0FCC41";
                      e.target.style.transform = "scale(1.05)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!loading) {
                      e.target.style.backgroundColor = "#11E44F";
                      e.target.style.transform = "scale(1)";
                    }
                  }}
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                    setError("");
                  }}
                  style={{
                    backgroundColor: "transparent",
                    color: "#8AFFAC",
                    border: "1px solid #313131",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#252525";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "transparent";
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Logout Section */}
        <div
          style={{
            backgroundColor: "#1a1a1a",
            border: "1px solid #313131",
            borderRadius: "16px",
            padding: "40px",
          }}
        >
          <h3
            style={{
              color: "#DAFAF4",
              fontSize: "20px",
              margin: "0 0 20px 0",
            }}
          >
            Account Actions
          </h3>

          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "transparent",
              color: "#ff4444",
              border: "1px solid #ff4444",
              padding: "12px 24px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "rgba(255, 68, 68, 0.1)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "transparent";
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
