import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading, error, setError } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [localError, setLocalError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "firstName":
        if (!value.trim()) {
          error = "First name is required";
        } else if (value.trim().length < 2) {
          error = "First name must be at least 2 characters";
        }
        break;
      case "lastName":
        if (!value.trim()) {
          error = "Last name is required";
        } else if (value.trim().length < 2) {
          error = "Last name must be at least 2 characters";
        }
        break;
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;
      case "phone":
        if (!value.trim()) {
          error = "Phone number is required";
        } else if (!/^[\d\s\-\+\(\)]{10,}$/.test(value)) {
          error = "Please enter a valid phone number";
        }
        break;
      case "password":
        if (!value) {
          error = "Password is required";
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
        } else if (value !== formData.password) {
          error = "Passwords do not match";
        }
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Validate field if it's been touched
    if (touchedFields[name]) {
      const error = validateField(name, value);
      setFieldErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
    
    setLocalError("");
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouchedFields((prev) => ({
      ...prev,
      [name]: true,
    }));
    
    const error = validateField(name, value);
    setFieldErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
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

  const getFieldStyle = (fieldName) => {
    const hasError = touchedFields[fieldName] && fieldErrors[fieldName];
    const isValid = touchedFields[fieldName] && !fieldErrors[fieldName] && formData[fieldName];
    
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

  const handleFocusStyle = (e, hasError) => {
    if (!hasError) {
      e.target.style.borderColor = "#4CD3C8";
      e.target.style.backgroundColor = "#1A2A3A";
    }
  };

  const handleBlurStyle = (e, fieldName) => {
    const hasError = touchedFields[fieldName] && fieldErrors[fieldName];
    const isValid = touchedFields[fieldName] && !fieldErrors[fieldName] && formData[fieldName];
    
    if (hasError) {
      e.target.style.borderColor = "#e63946";
    } else if (isValid) {
      e.target.style.borderColor = "#06d6a0";
    } else {
      e.target.style.borderColor = "#2A4A5A";
    }
    e.target.style.backgroundColor = "#0f0f0f";
  };

  const validateForm = () => {
    const errors = {};
    
    // Validate all fields
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        errors[key] = error;
      }
    });
    
    if (!termsAccepted) {
      setLocalError("Please accept terms and conditions");
      return false;
    }
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setTouchedFields({
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        password: true,
        confirmPassword: true,
      });
      setLocalError("Please fix all errors before submitting");
      return false;
    }
    
    return true;
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      const response = await register(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.phone,
        formData.password
      );

      if (response && response.message) {
        setTimeout(() => {
          navigate("/verify-otp", {
            state: {
              email: formData.email,
              flowType: "register",
              message: "Please verify your email with OTP",
            },
          });
        }, 500);
      }
    } catch (err) {
      setLocalError(err.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px",
      backgroundColor: "#0B1929",
      position: "relative",
      overflow: "hidden",
      fontFamily: "'Red Hat Text', 'Red Hat Content', sans-serif"
    }}>
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "384px",
        height: "384px",
        opacity: 0.05,
        borderRadius: "50%",
        backgroundColor: "#4CD3C8",
        transform: "translate(-50%, -50%)",
      }}></div>
      <div style={{
        position: "absolute",
        bottom: 0,
        right: 0,
        width: "320px",
        height: "320px",
        opacity: 0.05,
        borderRadius: "50%",
        backgroundColor: "#4CD3C8",
        transform: "translate(33%, 33%)",
      }}></div>
      <div style={{
        position: "absolute",
        top: "50%",
        right: 0,
        width: "256px",
        height: "256px",
        opacity: 0.05,
        borderRadius: "50%",
        backgroundColor: "#4CD3C8",
        transform: "translate(50%, -50%)",
      }}></div>

      <div style={{
        width: "100%",
        maxWidth: "500px",
        position: "relative",
        zIndex: 10,
      }}>
        <div style={{
          borderRadius: "24px",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
          padding: "48px",
          backgroundColor: "#1A2A3A",
          border: "1px solid #2A4A5A",
        }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h1 style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: "#DAFAF4",
              margin: "0 0 8px 0",
              letterSpacing: "-0.5px",
            }}>Create Account</h1>
            <p style={{
              fontSize: "14px",
              color: "#5DDDD2",
              margin: 0,
              fontWeight: "500",
            }}>Join Pronext today</p>
          </div>

          {(localError || error) && (
            <div style={{
              marginBottom: "24px",
              padding: "12px 16px",
              borderRadius: "8px",
              backgroundColor: "#e6394612",
              borderLeft: "4px solid #e63946",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}>
              <i style={{
                color: "#e63946",
                fontSize: "18px",
                flexShrink: 0,
              }} className="fa-solid fa-circle-exclamation"></i>
              <span style={{
                color: "#e63946",
                fontSize: "14px",
              }}>{localError || error}</span>
            </div>
          )}

          <form onSubmit={handleRegisterSubmit} style={{ marginBottom: "24px" }}>
            {/* First Name */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "#DAFAF4",
                marginBottom: "8px",
                textTransform: "uppercase",
              }}>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                disabled={loading}
                style={getFieldStyle("firstName")}
                onFocus={(e) => handleFocusStyle(e, fieldErrors.firstName)}
                onBlur={(e) => {
                  handleBlur(e);
                  handleBlurStyle(e, "firstName");
                }}
              />
              {touchedFields.firstName && fieldErrors.firstName && (
                <div style={{
                  marginTop: "6px",
                  fontSize: "12px",
                  color: "#e63946",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}>
                  <i className="fa-solid fa-circle-exclamation" style={{ fontSize: "10px" }}></i>
                  <span>{fieldErrors.firstName}</span>
                </div>
              )}
            </div>

            {/* Last Name */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "#DAFAF4",
                marginBottom: "8px",
                textTransform: "uppercase",
              }}>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                disabled={loading}
                style={getFieldStyle("lastName")}
                onFocus={(e) => handleFocusStyle(e, fieldErrors.lastName)}
                onBlur={(e) => {
                  handleBlur(e);
                  handleBlurStyle(e, "lastName");
                }}
              />
              {touchedFields.lastName && fieldErrors.lastName && (
                <div style={{
                  marginTop: "6px",
                  fontSize: "12px",
                  color: "#e63946",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}>
                  <i className="fa-solid fa-circle-exclamation" style={{ fontSize: "10px" }}></i>
                  <span>{fieldErrors.lastName}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "#DAFAF4",
                marginBottom: "8px",
                textTransform: "uppercase",
              }}>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                disabled={loading}
                style={getFieldStyle("email")}
                onFocus={(e) => handleFocusStyle(e, fieldErrors.email)}
                onBlur={(e) => {
                  handleBlur(e);
                  handleBlurStyle(e, "email");
                }}
              />
              {touchedFields.email && fieldErrors.email && (
                <div style={{
                  marginTop: "6px",
                  fontSize: "12px",
                  color: "#e63946",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}>
                  <i className="fa-solid fa-circle-exclamation" style={{ fontSize: "10px" }}></i>
                  <span>{fieldErrors.email}</span>
                </div>
              )}
            </div>

            {/* Phone */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "#DAFAF4",
                marginBottom: "8px",
                textTransform: "uppercase",
              }}>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                disabled={loading}
                style={getFieldStyle("phone")}
                onFocus={(e) => handleFocusStyle(e, fieldErrors.phone)}
                onBlur={(e) => {
                  handleBlur(e);
                  handleBlurStyle(e, "phone");
                }}
              />
              {touchedFields.phone && fieldErrors.phone && (
                <div style={{
                  marginTop: "6px",
                  fontSize: "12px",
                  color: "#e63946",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}>
                  <i className="fa-solid fa-circle-exclamation" style={{ fontSize: "10px" }}></i>
                  <span>{fieldErrors.phone}</span>
                </div>
              )}
            </div>

            {/* Password */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "#DAFAF4",
                marginBottom: "8px",
                textTransform: "uppercase",
              }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={loading}
                  style={{
                    ...getFieldStyle("password"),
                    paddingRight: "45px",
                  }}
                  onFocus={(e) => handleFocusStyle(e, fieldErrors.password)}
                  onBlur={(e) => {
                    handleBlur(e);
                    handleBlurStyle(e, "password");
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    color: "#5DDDD2",
                    cursor: "pointer",
                    padding: "4px",
                    fontSize: "16px",
                  }}
                >
                  <i className={showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
                </button>
              </div>
              {formData.password && (
                <div style={{ marginTop: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <div style={{
                      flex: 1,
                      height: "4px",
                      backgroundColor: "#2A4A5A",
                      borderRadius: "2px",
                      overflow: "hidden",
                    }}>
                      <div style={{
                        height: "100%",
                        width: `${(getPasswordStrength(formData.password).strength / 5) * 100}%`,
                        backgroundColor: getPasswordStrength(formData.password).color,
                        transition: "all 0.3s ease",
                      }}></div>
                    </div>
                    <span style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      color: getPasswordStrength(formData.password).color,
                    }}>
                      {getPasswordStrength(formData.password).label}
                    </span>
                  </div>
                </div>
              )}
              {touchedFields.password && fieldErrors.password && (
                <div style={{
                  marginTop: "6px",
                  fontSize: "12px",
                  color: "#e63946",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}>
                  <i className="fa-solid fa-circle-exclamation" style={{ fontSize: "10px" }}></i>
                  <span>{fieldErrors.password}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "#DAFAF4",
                marginBottom: "8px",
                textTransform: "uppercase",
              }}>Confirm Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={loading}
                  style={{
                    ...getFieldStyle("confirmPassword"),
                    paddingRight: "45px",
                  }}
                  onFocus={(e) => handleFocusStyle(e, fieldErrors.confirmPassword)}
                  onBlur={(e) => {
                    handleBlur(e);
                    handleBlurStyle(e, "confirmPassword");
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
                    background: "transparent",
                    border: "none",
                    color: "#5DDDD2",
                    cursor: "pointer",
                    padding: "4px",
                    fontSize: "16px",
                  }}
                >
                  <i className={showConfirmPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
                </button>
              </div>
              {touchedFields.confirmPassword && !fieldErrors.confirmPassword && formData.confirmPassword && (
                <div style={{
                  marginTop: "6px",
                  fontSize: "12px",
                  color: "#06d6a0",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}>
                  <i className="fa-solid fa-circle-check" style={{ fontSize: "10px" }}></i>
                  <span>Passwords match</span>
                </div>
              )}
              {touchedFields.confirmPassword && fieldErrors.confirmPassword && (
                <div style={{
                  marginTop: "6px",
                  fontSize: "12px",
                  color: "#e63946",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}>
                  <i className="fa-solid fa-circle-exclamation" style={{ fontSize: "10px" }}></i>
                  <span>{fieldErrors.confirmPassword}</span>
                </div>
              )}
            </div>

            {/* Terms */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                color: "#DAFAF4",
                fontSize: "13px",
              }}>
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  disabled={loading}
                  style={{
                    width: "16px",
                    height: "16px",
                    cursor: "pointer",
                    accentColor: "#4CD3C8",
                  }}
                />
                <span>I agree to Terms & Conditions</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px 24px",
                backgroundColor: "#4CD3C8",
                color: "#0B1929",
                fontWeight: "600",
                fontSize: "16px",
                border: "none",
                borderRadius: "10px",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                opacity: loading ? 0.7 : 1,
              }}
              onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = "#5DDDD2")}
              onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = "#4CD3C8")}
            >
              {loading ? (
                <>
                  <i style={{ animation: "spin 1s linear infinite" }} className="fa-solid fa-spinner"></i>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-user-plus"></i>
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          <div style={{
            paddingTop: "24px",
            borderTop: "1px solid #2A4A5A",
            textAlign: "center",
          }}>
            <p style={{
              color: "#DAFAF4",
              fontSize: "14px",
              margin: 0,
            }}>
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "#4CD3C8",
                  textDecoration: "none",
                  fontWeight: "700",
                }}
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <div style={{
          marginTop: "24px",
          textAlign: "center",
          color: "#5DDDD2",
          fontSize: "12px",
        }}>
          <p style={{ margin: 0 }}>Pronext © 2025 | All rights reserved</p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}


