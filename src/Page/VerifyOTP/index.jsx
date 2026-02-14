import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function VerifyOTPPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOTP, resendOTP, loading, error, setError } = useAuth();

  const [otp, setOtp] = useState("");
  const [localError, setLocalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [temporaryOTP, setTemporaryOTP] = useState(null);
  const [email, setEmail] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [flowType, setFlowType] = useState("register"); // "register" or "login"

  useEffect(() => {
    // Get email from location state (passed from register/login page)
    if (location.state?.email) {
      setEmail(location.state.email);
      setFlowType(location.state.flowType || "register");
    } else {
      // Fallback: Try to get email from state or redirect
      setLocalError("Email not found. Please try again.");
      setTimeout(() => {
        navigate("/register");
      }, 2000);
    }
  }, [location.state, navigate]);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const validateOTP = () => {
    if (!otp.trim()) {
      setLocalError("OTP is required");
      return false;
    }
    if (!/^\d{6}$/.test(otp)) {
      setLocalError("OTP must be 6 digits");
      return false;
    }
    return true;
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLocalError("");
    setSuccessMessage("");
    setError(null);

    if (!validateOTP()) {
      return;
    }

    try {
      const response = await verifyOTP(email, otp);

      // Handle both response structures: response.token or response.data.token
      const token = response.token || (response.data && response.data.token);
      const user = response.user || (response.data && response.data.user);
      
      if (token) {
        setSuccessMessage("OTP verified successfully! Redirecting...");
        
        // Auto-login after OTP verification (for both registration and login flows)
        // The token is already stored by verifyOTP in AuthContext
        
        // Check if user has active subscription/membership
        const hasActiveSubscription = user?.membershipStatus === 'active' || 
                                      user?.subscriptionStatus === 'active' ||
                                      user?.hasMembership === true ||
                                      (user?.subscription && user.subscription.isActive);
        
        setTimeout(() => {
          if (!hasActiveSubscription) {
            // Redirect to payment/subscription page if no active subscription
            navigate("/payment", { 
              state: { 
                message: "Please subscribe to a plan to access all features",
                fromAuth: true 
              } 
            });
          } else {
            // Redirect to dashboard if subscription is active
            navigate("/dashboard");
          }
        }, 1500);
      } else {
        setLocalError("OTP verification failed. No token received.");
      }
    } catch (err) {
      setLocalError(err.message || "OTP verification failed. Please try again.");
    }
  };

  const handleResendOTP = async () => {
    setLocalError("");
    setError(null);
    setTemporaryOTP(null);

    if (!email) {
      setLocalError("Email not found");
      return;
    }

    try {
      // Call resendOTP from auth context
      const response = await resendOTP(email);
      if (response) {
        const newOTP = response.data?.otp || response.otp;
        setTemporaryOTP(newOTP);
        setSuccessMessage(`✅ OTP resent! Temporary OTP for testing: ${newOTP}`);
        setResendTimer(60); // 60 second cooldown
        setOtp("");
      }
    } catch (err) {
      setLocalError(err.message || "Failed to resend OTP. Please try again.");
    }
  };

  const handleOTPChange = (e) => {
    const value = e.target.value;
    // Only allow digits, max 6
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value);
      setLocalError("");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        backgroundColor: "#0B1929",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Red Hat Text', 'Red Hat Content', sans-serif",
      }}
    >
      {/* Decorative Background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "384px",
          height: "384px",
          opacity: 0.05,
          borderRadius: "50%",
          backgroundColor: "#4CD3C8",
          transform: "translate(-50%, -50%)",
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: "320px",
          height: "320px",
          opacity: 0.05,
          borderRadius: "50%",
          backgroundColor: "#4CD3C8",
          transform: "translate(33%, 33%)",
        }}
      ></div>

      <div
        style={{
          width: "100%",
          maxWidth: "450px",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Main Card */}
        <div
          style={{
            borderRadius: "24px",
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
            padding: "48px",
            backgroundColor: "#1A2A3A",
            border: "1px solid #2A4A5A",
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div
              style={{
                fontSize: "40px",
                marginBottom: "16px",
                color: "#4CD3C8",
              }}
            >
              <i className="fa-solid fa-shield-check"></i>
            </div>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                color: "#DAFAF4",
                margin: "0 0 8px 0",
              }}
            >
              Verify OTP
            </h1>
            <p
              style={{
                fontSize: "14px",
                color: "#5DDDD2",
                margin: 0,
              }}
            >
              Enter the 6-digit code sent to
            </p>
            <p
              style={{
                fontSize: "14px",
                color: "#4CD3C8",
                margin: "8px 0 0 0",
                fontWeight: "600",
              }}
            >
              {email}
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div
              style={{
                marginBottom: "24px",
                padding: "12px 16px",
                borderRadius: "8px",
                backgroundColor: "#4CD3C812",
                borderLeft: "4px solid #4CD3C8",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <i
                style={{
                  color: "#4CD3C8",
                  fontSize: "18px",
                  flexShrink: 0,
                }}
                className="fa-solid fa-circle-check"
              ></i>
              <span style={{ color: "#4CD3C8", fontSize: "14px" }}>
                {successMessage}
              </span>
            </div>
          )}

          {/* Error Message */}
          {(localError || error) && (
            <div
              style={{
                marginBottom: "24px",
                padding: "12px 16px",
                borderRadius: "8px",
                backgroundColor: "#e6394612",
                borderLeft: "4px solid #e63946",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <i
                style={{
                  color: "#e63946",
                  fontSize: "18px",
                  flexShrink: 0,
                }}
                className="fa-solid fa-circle-exclamation"
              ></i>
              <span style={{ color: "#e63946", fontSize: "14px" }}>
                {localError || error}
              </span>
            </div>
          )}

          {/* OTP Form */}
          <form onSubmit={handleVerifyOTP} style={{ marginBottom: "24px" }}>
            {/* OTP Input */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#DAFAF4",
                  marginBottom: "12px",
                  textTransform: "uppercase",
                }}
              >
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={handleOTPChange}
                placeholder="000000"
                disabled={loading}
                maxLength="6"
                style={{
                  width: "100%",
                  padding: "16px",
                  fontSize: "32px",
                  fontWeight: "600",
                  textAlign: "center",
                  letterSpacing: "12px",
                  borderRadius: "12px",
                  border: "2px solid #2A4A5A",
                  backgroundColor: "#0f0f0f",
                  color: "#4CD3C8",
                  outline: "none",
                  transition: "all 0.3s ease",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#4CD3C8";
                  e.target.style.backgroundColor = "#1A2A3A";
                  e.target.style.boxShadow = "0 0 0 3px rgba(17, 228, 79, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#2A4A5A";
                  e.target.style.backgroundColor = "#0f0f0f";
                  e.target.style.boxShadow = "none";
                }}
              />
              <p
                style={{
                  fontSize: "12px",
                  color: "#5DDDD2",
                  marginTop: "8px",
                  margin: "8px 0 0 0",
                }}
              >
                OTP expires in 1 minute
              </p>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading || otp.length < 6}
              style={{
                width: "100%",
                padding: "14px 24px",
                backgroundColor:
                  otp.length === 6 ? "#4CD3C8" : "#2A4A5A",
                color: otp.length === 6 ? "#0B1929" : "#5DDDD2",
                fontWeight: "600",
                fontSize: "16px",
                border: "none",
                borderRadius: "10px",
                cursor:
                  loading || otp.length < 6 ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                opacity: loading ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (otp.length === 6 && !loading) {
                  e.target.style.backgroundColor = "#5DDDD2";
                }
              }}
              onMouseLeave={(e) => {
                if (otp.length === 6 && !loading) {
                  e.target.style.backgroundColor = "#4CD3C8";
                }
              }}
            >
              {loading ? (
                <>
                  <i
                    style={{ animation: "spin 1s linear infinite" }}
                    className="fa-solid fa-spinner"
                  ></i>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-check-circle"></i>
                  <span>Verify OTP</span>
                </>
              )}
            </button>
          </form>

          {/* Resend OTP Section */}
          <div
            style={{
              paddingTop: "24px",
              borderTop: "1px solid #2A4A5A",
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: "#DAFAF4",
                fontSize: "14px",
                margin: "0 0 12px 0",
              }}
            >
              Didn't receive the code?
            </p>
            <button
              onClick={handleResendOTP}
              disabled={resendTimer > 0 || loading}
              style={{
                background: "none",
                border: "none",
                color: resendTimer > 0 ? "#666666" : "#4CD3C8",
                fontSize: "14px",
                fontWeight: "600",
                cursor:
                  resendTimer > 0 || loading ? "not-allowed" : "pointer",
                textDecoration: "underline",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (resendTimer === 0 && !loading) {
                  e.target.style.color = "#5DDDD2";
                }
              }}
              onMouseLeave={(e) => {
                if (resendTimer === 0 && !loading) {
                  e.target.style.color = "#4CD3C8";
                }
              }}
            >
              {resendTimer > 0
                ? `Resend in ${resendTimer}s`
                : "Resend OTP"}
            </button>
          </div>

          {/* Change Email */}
          <div
            style={{
              paddingTop: "16px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: "#5DDDD2",
                fontSize: "12px",
                margin: 0,
              }}
            >
              Wrong email?{" "}
              <button
                onClick={() => navigate("/register")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#4CD3C8",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Go back
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "24px",
            textAlign: "center",
            color: "#5DDDD2",
            fontSize: "12px",
          }}
        >
          <p style={{ margin: 0 }}>
            Pronext © 2025 | All rights reserved
          </p>
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


