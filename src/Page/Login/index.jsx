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
        const [showPassword, setShowPassword] = useState(false);
        const [rememberMe, setRememberMe] = useState(false);

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData((prev) => ({
            ...prev,
            [name]: value,
            }));
            setLocalError("");
        };

        const handleLoginSubmit = async (e) => {
            e.preventDefault();
            setLocalError("");
            setError(null);

    if (!formData.email.trim()) {
      setLocalError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setLocalError("Please enter a valid email");
      return;
    }
    if (!formData.password) {
      setLocalError("Password is required");
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
      backgroundColor: '#121212',
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
        backgroundColor: '#11E44F',
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
        backgroundColor: '#11E44F',
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
        backgroundColor: '#11E44F',
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
          backgroundColor: '#1a1a1a',
          border: '1px solid #313131',
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
              color: '#8AFFAC',
              margin: 0,
              fontWeight: '500',
            }}>Sign in to your ProNext account</p>
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
                  top: '12px',
                  color: '#8AFFAC',
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
                  style={{
                    width: '100%',
                    paddingLeft: '44px',
                    paddingRight: '16px',
                    paddingTop: '12px',
                    paddingBottom: '12px',
                    borderRadius: '10px',
                    border: '2px solid #313131',
                    backgroundColor: '#0f0f0f',
                    color: '#DAFAF4',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    cursor: loading ? 'not-allowed' : 'text',
                    opacity: loading ? 0.6 : 1,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#11E44F';
                    e.target.style.backgroundColor = '#1a1a1a';
                    e.target.style.boxShadow = '0 0 0 3px rgba(17, 228, 79, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#313131';
                    e.target.style.backgroundColor = '#0f0f0f';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
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
                  top: '12px',
                  color: '#8AFFAC',
                  fontSize: '16px',
                  pointerEvents: 'none',
                }} className="fa-solid fa-lock"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={loading}
                  required
                  style={{
                    width: '100%',
                    paddingLeft: '44px',
                    paddingRight: '44px',
                    paddingTop: '12px',
                    paddingBottom: '12px',
                    borderRadius: '10px',
                    border: '2px solid #313131',
                    backgroundColor: '#0f0f0f',
                    color: '#DAFAF4',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    cursor: loading ? 'not-allowed' : 'text',
                    opacity: loading ? 0.6 : 1,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#11E44F';
                    e.target.style.backgroundColor = '#1a1a1a';
                    e.target.style.boxShadow = '0 0 0 3px rgba(17, 228, 79, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#313131';
                    e.target.style.backgroundColor = '#0f0f0f';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    color: '#8AFFAC',
                    fontSize: '16px',
                    background: 'none',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    padding: '8px',
                    transition: 'color 0.2s ease',
                    opacity: loading ? 0.6 : 1,
                  }}
                  onMouseEnter={(e) => !loading && (e.target.style.color = '#11E44F')}
                  onMouseLeave={(e) => (e.target.style.color = '#8AFFAC')}
                >
                  <i className={`fa-solid fa-${showPassword ? "eye-slash" : "eye"}`}></i>
                </button>
              </div>
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
                    accentColor: '#11E44F',
                  }}
                />
                <span>Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                style={{
                  color: '#11E44F',
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => e.target.style.color = '#8AFFAC'}
                onMouseLeave={(e) => e.target.style.color = '#11E44F'}
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
                backgroundColor: '#11E44F',
                color: '#121212',
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
              onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#8AFFAC')}
              onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#11E44F')}
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

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            margin: '24px 0',
          }}>
            <div style={{
              flex: 1,
              height: '1px',
              backgroundColor: '#313131',
            }}></div>
            <span style={{
              color: '#8AFFAC',
              fontSize: '12px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}>or continue with</span>
            <div style={{
              flex: 1,
              height: '1px',
              backgroundColor: '#313131',
            }}></div>
          </div>

          {/* Social Login Buttons */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '24px',
          }}>
            <button
              type="button"
              disabled={loading}
              style={{
                padding: '12px 16px',
                border: '2px solid #313131',
                borderRadius: '10px',
                backgroundColor: 'transparent',
                color: '#DAFAF4',
                fontWeight: '600',
                fontSize: '14px',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                opacity: loading ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.borderColor = '#11E44F';
                  e.target.style.color = '#11E44F';
                  e.target.style.backgroundColor = '#11E44F12';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#313131';
                e.target.style.color = '#DAFAF4';
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <i className="fa-brands fa-google text-lg"></i>
              <span>Google</span>
            </button>
            <button
              type="button"
              disabled={loading}
              style={{
                padding: '12px 16px',
                border: '2px solid #313131',
                borderRadius: '10px',
                backgroundColor: 'transparent',
                color: '#DAFAF4',
                fontWeight: '600',
                fontSize: '14px',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                opacity: loading ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.borderColor = '#11E44F';
                  e.target.style.color = '#11E44F';
                  e.target.style.backgroundColor = '#11E44F12';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#313131';
                e.target.style.color = '#DAFAF4';
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <i className="fa-brands fa-facebook text-lg"></i>
              <span>Facebook</span>
            </button>
          </div>

          {/* Footer */}
          <div style={{
            paddingTop: '24px',
            borderTop: '1px solid #313131',
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
                  color: '#11E44F',
                  textDecoration: 'none',
                  fontWeight: '700',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => e.target.style.color = '#8AFFAC'}
                onMouseLeave={(e) => e.target.style.color = '#11E44F'}
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
          color: '#8AFFAC',
          fontSize: '12px',
        }}>
          <p style={{ margin: 0 }}>ProNext © 2025 | All rights reserved</p>
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
