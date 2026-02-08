        import React, { useState } from "react";
        import { useNavigate, Link } from "react-router-dom";
        import { useAuth } from "../../context/AuthContext";

        export default function LoginPage() {
        const navigate = useNavigate();
        const { login, loading, error, setError } = useAuth();
        
        const [formData, setFormData] = useState({
            email: "",
            password: "",
        });
        const [localError, setLocalError] = useState("");
        const [fieldErrors, setFieldErrors] = useState({});
        const [touchedFields, setTouchedFields] = useState({});
        const [showPassword, setShowPassword] = useState(false);
        const [rememberMe, setRememberMe] = useState(false);

        const validateField = (name, value) => {
            let error = "";
            
            switch (name) {
                case "email":
                    if (!value.trim()) {
                        error = "Email is required";
                    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                        error = "Please enter a valid email address";
                    }
                    break;
                case "password":
                    if (!value) {
                        error = "Password is required";
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

        const getFieldStyle = (fieldName) => {
            const hasError = touchedFields[fieldName] && fieldErrors[fieldName];
            const isValid = touchedFields[fieldName] && !fieldErrors[fieldName] && formData[fieldName];
            
            return {
                width: "100%",
                paddingLeft: "44px",
                paddingRight: fieldName === "password" ? "45px" : "16px",
                paddingTop: "12px",
                paddingBottom: "12px",
                borderRadius: "10px",
                border: hasError ? "2px solid #e63946" : isValid ? "2px solid #06d6a0" : "2px solid #2A4A5A",
                backgroundColor: "#0f0f0f",
                color: "#DAFAF4",
                fontSize: "15px",
                outline: "none",
                transition: "all 0.3s ease",
                cursor: loading ? "not-allowed" : "text",
                opacity: loading ? 0.6 : 1,
            };
        };

        const handleLoginSubmit = async (e) => {
            e.preventDefault();
            setLocalError("");
            setError(null);

            // Validate all fields
            const errors = {};
            Object.keys(formData).forEach((key) => {
                const error = validateField(key, formData[key]);
                if (error) {
                    errors[key] = error;
                }
            });

            if (Object.keys(errors).length > 0) {
                setFieldErrors(errors);
                setTouchedFields({ email: true, password: true });
                setLocalError("Please fix all errors before submitting");
                return;
            }

    try {
      const response = await login(formData.email, formData.password);
      
      // Backend returns data nested under response.data
      if (response && response.data && (response.data.otp || response.data.token)) {
        // Login successful - need to verify OTP
        setTimeout(() => {
          navigate("/verify-otp", {
            state: {
              email: formData.email,
              flowType: "login",
              message: "Please verify OTP to complete login",
            },
          });
        }, 800);
      } else {
        // No OTP found - unexpected response
        setLocalError("Login response incomplete. Please try again.");
      }
    } catch (err) {
      setLocalError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      backgroundColor: '#0B1929',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Red Hat Text', 'Red Hat Content', sans-serif"
    }}>
      {/* Decorative Background Elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '384px',
        height: '384px',
        opacity: 0.05,
        borderRadius: '50%',
        backgroundColor: '#4CD3C8',
        transform: 'translate(-50%, -50%)',
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '320px',
        height: '320px',
        opacity: 0.05,
        borderRadius: '50%',
        backgroundColor: '#4CD3C8',
        transform: 'translate(33%, 33%)',
      }}></div>
      <div style={{
        position: 'absolute',
        top: '50%',
        right: 0,
        width: '256px',
        height: '256px',
        opacity: 0.05,
        borderRadius: '50%',
        backgroundColor: '#4CD3C8',
        transform: 'translate(50%, -50%)',
      }}></div>

      <div style={{
        width: '100%',
        maxWidth: '450px',
        position: 'relative',
        zIndex: 10,
      }}>
        {/* Main Card */}
        <div style={{
          borderRadius: '24px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
          padding: '48px',
          backgroundColor: '#1A2A3A',
          border: '1px solid #2A4A5A',
        }}>
          {/* Logo/Branding */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#DAFAF4',
              margin: '0 0 8px 0',
              letterSpacing: '-0.5px',
            }}>Welcome Back</h1>
            <p style={{
              fontSize: '14px',
              color: '#5DDDD2',
              margin: 0,
              fontWeight: '500',
            }}>Sign in to your ProNet account</p>
          </div>

          {/* Error Alert */}
          {(localError || error) && (
            <div style={{
              marginBottom: '24px',
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: '#e6394612',
              borderLeft: '4px solid #e63946',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <i style={{
                color: '#e63946',
                fontSize: '18px',
                flexShrink: 0,
              }} className="fa-solid fa-circle-exclamation"></i>
              <span style={{
                color: '#e63946',
                fontSize: '14px',
              }}>{localError || error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} style={{ marginBottom: '24px' }}>
            {/* Email Field */}
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="email" style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#DAFAF4',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <i style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#5DDDD2',
                  fontSize: '16px',
                }} className="fa-solid fa-envelope"></i>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  disabled={loading}
                  required
                  style={getFieldStyle("email")}
                  onFocus={(e) => {
                    if (!fieldErrors.email) {
                      e.target.style.borderColor = '#4CD3C8';
                      e.target.style.backgroundColor = '#1A2A3A';
                      e.target.style.boxShadow = '0 0 0 3px rgba(76, 211, 200, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    handleBlur(e);
                    const hasError = touchedFields.email && fieldErrors.email;
                    const isValid = touchedFields.email && !fieldErrors.email && formData.email;
                    e.target.style.borderColor = hasError ? '#e63946' : isValid ? '#06d6a0' : '#2A4A5A';
                    e.target.style.backgroundColor = '#0f0f0f';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              {touchedFields.email && fieldErrors.email && (
                <div style={{
                  marginTop: '6px',
                  fontSize: '12px',
                  color: '#e63946',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  <i className="fa-solid fa-circle-exclamation" style={{ fontSize: '10px' }}></i>
                  <span>{fieldErrors.email}</span>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="password" style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#DAFAF4',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Password
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <i style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#5DDDD2',
                  fontSize: '16px',
                }} className="fa-solid fa-lock"></i>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={loading}
                  required
                  style={getFieldStyle("password")}
                  onFocus={(e) => {
                    if (!fieldErrors.password) {
                      e.target.style.borderColor = '#4CD3C8';
                      e.target.style.backgroundColor = '#1A2A3A';
                      e.target.style.boxShadow = '0 0 0 3px rgba(76, 211, 200, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    handleBlur(e);
                    const hasError = touchedFields.password && fieldErrors.password;
                    const isValid = touchedFields.password && !fieldErrors.password && formData.password;
                    e.target.style.borderColor = hasError ? '#e63946' : isValid ? '#06d6a0' : '#2A4A5A';
                    e.target.style.backgroundColor = '#0f0f0f';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    background: 'transparent',
                    border: 'none',
                    color: '#5DDDD2',
                    cursor: 'pointer',
                    padding: '4px',
                    fontSize: '16px',
                  }}
                >
                  <i className={showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'}></i>
                </button>
              </div>
              {touchedFields.password && fieldErrors.password && (
                <div style={{
                  marginTop: '6px',
                  fontSize: '12px',
                  color: '#e63946',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  <i className="fa-solid fa-circle-exclamation" style={{ fontSize: '10px' }}></i>
                  <span>{fieldErrors.password}</span>
                </div>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
              fontSize: '13px',
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                color: '#DAFAF4',
              }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                  style={{
                    width: '16px',
                    height: '16px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    accentColor: '#4CD3C8',
                  }}
                />
                <span>Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                style={{
                  color: '#4CD3C8',
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => e.target.style.color = '#5DDDD2'}
                onMouseLeave={(e) => e.target.style.color = '#4CD3C8'}
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px 24px',
                backgroundColor: '#4CD3C8',
                color: '#0B1929',
                fontWeight: '600',
                fontSize: '16px',
                border: 'none',
                borderRadius: '10px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                opacity: loading ? 0.8 : 1,
                transform: loading ? 'scale(0.98)' : 'scale(1)',
              }}
              onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#5DDDD2')}
              onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#4CD3C8')}
              onMouseDown={(e) => !loading && (e.target.style.transform = 'scale(0.98)')}
              onMouseUp={(e) => !loading && (e.target.style.transform = 'scale(1)')}
            >
              {loading ? (
                <>
                  <i style={{ animation: 'spin 1s linear infinite' }} className="fa-solid fa-spinner"></i>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-sign-in-alt"></i>
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div style={{
            paddingTop: '24px',
            borderTop: '1px solid #2A4A5A',
            textAlign: 'center',
          }}>
            <p style={{
              color: '#DAFAF4',
              fontSize: '14px',
              margin: 0,
            }}>
              Don't have an account?{" "}
              <Link
                to="/register"
                style={{
                  color: '#4CD3C8',
                  textDecoration: 'none',
                  fontWeight: '700',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => e.target.style.color = '#5DDDD2'}
                onMouseLeave={(e) => e.target.style.color = '#4CD3C8'}
              >
                Create account
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div style={{
          marginTop: '24px',
          textAlign: 'center',
          color: '#5DDDD2',
          fontSize: '12px',
        }}>
          <p style={{ margin: 0 }}>Pronext © 2025 | All rights reserved</p>
        </div>
      </div>

      {/* Spinner Animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}


