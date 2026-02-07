import { useState } from 'react';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { teamAPI } from '../../services/api';
import './JoinTeam.css';

export const JoinTeam = ({ isActive }) => {
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [referrerInfo, setReferrerInfo] = useState(null);

  const handleCodeChange = (e) => {
    const value = e.target.value.toUpperCase();
    setReferralCode(value);
    setError('');
    setReferrerInfo(null);
  };

  const validateCode = async () => {
    if (!referralCode.trim()) {
      setError('Please enter a referral code');
      return;
    }

    try {
      setLoading(true);
      const response = await teamAPI.validateReferralCode(referralCode);

      if (response.success) {
        setReferrerInfo(response.data);
        setError('');
      } else {
        setError(response.message || 'Invalid referral code');
        setReferrerInfo(null);
      }
    } catch (err) {
      setError('Failed to validate code');
      setReferrerInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCode = async () => {
    if (!referrerInfo) {
      setError('Please validate a code first');
      return;
    }

    try {
      setLoading(true);

      // Initialize team membership first
      await teamAPI.initializeMembership();

      // Then apply referral code
      const response = await teamAPI.applyReferralCode(referralCode);

      if (response.success) {
        setSuccess(true);
        setReferralCode('');
        setReferrerInfo(null);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setError(response.message || 'Failed to join team');
      }
    } catch (err) {
      setError('Failed to join team');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="join-team-container">
        <div className="success-message">
          <CheckCircle className="success-icon" />
          <h3>Successfully Joined Team!</h3>
          <p>You've been added to the referral network. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="join-team-container">
      <div className="join-card">
        <h2>Join a Team</h2>
        <p className="subtitle">
          Enter a referral code to join someone's network and start earning
        </p>

        {/* Code Input Section */}
        <div className="input-section">
          <div className="input-group">
            <label htmlFor="referral-code">Referral Code</label>
            <div className="input-with-button">
              <input
                id="referral-code"
                type="text"
                placeholder="e.g., PRO-XXXXX-XXXXXXXX"
                value={referralCode}
                onChange={handleCodeChange}
                disabled={loading || success}
                maxLength="25"
              />
              <button
                className="validate-btn"
                onClick={validateCode}
                disabled={!referralCode.trim() || loading}
              >
                {loading ? (
                  <>
                    <Loader className="spinner" size={18} />
                    Validating...
                  </>
                ) : (
                  'Validate'
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Referrer Info Card */}
        {referrerInfo && (
          <div className="referrer-card">
            <h3>Your Sponsor</h3>
            <div className="referrer-info">
              <div className="info-row">
                <span className="label">Name:</span>
                <span className="value">{referrerInfo.referrerName}</span>
              </div>
              <div className="info-row">
                <span className="label">Level:</span>
                <span className="value level">Level {referrerInfo.referrerLevel}</span>
              </div>
              <div className="info-row">
                <span className="label">Direct Referrals:</span>
                <span className="value">{referrerInfo.directCount || 0} members</span>
              </div>
              <div className="info-row">
                <span className="label">Status:</span>
                <span className="value active">Active</span>
              </div>
            </div>

            <div className="action-buttons">
              <button
                className="join-btn"
                onClick={handleApplyCode}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="spinner" size={18} />
                    Joining...
                  </>
                ) : (
                  'Join This Team'
                )}
              </button>
              <button
                className="cancel-btn"
                onClick={() => {
                  setReferralCode('');
                  setReferrerInfo(null);
                  setError('');
                }}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="instructions-section">
          <h3>How It Works</h3>
          <div className="steps">
            <div className="step">
              <span className="step-number">1</span>
              <div className="step-content">
                <h4>Get a Code</h4>
                <p>
                  Ask your friend or sponsor for their referral code
                </p>
              </div>
            </div>
            <div className="step">
              <span className="step-number">2</span>
              <div className="step-content">
                <h4>Enter & Validate</h4>
                <p>
                  Paste the code here and click validate to confirm
                </p>
              </div>
            </div>
            <div className="step">
              <span className="step-number">3</span>
              <div className="step-content">
                <h4>Join the Network</h4>
                <p>
                  Click join to become part of their referral team
                </p>
              </div>
            </div>
            <div className="step">
              <span className="step-number">4</span>
              <div className="step-content">
                <h4>Start Earning</h4>
                <p>
                  Build your network and earn commissions from your team
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Card */}
        <div className="benefits-card">
          <h3>Benefits of Joining</h3>
          <ul className="benefits-list">
            <li>
              <span className="icon">🎯</span>
              <span>Earn commissions from your direct referrals</span>
            </li>
            <li>
              <span className="icon">📈</span>
              <span>Build a network and unlock higher levels</span>
            </li>
            <li>
              <span className="icon">💰</span>
              <span>Level-based income from your entire downline</span>
            </li>
            <li>
              <span className="icon">🏆</span>
              <span>Unlock exclusive rewards at each level</span>
            </li>
            <li>
              <span className="icon">📊</span>
              <span>Track your team growth and earnings in real-time</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default JoinTeam;


