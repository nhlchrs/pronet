import { useState } from 'react';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { teamAPI } from '../../services/api';
import './JoinTeam.css';

export const JoinTeam = ({ isActive, onSuccess }) => {
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
        // Check if this is post-2:2 direct placement
        const has2x2Achieved = response.message && response.message.includes('2:2');
        
        if (response.isAvailable === false) {
          // One leg is full, other is available (during initial 2:2 building)
          const positionName = response.position === 'left' ? 'Left (LPRO)' : response.position === 'right' ? 'Right (RPRO)' : response.position;
          const otherLeg = response.position === 'left' ? 'Right (RPRO)' : response.position === 'right' ? 'Left (LPRO)' : 'other';
          setError(`⚠️ The ${positionName} leg is full (${response.currentCount}/2 members). Please ask your sponsor for the ${otherLeg} code instead.`);
          setReferrerInfo(null);
        } else {
          // Normal placement - leg is available
          setReferrerInfo({
            sponsor: response.sponsor,
            position: response.position,
            isAvailable: response.isAvailable,
            currentCount: response.currentCount,
            has2x2Achieved: has2x2Achieved,
            specialMessage: has2x2Achieved ? response.message : null,
            referrerName: response.sponsor?.userId?.fname 
              ? `${response.sponsor.userId.fname} ${response.sponsor.userId.lname || ''}`
              : 'Team Member',
            referrerLevel: response.sponsor?.level || 0,
            directCount: response.sponsor?.directCount || 0,
          });
          setError('');
        }
      } else {
        // Handle backend error messages (like leg full)
        if (response.legFull) {
          const positionName = response.position === 'left' ? 'Left (LPRO)' : response.position === 'right' ? 'Right (RPRO)' : response.position;
          const otherLeg = response.position === 'left' ? 'Right (RPRO)' : response.position === 'right' ? 'Left (LPRO)' : 'other';
          setError(`🔒 ${positionName} leg is FULL (${response.currentCount}/2). Please contact your sponsor to get the ${otherLeg} code.`);
        } else {
          setError(response.message || 'Invalid referral code');
        }
        setReferrerInfo(null);
      }
    } catch (err) {
      console.log('Validation Error:', err);
      
      const errorMsg = err.message || 'Failed to validate code';
      const errorData = err.data; // Access error data directly from error object
      
      // Check if error is about leg being full
      if (errorData?.legFull || errorData?.position) {
        const positionName = errorData.position === 'left' ? 'Left (LPRO)' : errorData.position === 'right' ? 'Right (RPRO)' : errorData.position;
        const otherLeg = errorData.position === 'left' ? 'Right (RPRO)' : errorData.position === 'right' ? 'Left (LPRO)' : 'other';
        
        // Check if we have currentCount for more detailed message
        if (errorData.currentCount !== undefined) {
          setError(`🔒 ${positionName} leg is FULL (${errorData.currentCount}/2). Please contact your sponsor to get the ${otherLeg} code.`);
        } else {
          setError(`🔒 ${positionName} leg is FULL. Please contact your sponsor to get the ${otherLeg} code.`);
        }
      } else {
        // Show the error message from backend
        setError(`⚠️ ${errorMsg}`);
      }
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
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }
        
        // Reload page after short delay to show success message
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setError(response.message || 'Failed to join team');
      }
    } catch (err) {
      console.log('Apply Code Error:', err);
      const errorMsg = err.message || 'Failed to join team';
      setError(`⚠️ ${errorMsg}`);
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
            {/* Show special message when 2:2 is achieved */}
            {referrerInfo.has2x2Achieved && (
              <div className="info-box success-box">
                <div className="info-icon">✅</div>
                <h4>Direct Placement - 2:2 Achieved!</h4>
                <p>{referrerInfo.specialMessage}</p>
                <div className="info-note">
                  <strong>Note:</strong> Your sponsor has completed their initial 2:2 structure. 
                  All new members join as direct referrals - no spillover needed!
                </div>
              </div>
            )}

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
              {referrerInfo.position && (
                <div className="info-row">
                  <span className="label">Position:</span>
                  <span className={`value position-${referrerInfo.position}`}>
                    {referrerInfo.position === 'left' && '⬅️ Left Leg (Lpro)'}
                    {referrerInfo.position === 'right' && '➡️ Right Leg (Rpro)'}
                    {referrerInfo.position === 'main' && '🔑 Main Team'}
                  </span>
                </div>
              )}
              {referrerInfo.position !== 'main' && (
                <div className="info-row">
                  <span className="label">Leg Status:</span>
                  <span className="value">
                    {referrerInfo.has2x2Achieved 
                      ? `${referrerInfo.currentCount || 0} members (2:2 achieved ✨)` 
                      : `${referrerInfo.currentCount || 0}/2 members${referrerInfo.isAvailable ? ' ✅ Available' : ''}`
                    }
                  </span>
                </div>
              )}
              {referrerInfo.has2x2Achieved && (
                <div className="info-row">
                  <span className="label">Placement Type:</span>
                  <span className="value">🎯 Direct Referral (Post 2:2)</span>
                </div>
              )}
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


