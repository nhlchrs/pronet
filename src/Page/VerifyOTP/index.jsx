import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function VerifyOTPPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOTP, loading, error, setError } = useAuth();

  const [otp, setOtp] = useState("");
  const [localError, setLocalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
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
      
      if (token) {
        setSuccessMessage("OTP verified successfully! Redirecting...");
        
        // Auto-login after OTP verification (for both registration and login flows)
        // The token is already stored by verifyOTP in AuthContext
        setTimeout(() => {
          navigate("/");
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

    if (!email) {
      setLocalError("Email not found");
      return;
    }

    try {
      // Call resendOTP from auth context
      const response = await useAuth().resendOTP(email);
      if (response) {
        setSuccessMessage("OTP resent to your email!");
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
        backgroundColor: "#121212",
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
          backgroundColor: "#11E44F",
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
          backgroundColor: "#11E44F",
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
            backgroundColor: "#1a1a1a",
            border: "1px solid #313131",
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div
              style={{
                fontSize: "40px",
                marginBottom: "16px",
                color: "#11E44F",
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
                color: "#8AFFAC",
                margin: 0,
              }}
            >
              Enter the 6-digit code sent to
            </p>
            <p
              style={{
                fontSize: "14px",
                color: "#11E44F",
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
                backgroundColor: "#0f6d4612",
                borderLeft: "4px solid #11E44F",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <i
                style={{
                  color: "#11E44F",
                  fontSize: "18px",
                  flexShrink: 0,
                }}
                className="fa-solid fa-circle-check"
              ></i>
              <span style={{ color: "#11E44F", fontSize: "14px" }}>
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
                  border: "2px solid #313131",
                  backgroundColor: "#0f0f0f",
                  color: "#11E44F",
                  outline: "none",
                  transition: "all 0.3s ease",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#11E44F";
                  e.target.style.backgroundColor = "#1a1a1a";
                  e.target.style.boxShadow = "0 0 0 3px rgba(17, 228, 79, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#313131";
                  e.target.style.backgroundColor = "#0f0f0f";
                  e.target.style.boxShadow = "none";
                }}
              />
              <p
                style={{
                  fontSize: "12px",
                  color: "#8AFFAC",
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
                  otp.length === 6 ? "#11E44F" : "#313131",
                color: otp.length === 6 ? "#121212" : "#8AFFAC",
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
                  e.target.style.backgroundColor = "#8AFFAC";
                }
              }}
              onMouseLeave={(e) => {
                if (otp.length === 6 && !loading) {
                  e.target.style.backgroundColor = "#11E44F";
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
              borderTop: "1px solid #313131",
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
                color: resendTimer > 0 ? "#666666" : "#11E44F",
                fontSize: "14px",
                fontWeight: "600",
                cursor:
                  resendTimer > 0 || loading ? "not-allowed" : "pointer",
                textDecoration: "underline",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (resendTimer === 0 && !loading) {
                  e.target.style.color = "#8AFFAC";
                }
              }}
              onMouseLeave={(e) => {
                if (resendTimer === 0 && !loading) {
                  e.target.style.color = "#11E44F";
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
                color: "#8AFFAC",
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
                  color: "#11E44F",
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
            color: "#8AFFAC",
            fontSize: "12px",
          }}
        >
          <p style={{ margin: 0 }}>
            ProNext © 2025 | All rights reserved
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
