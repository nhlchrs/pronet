import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email: email.toLowerCase().trim(),
      });

      if (response.data.success) {
        setEmailSent(true);
        toast.success("Password reset link sent! Check your email.");
      } else {
        toast.error(response.data.message || "Failed to send reset link");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error(
        error.response?.data?.message || 
        "Failed to send reset link. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
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
        {/* Decorative Background */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '384px',
          height: '384px',
          opacity: 0.05,
          borderRadius: '50%',
          backgroundColor: '#11E44F',
          transform: 'translate(33%, -33%)',
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '320px',
          height: '320px',
          opacity: 0.05,
          borderRadius: '50%',
          backgroundColor: '#11E44F',
          transform: 'translate(-33%, 33%)',
        }}></div>

        <div style={{
          width: '100%',
          maxWidth: '450px',
          position: 'relative',
          zIndex: 10,
        }}>
          <div style={{
            borderRadius: '24px',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
            padding: '48px',
            backgroundColor: '#1a1a1a',
            border: '1px solid #313131',
            textAlign: 'center',
          }}>
            {/* Success Icon */}
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: 'rgba(17, 228, 79, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              border: '2px solid rgba(17, 228, 79, 0.2)',
            }}>
              <i className="fa-solid fa-check" style={{
                fontSize: '36px',
                color: '#11E44F',
              }}></i>
            </div>

            <h2 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#DAFAF4',
              margin: '0 0 12px 0',
            }}>Check Your Email</h2>
            
            <p style={{
              fontSize: '15px',
              color: '#8AFFAC',
              marginBottom: '8px',
            }}>
              We've sent a password reset link to
            </p>
            <p style={{
              fontSize: '16px',
              color: '#11E44F',
              fontWeight: '600',
              marginBottom: '24px',
              wordBreak: 'break-word',
            }}>{email}</p>

            {/* Info Box */}
            <div style={{
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: 'rgba(17, 228, 79, 0.05)',
              border: '1px solid rgba(17, 228, 79, 0.2)',
              marginBottom: '32px',
            }}>
              <p style={{
                fontSize: '13px',
                color: '#8AFFAC',
                margin: 0,
                lineHeight: '1.6',
              }}>
                <strong style={{ color: '#DAFAF4' }}>Didn't receive the email?</strong>
                <br />
                Check your spam folder or try again in a few minutes.
              </p>
            </div>

            {/* Back to Login */}
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#11E44F',
                fontSize: '14px',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#8AFFAC';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#11E44F';
              }}
            >
              <i className="fa-solid fa-arrow-left"></i>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: 'rgba(17, 228, 79, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              border: '2px solid rgba(17, 228, 79, 0.2)',
            }}>
              <i className="fa-solid fa-envelope" style={{
                fontSize: '28px',
                color: '#11E44F',
              }}></i>
            </div>
            
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#DAFAF4',
              margin: '0 0 8px 0',
              letterSpacing: '-0.5px',
            }}>Forgot Password?</h1>
            
            <p style={{
              fontSize: '14px',
              color: '#8AFFAC',
              margin: 0,
              fontWeight: '500',
              lineHeight: '1.5',
            }}>
              Enter your email and we'll send you a reset link
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
            {/* Email Field */}
            <div style={{ marginBottom: '24px' }}>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px 24px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #11E44F 0%, #0BA639 100%)',
                color: '#121212',
                fontSize: '15px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                boxShadow: '0 4px 14px rgba(17, 228, 79, 0.4)',
                opacity: loading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(17, 228, 79, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 14px rgba(17, 228, 79, 0.4)';
                }
              }}
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin"></i>
                  Sending...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-paper-plane"></i>
                  Send Reset Link
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            borderTop: '1px solid #313131',
            marginBottom: '24px',
          }}></div>

          {/* Back to Login */}
          <div style={{ textAlign: 'center' }}>
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#11E44F',
                fontSize: '14px',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#8AFFAC';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#11E44F';
              }}
            >
              <i className="fa-solid fa-arrow-left"></i>
              Back to Login
            </Link>
          </div>
        </div>

        {/* Footer Text */}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#8AFFAC', margin: 0 }}>
            Remember your password?{" "}
            <Link
              to="/login"
              style={{
                color: '#11E44F',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#DAFAF4';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#11E44F';
              }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
