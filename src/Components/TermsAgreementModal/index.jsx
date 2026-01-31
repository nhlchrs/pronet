import React, { useState, useEffect } from "react";
import { authAPI } from "../../services/api";

const TermsAgreementModal = ({ user, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAgree = async () => {
    setLoading(true);
    setError("");

    try {
      // Call API to save agreement
      const response = await authAPI.agreeToTerms();
      console.log("Agreement saved:", response);
      
      // Verify the response indicates success
      if (response.status === 1 || response.data) {
        // Close modal on success
        onClose();
      } else {
        throw new Error("Failed to save agreement");
      }
    } catch (err) {
      console.error("Error saving agreement:", err);
      setError(err.message || "Failed to save agreement. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px',
      fontFamily: "'Red Hat Text', 'Red Hat Content', sans-serif"
    }}>
      <div style={{
        backgroundColor: '#1a1a1a',
        borderRadius: '16px',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #313131',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #313131'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: '700',
            color: '#DAFAF4'
          }}>
            Terms & Conditions Agreement
          </h2>
          <p style={{
            margin: '8px 0 0 0',
            fontSize: '14px',
            color: '#8AFFAC'
          }}>
            Please read and accept our terms to continue
          </p>
        </div>

        {/* Content */}
        <div style={{
          padding: '24px',
          overflowY: 'auto',
          flex: 1,
          color: '#DAFAF4'
        }}>
          <div style={{ lineHeight: '1.8', fontSize: '14px' }}>
            <p style={{ marginBottom: '16px' }}>
              Welcome to ProNet Solutions! By accessing and using our platform, you agree to comply with and be bound by the following terms and conditions.
            </p>

            <h3 style={{ color: '#11E44F', fontSize: '16px', marginTop: '20px', marginBottom: '12px' }}>
              1. Educational Purpose Only
            </h3>
            <p style={{ marginBottom: '16px' }}>
              ProNet Solutions provides educational content for financial markets and fintech learning. We do not provide financial advice, investment recommendations, or guaranteed returns.
            </p>

            <h3 style={{ color: '#11E44F', fontSize: '16px', marginTop: '20px', marginBottom: '12px' }}>
              2. User Responsibilities
            </h3>
            <p style={{ marginBottom: '16px' }}>
              You agree to use our services lawfully, maintain respectful conduct, and accept full responsibility for any financial decisions made based on our educational content.
            </p>

            <h3 style={{ color: '#11E44F', fontSize: '16px', marginTop: '20px', marginBottom: '12px' }}>
              3. Risk Acknowledgment
            </h3>
            <p style={{ marginBottom: '16px' }}>
              Trading and investing involve substantial financial risk. You acknowledge that losses can occur, and ProNet Solutions is not liable for any financial outcomes.
            </p>

            <h3 style={{ color: '#11E44F', fontSize: '16px', marginTop: '20px', marginBottom: '12px' }}>
              4. Intellectual Property
            </h3>
            <p style={{ marginBottom: '16px' }}>
              All content provided is the exclusive property of ProNet Solutions. Unauthorized reproduction, distribution, or sharing is prohibited.
            </p>

            <h3 style={{ color: '#11E44F', fontSize: '16px', marginTop: '20px', marginBottom: '12px' }}>
              5. Payments & Refunds
            </h3>
            <p style={{ marginBottom: '16px' }}>
              All fees are non-refundable unless explicitly stated. Access may be terminated for policy violations.
            </p>

            <div style={{
              marginTop: '24px',
              padding: '16px',
              backgroundColor: '#2a2a2a',
              borderRadius: '8px',
              border: '1px solid #313131'
            }}>
              <p style={{ margin: 0, fontSize: '13px', color: '#8AFFAC' }}>
                For complete terms, please visit: <a href="/terms" target="_blank" style={{ color: '#11E44F', textDecoration: 'underline' }}>Terms & Conditions</a>, <a href="/disclaimer" target="_blank" style={{ color: '#11E44F', textDecoration: 'underline' }}>Disclaimer</a>, and <a href="/agreement" target="_blank" style={{ color: '#11E44F', textDecoration: 'underline' }}>User Agreement</a>
              </p>
            </div>
          </div>

          {error && (
            <div style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: '#e6394612',
              border: '1px solid #e63946',
              borderRadius: '8px',
              color: '#e63946',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '24px',
          borderTop: '1px solid #313131',
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={handleAgree}
            disabled={loading}
            style={{
              padding: '12px 32px',
              backgroundColor: '#11E44F',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#0fc944')}
            onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#11E44F')}
          >
            {loading ? 'Saving...' : 'I Agree to Terms & Conditions'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsAgreementModal;
