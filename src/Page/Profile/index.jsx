import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { userAPI } from "../../services/api";
import ProfilePictureUpload from "../../Components/ProfilePictureUpload";
import { toast } from "sonner";

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
    profilePicture: null,
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
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
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
          profilePicture: profileInfo.profilePicture || null,
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
          profilePicture: null,
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
    
    // Clear field error if user is typing
    if (touchedFields[name]) {
      const error = validateProfileField(name, value);
      setFieldErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear field error if user is typing
    if (touchedFields[name]) {
      const error = validatePasswordField(name, value);
      setFieldErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleFieldBlur = (e) => {
    const { name, value } = e.target;
    setTouchedFields((prev) => ({
      ...prev,
      [name]: true,
    }));
    
    let error = "";
    if (isChangingPassword) {
      error = validatePasswordField(name, value);
    } else {
      error = validateProfileField(name, value);
    }
    
    setFieldErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const validateProfileField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "fname":
        if (!value.trim()) {
          error = "First name is required";
        } else if (value.trim().length < 2) {
          error = "First name must be at least 2 characters";
        }
        break;
      case "lname":
        if (!value.trim()) {
          error = "Last name is required";
        } else if (value.trim().length < 2) {
          error = "Last name must be at least 2 characters";
        }
        break;
      case "email":
        if (value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;
      case "phone":
        if (value.trim() && !/^[\d\s\-\+\(\)]{10,}$/.test(value)) {
          error = "Please enter a valid phone number";
        }
        break;
      case "dob":
        if (value) {
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (selectedDate > today) {
            error = "Date of birth cannot be in the future";
          }
          
          // Check if date is too old (more than 120 years ago)
          const minDate = new Date();
          minDate.setFullYear(minDate.getFullYear() - 120);
          if (selectedDate < minDate) {
            error = "Please enter a valid date of birth";
          }
        }
        break;
      default:
        break;
    }
    
    return error;
  };

  const validatePasswordField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "currentPassword":
        if (!value.trim()) {
          error = "Current password is required";
        }
        break;
      case "newPassword":
        if (!value) {
          error = "New password is required";
        } else if (value.length < 8) {
          error = "Password must be at least 8 characters";
        } else if (!/(?=.*[a-z])/.test(value)) {
          error = "Password must contain a lowercase letter";
        } else if (!/(?=.*[A-Z])/.test(value)) {
          error = "Password must contain an uppercase letter";
        } else if (!/(?=.*\d)/.test(value)) {
          error = "Password must contain a number";
        }
        break;
      case "confirmPassword":
        if (!value) {
          error = "Please confirm your password";
        } else if (value !== passwordData.newPassword) {
          error = "Passwords do not match";
        }
        break;
      default:
        break;
    }
    
    return error;
  };

  const validatePasswordForm = () => {
    const errors = {};
    
    // Validate all password fields
    Object.keys(passwordData).forEach((key) => {
      const error = validatePasswordField(key, passwordData[key]);
      if (error) {
        errors[key] = error;
      }
    });
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setTouchedFields({
        currentPassword: true,
        newPassword: true,
        confirmPassword: true,
      });
      toast.error("Please fix all errors before submitting");
      return false;
    }
    
    return true;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    try {
      setLoading(true);
      await userAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toast.success("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setFieldErrors({});
      setTouchedFields({});
      setIsChangingPassword(false);
    } catch (err) {
      toast.error(err.message || "Failed to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    // Validate all fields
    const errors = {};
    errors.fname = validateProfileField("fname", editData.fname);
    errors.lname = validateProfileField("lname", editData.lname);
    if (editData.email) errors.email = validateProfileField("email", editData.email);
    if (editData.phone) errors.phone = validateProfileField("phone", editData.phone);
    if (editData.dob) errors.dob = validateProfileField("dob", editData.dob);

    // Filter out empty errors
    const validErrors = {};
    Object.keys(errors).forEach((key) => {
      if (errors[key]) {
        validErrors[key] = errors[key];
      }
    });

    if (Object.keys(validErrors).length > 0) {
      setFieldErrors(validErrors);
      setTouchedFields({ fname: true, lname: true, email: true, phone: true, dob: true });
      toast.error("Please fix all errors before submitting");
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

      toast.success("Profile updated successfully!");
      setIsEditing(false);
      setFieldErrors({});
      setTouchedFields({});
    } catch (err) {
      toast.error(err.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getFieldStyle = (fieldName) => {
    const hasError = touchedFields[fieldName] && fieldErrors[fieldName];
    const isValid = touchedFields[fieldName] && !fieldErrors[fieldName];
    
    return {
      width: "100%",
      padding: "12px 16px",
      borderRadius: "10px",
      border: hasError ? "2px solid #e63946" : isValid ? "2px solid #06d6a0" : "2px solid #2A4A5A",
      backgroundColor: "#0f0f0f",
      color: "#DAFAF4",
      fontSize: "15px",
      outline: "none",
      transition: "all 0.3s ease",
      boxSizing: "border-box",
    };
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/(?=.*[a-z])/.test(password)) strength++;
    if (/(?=.*[A-Z])/.test(password)) strength++;
    if (/(?=.*\d)/.test(password)) strength++;
    if (/(?=.*[@$!%*?&#])/.test(password)) strength++;
    
    if (strength <= 2) return { strength, label: "Weak", color: "#e63946" };
    if (strength === 3) return { strength, label: "Fair", color: "#f77f00" };
    if (strength === 4) return { strength, label: "Good", color: "#06d6a0" };
    return { strength, label: "Strong", color: "#4CD3C8" };
  };

  if (loading && !profileData.name) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0B1929",
          color: "#DAFAF4",
          fontFamily: "'Red Hat Text', 'Red Hat Content', sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "3px solid #4CD3C8",
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
        backgroundColor: "#0B1929",
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
            backgroundColor: "#4CD3C8",
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
          <p style={{ color: "#5DDDD2", margin: 0 }}>
            Manage your account information and settings
          </p>
        </div>

        {/* Profile Card */}
        <div
          style={{
            backgroundColor: "#1A2A3A",
            border: "1px solid #2A4A5A",
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
              borderBottom: "1px solid #2A4A5A",
            }}
          >
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                backgroundColor: profileData.profilePicture ? "transparent" : "#4CD3C8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "30px",
                fontSize: "48px",
                fontWeight: "bold",
                color: "#0B1929",
                overflow: "hidden",
                border: profileData.profilePicture ? "3px solid #4CD3C8" : "none",
              }}
            >
              {profileData.profilePicture ? (
                <img
                  src={`${(import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/api$/, '')}${profileData.profilePicture}`}
                  alt="Profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                profileData.fname?.charAt(0)?.toUpperCase() || "U"
              )}
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
                  color: "#5DDDD2",
                  margin: "0 0 5px 0",
                  fontSize: "14px",
                }}
              >
                {profileData.email}
              </p>
              <p style={{ color: "#5DDDD2", margin: 0, fontSize: "14px" }}>
                Role: <span style={{ color: "#4CD3C8" }}>{profileData.role}</span>
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
                    color: "#5DDDD2",
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
                    color: "#5DDDD2",
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
                    color: "#5DDDD2",
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
                    color: "#5DDDD2",
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
                      color: "#5DDDD2",
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
                      color: "#5DDDD2",
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
                  backgroundColor: "#4CD3C8",
                  color: "#0B1929",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#4CD3C8";
                  e.target.style.transform = "scale(1.05)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#4CD3C8";
                  e.target.style.transform = "scale(1)";
                }}
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile}>
              {/* Profile Picture Upload Section */}
              <div style={{ marginBottom: "30px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#5DDDD2",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    marginBottom: "12px",
                    fontWeight: "bold",
                  }}
                >
                  Profile Picture
                </label>
                <ProfilePictureUpload
                  currentPicture={profileData.profilePicture}
                  onUploadSuccess={() => {
                    // Refetch profile after upload
                    userAPI.getProfile().then(response => {
                      const profileInfo = response.data || response;
                      setProfileData(prev => ({
                        ...prev,
                        profilePicture: profileInfo.profilePicture || null
                      }));
                    });
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#5DDDD2",
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
                  onBlur={handleFieldBlur}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    backgroundColor: "#252525",
                    border: fieldErrors.fname ? "1px solid #e63946" : "1px solid #2A4A5A",
                    borderRadius: "8px",
                    color: "#DAFAF4",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
                {fieldErrors.fname && (
                  <p style={{
                    color: "#e63946",
                    fontSize: "12px",
                    marginTop: "5px",
                    marginBottom: "0"
                  }}>
                    {fieldErrors.fname}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#5DDDD2",
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
                  onBlur={handleFieldBlur}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    backgroundColor: "#252525",
                    border: fieldErrors.lname ? "1px solid #e63946" : "1px solid #2A4A5A",
                    borderRadius: "8px",
                    color: "#DAFAF4",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
                {fieldErrors.lname && (
                  <p style={{
                    color: "#e63946",
                    fontSize: "12px",
                    marginTop: "5px",
                    marginBottom: "0"
                  }}>
                    {fieldErrors.lname}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#5DDDD2",
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
                  onBlur={handleFieldBlur}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    backgroundColor: "#252525",
                    border: fieldErrors.email ? "1px solid #e63946" : "1px solid #2A4A5A",
                    borderRadius: "8px",
                    color: "#DAFAF4",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
                {fieldErrors.email && (
                  <p style={{
                    color: "#e63946",
                    fontSize: "12px",
                    marginTop: "5px",
                    marginBottom: "0"
                  }}>
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#5DDDD2",
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
                  onBlur={handleFieldBlur}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    backgroundColor: "#252525",
                    border: fieldErrors.phone ? "1px solid #e63946" : "1px solid #2A4A5A",
                    borderRadius: "8px",
                    color: "#DAFAF4",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
                {fieldErrors.phone && (
                  <p style={{
                    color: "#e63946",
                    fontSize: "12px",
                    marginTop: "5px",
                    marginBottom: "0"
                  }}>
                    {fieldErrors.phone}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#5DDDD2",
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
                  onBlur={handleFieldBlur}
                  max={new Date().toISOString().split('T')[0]}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    backgroundColor: "#252525",
                    border: fieldErrors.dob ? "1px solid #e63946" : "1px solid #2A4A5A",
                    borderRadius: "8px",
                    color: "#DAFAF4",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
                {fieldErrors.dob && (
                  <p style={{
                    color: "#e63946",
                    fontSize: "12px",
                    marginTop: "5px",
                    marginBottom: "0"
                  }}>
                    {fieldErrors.dob}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: "30px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#5DDDD2",
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
                    border: "1px solid #2A4A5A",
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
                    backgroundColor: "#4CD3C8",
                    color: "#0B1929",
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
                      e.target.style.backgroundColor = "#4CD3C8";
                      e.target.style.transform = "scale(1.05)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!loading) {
                      e.target.style.backgroundColor = "#4CD3C8";
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
                    color: "#5DDDD2",
                    border: "1px solid #2A4A5A",
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
            backgroundColor: "#1A2A3A",
            border: "1px solid #2A4A5A",
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
                color: "#5DDDD2",
                border: "1px solid #2A4A5A",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#2A4A5A";
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
                    color: "#5DDDD2",
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
                      border: "1px solid #2A4A5A",
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
                      color: "#5DDDD2",
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
                    color: "#5DDDD2",
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
                      border: "1px solid #2A4A5A",
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
                      color: "#5DDDD2",
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
                    color: "#5DDDD2",
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
                      border: "1px solid #2A4A5A",
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
                      color: "#5DDDD2",
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
                    backgroundColor: "#4CD3C8",
                    color: "#0B1929",
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
                      e.target.style.backgroundColor = "#4CD3C8";
                      e.target.style.transform = "scale(1.05)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!loading) {
                      e.target.style.backgroundColor = "#4CD3C8";
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
                    color: "#5DDDD2",
                    border: "1px solid #2A4A5A",
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
            backgroundColor: "#1A2A3A",
            border: "1px solid #2A4A5A",
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


