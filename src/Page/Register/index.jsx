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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setLocalError("");
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setLocalError("First name is required");
      return false;
    }
    if (!formData.lastName.trim()) {
      setLocalError("Last name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setLocalError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setLocalError("Please enter a valid email");
      return false;
    }
    if (!formData.phone.trim()) {
      setLocalError("Phone number is required");
      return false;
    }
    if (formData.password.length < 8) {
      setLocalError("Password must be at least 8 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match");
      return false;
    }
    if (!termsAccepted) {
      setLocalError("Please accept terms and conditions");
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
      backgroundColor: "#121212",
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
        backgroundColor: "#11E44F",
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
        backgroundColor: "#11E44F",
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
        backgroundColor: "#11E44F",
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
          backgroundColor: "#1a1a1a",
          border: "1px solid #313131",
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
              color: "#8AFFAC",
              margin: 0,
              fontWeight: "500",
            }}>Join ProNext today</p>
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
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: "2px solid #313131",
                  backgroundColor: "#0f0f0f",
                  color: "#DAFAF4",
                  fontSize: "15px",
                  outline: "none",
                  transition: "all 0.3s ease",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#11E44F";
                  e.target.style.backgroundColor = "#1a1a1a";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#313131";
                  e.target.style.backgroundColor = "#0f0f0f";
                }}
              />
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
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: "2px solid #313131",
                  backgroundColor: "#0f0f0f",
                  color: "#DAFAF4",
                  fontSize: "15px",
                  outline: "none",
                  transition: "all 0.3s ease",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#11E44F";
                  e.target.style.backgroundColor = "#1a1a1a";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#313131";
                  e.target.style.backgroundColor = "#0f0f0f";
                }}
              />
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
              }}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: "2px solid #313131",
                  backgroundColor: "#0f0f0f",
                  color: "#DAFAF4",
                  fontSize: "15px",
                  outline: "none",
                  transition: "all 0.3s ease",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#11E44F";
                  e.target.style.backgroundColor = "#1a1a1a";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#313131";
                  e.target.style.backgroundColor = "#0f0f0f";
                }}
              />
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
              }}>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="1234567890"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: "2px solid #313131",
                  backgroundColor: "#0f0f0f",
                  color: "#DAFAF4",
                  fontSize: "15px",
                  outline: "none",
                  transition: "all 0.3s ease",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#11E44F";
                  e.target.style.backgroundColor = "#1a1a1a";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#313131";
                  e.target.style.backgroundColor = "#0f0f0f";
                }}
              />
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
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: "10px",
                    border: "2px solid #313131",
                    backgroundColor: "#0f0f0f",
                    color: "#DAFAF4",
                    fontSize: "15px",
                    outline: "none",
                    transition: "all 0.3s ease",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#11E44F";
                    e.target.style.backgroundColor = "#1a1a1a";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#313131";
                    e.target.style.backgroundColor = "#0f0f0f";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    padding: "12px 16px",
                    background: "#11E44F",
                    color: "#121212",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
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
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: "10px",
                    border: "2px solid #313131",
                    backgroundColor: "#0f0f0f",
                    color: "#DAFAF4",
                    fontSize: "15px",
                    outline: "none",
                    transition: "all 0.3s ease",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#11E44F";
                    e.target.style.backgroundColor = "#1a1a1a";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#313131";
                    e.target.style.backgroundColor = "#0f0f0f";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    padding: "12px 16px",
                    background: "#11E44F",
                    color: "#121212",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
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
                    accentColor: "#11E44F",
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
                backgroundColor: "#11E44F",
                color: "#121212",
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
              onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = "#8AFFAC")}
              onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = "#11E44F")}
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
            borderTop: "1px solid #313131",
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
                  color: "#11E44F",
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
          color: "#8AFFAC",
          fontSize: "12px",
        }}>
          <p style={{ margin: 0 }}>ProNext © 2025 | All rights reserved</p>
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
