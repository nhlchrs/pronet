import { useState, useEffect } from 'react';
import { Copy, Check, AlertCircle, Loader } from 'lucide-react';
import { teamAPI } from '../../services/api';
import './ReferralCode.css';

export const ReferralCode = ({ isActive }) => {
  const [referralData, setReferralData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedCode, setCopiedCode] = useState(null); // Track which code was copied

  // Trigger API call when tab becomes active
  useEffect(() => {
    if (isActive) {
      console.log('ReferralCode tab is active - triggering API calls');
      initializeAndFetch();
    }
  }, [isActive]);

  const initializeAndFetch = async () => {
    try {
      setLoading(true);
      setError('');

      // First, initialize team membership if needed
      await teamAPI.initializeMembership();

      // Then fetch referral code
      await fetchReferralCode();
    } catch (err) {
      console.error('Initialization error:', err);
      setError('Failed to load referral code');
      setLoading(false);
    }
  };

  const fetchReferralCode = async () => {
    try {
      const response = await teamAPI.getMyReferralCode();

      if (response.success) {
        setReferralData(response.data);
        setError('');
      } else {
        setError(response.message || 'Could not load referral code');
      }
    } catch (err) {
      setError('Failed to load referral code');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async (text, codeType) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(codeType);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) {
    return (
      <div className="referral-code-container">
        <div className="loading">
          <Loader className="spinner" />
          <p>Loading your referral code...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="referral-code-container">
        <div className="error-box">
          <AlertCircle className="error-icon" />
          <p className="error-message">{error}</p>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
            💡 Tip: You need to join a team first to get your referral code. Ask your team sponsor or administrator.
          </p>
        </div>
      </div>
    );
  }

  if (!referralData) {
    return null;
  }

  return (
    <div className="referral-code-container">
      {/* Main Referral Code Card - COMMENTED OUT */}
      {/* <div className="code-card">
        <h3>🔑 Main Referral Code</h3>
        <p className="code-description">General team invitation code</p>
        <div className="code-display">
          <div className="code-box">
            <code className="code-text">{referralData.referralCode}</code>
          </div>
          <button
            className="copy-btn"
            onClick={() => handleCopyCode(referralData.referralCode, 'main')}
          >
            {copiedCode === 'main' ? (
              <>
                <Check size={16} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={16} />
                Copy
              </>
            )}
          </button>
        </div>
        <div className="link-display-small">
          <input
            type="text"
            readOnly
            value={referralData.referralLink}
            className="link-input-small"
          />
          <button
            className="copy-btn-small"
            onClick={() => handleCopyCode(referralData.referralLink, 'main-link')}
          >
            {copiedCode === 'main-link' ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
      </div> */}

      {/* Left Team Code Card */}
      <div className={`code-card left-code ${referralData.binaryTree?.leftLegFull ? 'leg-full' : ''}`}>
        <div className="card-header-with-status">
          <h3>🔑 Left Team Code (Lpro)</h3>
          {referralData.binaryTree && (
            <span className={`leg-status ${referralData.binaryTree.lproAvailable ? 'status-active' : 'status-full'}`}>
              {referralData.binaryTree.lproAvailable ? 
                `✅ Active (${referralData.binaryTree.leftLegCount || 0}/2)` : 
                '🔒 Full (2/2)'}
            </span>
          )}
        </div>
        <p className="code-description">For left position members</p>
        {referralData.binaryTree && !referralData.binaryTree.lproAvailable && (
          <div className="code-warning">
            ⚠️ Left leg is full. Direct new members to use your RPRO code instead.
          </div>
        )}
        <div className="code-display">
          <div className="code-box">
            <code className="code-text">{referralData.leftReferralCode}</code>
          </div>
          <button
            className="copy-btn"
            onClick={() => handleCopyCode(referralData.leftReferralCode, 'left')}
            disabled={referralData.binaryTree && !referralData.binaryTree.lproAvailable}
          >
            {copiedCode === 'left' ? (
              <>
                <Check size={16} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={16} />
                Copy
              </>
            )}
          </button>
        </div>
        {referralData.binaryTree && referralData.binaryTree.lproAvailable && (
          <div className="link-display-small">
            <input
              type="text"
              readOnly
              value={referralData.leftReferralLink}
              className="link-input-small"
            />
            <button
              className="copy-btn-small"
              onClick={() => handleCopyCode(referralData.leftReferralLink, 'left-link')}
            >
              {copiedCode === 'left-link' ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        )}
      </div>

      {/* Right Team Code Card */}
      <div className={`code-card right-code ${referralData.binaryTree?.rightLegFull ? 'leg-full' : ''}`}>
        <div className="card-header-with-status">
          <h3>🔑 Right Team Code (Rpro)</h3>
          {referralData.binaryTree && (
            <span className={`leg-status ${referralData.binaryTree.rproAvailable ? 'status-active' : 'status-full'}`}>
              {referralData.binaryTree.rproAvailable ? 
                `✅ Active (${referralData.binaryTree.rightLegCount || 0}/2)` : 
                '🔒 Full (2/2)'}
            </span>
          )}
        </div>
        <p className="code-description">For right position members</p>
        {referralData.binaryTree && !referralData.binaryTree.rproAvailable && (
          <div className="code-warning">
            ⚠️ Right leg is full. Direct new members to use your LPRO code instead.
          </div>
        )}
        <div className="code-display">
          <div className="code-box">
            <code className="code-text">{referralData.rightReferralCode}</code>
          </div>
          <button
            className="copy-btn"
            onClick={() => handleCopyCode(referralData.rightReferralCode, 'right')}
            disabled={referralData.binaryTree && !referralData.binaryTree.rproAvailable}
          >
            {copiedCode === 'right' ? (
              <>
                <Check size={16} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={16} />
                Copy
              </>
            )}
          </button>
        </div>
        {referralData.binaryTree && referralData.binaryTree.rproAvailable && (
          <div className="link-display-small">
            <input
              type="text"
              readOnly
              value={referralData.rightReferralLink}
              className="link-input-small"
            />
            <button
              className="copy-btn-small"
              onClick={() => handleCopyCode(referralData.rightReferralLink, 'right-link')}
            >
              {copiedCode === 'right-link' ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        )}
      </div>

      {/* Binary Tree Status Card */}
      {referralData.binaryTree && (
        <div className="binary-tree-status">
          <h3>🌳 Binary Tree Status</h3>
          <div className="binary-status-grid">
            <div className="binary-leg-info left-leg">
              <div className="leg-header">
                <span className="leg-icon">⬅️</span>
                <span className="leg-title">Left Leg</span>
              </div>
              <div className="leg-stats">
                <div className="leg-count">
                  <span className="count-number">{referralData.binaryTree.leftLegCount || 0}</span>
                  <span className="count-label">/ 2 Members</span>
                </div>
                <div className="leg-pv">
                  <span className="pv-label">PV:</span>
                  <span className="pv-value">{referralData.binaryTree.leftLegPV || 0}</span>
                </div>
                <div className={`leg-availability ${referralData.binaryTree.lproAvailable ? 'available' : 'full'}`}>
                  {referralData.binaryTree.lproAvailable ? '✅ Available' : '🔒 Full'}
                </div>
              </div>
            </div>
            <div className="binary-leg-info right-leg">
              <div className="leg-header">
                <span className="leg-icon">➡️</span>
                <span className="leg-title">Right Leg</span>
              </div>
              <div className="leg-stats">
                <div className="leg-count">
                  <span className="count-number">{referralData.binaryTree.rightLegCount || 0}</span>
                  <span className="count-label">/ 2 Members</span>
                </div>
                <div className="leg-pv">
                  <span className="pv-label">PV:</span>
                  <span className="pv-value">{referralData.binaryTree.rightLegPV || 0}</span>
                </div>
                <div className={`leg-availability ${referralData.binaryTree.rproAvailable ? 'available' : 'full'}`}>
                  {referralData.binaryTree.rproAvailable ? '✅ Available' : '🔒 Full'}
                </div>
              </div>
            </div>
          </div>
          <div className="binary-info-note">
            <p>📊 <strong>Binary System:</strong> Each leg can have maximum 2 direct members. When a leg is full, that code becomes inactive and members must use the other leg code.</p>
            <p>💰 <strong>Binary Bonus:</strong> Earned based on your weaker leg's Point Value (PV). Balance your team for maximum earnings!</p>
          </div>
        </div>
      )}

      {/* Position Information Card */}
      {referralData.stats.userPosition && (
        <div className="position-info-card">
          <h3>🔍 Your Position</h3>
          <div className="position-display">
            {referralData.stats.userPosition === 'left' && (
              <div className="position-badge position-left">
                <span>â¬…ï¸ Left Position (Lpro)</span>
              </div>
            )}
            {referralData.stats.userPosition === 'right' && (
              <div className="position-badge position-right">
                <span>âž¡ï¸ Right Position (Rpro)</span>
              </div>
            )}
            {referralData.stats.userPosition === 'main' && (
              <div className="position-badge position-main">
                <span>🔑 Main Position</span>
              </div>
            )}
          </div>
          <p className="position-note">
            You joined the team through the {referralData.stats.userPosition === 'left' ? 'Left (Lpro)' : referralData.stats.userPosition === 'right' ? 'Right (Rpro)' : 'Main'} referral code
          </p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Direct Referrals</div>
          <div className="stat-value">{referralData.stats.directCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Downline</div>
          <div className="stat-value">{referralData.stats.totalDownline}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Your Level</div>
          <div className="stat-value">Level {referralData.stats.level}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Earnings</div>
          <div className="stat-value">
            ${(referralData.stats.totalEarnings || 0).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Team Position Breakdown */}
      {(referralData.stats.mainTeamCount || referralData.stats.leftTeamCount || referralData.stats.rightTeamCount) > 0 && (
        <div className="team-breakdown">
          <h3>👥 Your Team Breakdown</h3>
          <div className="breakdown-grid">
            {referralData.stats.mainTeamCount > 0 && (
              <div className="breakdown-card breakdown-main">
                <div className="breakdown-emoji">🔑</div>
                <div className="breakdown-label">Main Team</div>
                <div className="breakdown-count">{referralData.stats.mainTeamCount}</div>
                <div className="breakdown-percent">
                  {referralData.stats.directCount > 0 
                    ? Math.round((referralData.stats.mainTeamCount / referralData.stats.directCount) * 100) 
                    : 0}%
                </div>
              </div>
            )}
            {referralData.stats.leftTeamCount > 0 && (
              <div className="breakdown-card breakdown-left">
                <div className="breakdown-emoji">â¬…ï¸</div>
                <div className="breakdown-label">Left Team (Lpro)</div>
                <div className="breakdown-count">{referralData.stats.leftTeamCount}</div>
                <div className="breakdown-percent">
                  {referralData.stats.directCount > 0 
                    ? Math.round((referralData.stats.leftTeamCount / referralData.stats.directCount) * 100) 
                    : 0}%
                </div>
              </div>
            )}
            {referralData.stats.rightTeamCount > 0 && (
              <div className="breakdown-card breakdown-right">
                <div className="breakdown-emoji">âž¡ï¸</div>
                <div className="breakdown-label">Right Team (Rpro)</div>
                <div className="breakdown-count">{referralData.stats.rightTeamCount}</div>
                <div className="breakdown-percent">
                  {referralData.stats.directCount > 0 
                    ? Math.round((referralData.stats.rightTeamCount / referralData.stats.directCount) * 100) 
                    : 0}%
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sponsor Info */}
      {referralData.sponsor && (
        <div className="sponsor-info">
          <p className="sponsor-label">Your Sponsor</p>
          <p className="sponsor-name">{referralData.sponsor.name}</p>
        </div>
      )}

      {/* Share Instructions */}
      <div className="instructions">
        <h4>How to Share:</h4>
        <ul>
          <li>📄 <strong>Main Code:</strong> For general team invitations</li>
          <li>⬅️ <strong>Left Code (Lpro):</strong> Place members on your left team</li>
          <li>➡️ <strong>Right Code (Rpro):</strong> Place members on your right team</li>
          <li>💰 You earn bonuses from their activity</li>
          <li>🚀 Your team grows with every referral!</li>
        </ul>
      </div>
    </div>
  );
};

export default ReferralCode;


