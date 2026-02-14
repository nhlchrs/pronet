import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

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
      
      console.log("Sending forgot password request to:", `${API_URL}/forssgot-password`);
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email: email.toLowerCase().trim(),
      });

      console.log("Response received:", response.data);

      if (response.data.status==1) {
        const otpValue = response.data.data?.otp;
        console.log("OTP received:", otpValue);
        
        if (otpValue) {
          toast.success(`OTP: ${otpValue} (Valid for 5 minutes)`, {
            duration: 5000
          });
        } else {
          toast.success("OTP sent to your email! Check your inbox.");
        }
        
        console.log("Navigating to reset password page");
        setLoading(false);
        
        // Navigate directly to reset password page with email and OTP
        navigate("/reset-password", {
          state: { 
            email: email.toLowerCase().trim(),
            otp: otpValue 
          },
          replace: true
        });
      } else {
        console.error("Request failed:", response.data.message);
        toast.error(response.data.message || "Failed to send OTP");
        setLoading(false);
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error(
        error.response?.data?.message || 
        "Failed to send OTP. Please try again."
      );
      setLoading(false);
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
                color: '#4CD3C8',
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
              color: '#5DDDD2',
              margin: 0,
              fontWeight: '500',
              lineHeight: '1.5',
            }}>
              Enter your email and we'll send you a reset OTP
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
                  color: '#5DDDD2',
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
                    border: '2px solid #2A4A5A',
                    backgroundColor: '#0f0f0f',
                    color: '#DAFAF4',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    cursor: loading ? 'not-allowed' : 'text',
                    opacity: loading ? 0.6 : 1,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#4CD3C8';
                    e.target.style.backgroundColor = '#1A2A3A';
                    e.target.style.boxShadow = '0 0 0 3px rgba(17, 228, 79, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#2A4A5A';
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
                background: 'linear-gradient(135deg, #4CD3C8 0%, #2A7A75 100%)',
                color: '#0B1929',
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
            borderTop: '1px solid #2A4A5A',
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
                color: '#4CD3C8',
                fontSize: '14px',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#5DDDD2';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#4CD3C8';
              }}
            >
              <i className="fa-solid fa-arrow-left"></i>
              Back to Login
            </Link>
          </div>
        </div>

        {/* Footer Text */}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#5DDDD2', margin: 0 }}>
            Remember your password?{" "}
            <Link
              to="/login"
              style={{
                color: '#4CD3C8',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#DAFAF4';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#4CD3C8';
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


