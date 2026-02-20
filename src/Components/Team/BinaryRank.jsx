import React from 'react';
import './BinaryRank.css';

const BinaryRank = ({ binaryRank, directReferrals }) => {
  if (!binaryRank) return null;

  const {
    activated,
    currentRank,
    rankBadge,
    bonusPercent,
    weakerLegPV,
    commission,
    totalActiveAffiliates,
    nextRank,
    nextBonusPercent,
    affiliatesNeeded,
    needsMoreReferrals,
    referralsNeeded,
  } = binaryRank;

  // Rank colors
  const rankColors = {
    NONE: '#9CA3AF',
    IGNITOR: '#EF4444',
    SPARK: '#F59E0B',
    RISER: '#10B981',
    PIONEER: '#3B82F6',
    INNOVATOR: '#6366F1',
    TRAILBLAZER: '#8B5CF6',
    CATALYST: '#A855F7',
    MOGUL: '#EC4899',
    VANGUARD: '#F43F5E',
    LUMINARY: '#FCD34D',
    SOVEREIGN: '#FDE047',
    ZENITH: '#FFD700',
  };

  const currentColor = rankColors[currentRank] || '#9CA3AF';

  return (
    <div className="binary-rank-container">
      {/* Header */}
      <div className="binary-rank-header">
        <h3>💎 Binary Rank System</h3>
      </div>

      {/* Binary Commission Not Activated Warning */}
      {needsMoreReferrals && (
        <div className="activation-warning">
          <div className="warning-icon">🔒</div>
          <div className="warning-content">
            <h4>Binary Commission Not Activated</h4>
            <p>
              You need <strong>{referralsNeeded} more direct referrals</strong> to activate binary commission earnings.
            </p>
            <p style={{ fontSize: '14px', marginTop: '8px', opacity: 0.9 }}>
              <em>Note: You can still achieve ranks and claim rewards based on your active affiliates!</em>
            </p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(directReferrals / 10) * 100}%` }}
              />
            </div>
            <p className="progress-text">
              {directReferrals} / 10 Direct Referrals
            </p>
          </div>
        </div>
      )}

      {/* Current Rank Display */}
      {activated && (
        <>
          <div className="current-rank-card" style={{ borderColor: currentColor }}>
            <div className="rank-badge" style={{ background: currentColor }}>
              <span className="rank-emoji">{rankBadge}</span>
              <span className="rank-name">{currentRank}</span>
            </div>
            <div className="rank-details">
              <div className="detail-item">
                <span className="detail-label">Binary Bonus:</span>
                <span className="detail-value highlight">{bonusPercent}%</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Active Affiliates:</span>
                <span className="detail-value">{totalActiveAffiliates?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Commission Info */}
          <div className="commission-card">
            <h4>💰 Binary Commission</h4>
            <div className="commission-grid">
              <div className="commission-item">
                <span className="commission-label">Weaker Leg PV:</span>
                <span className="commission-value">{weakerLegPV || 0}</span>
              </div>
              <div className="commission-item">
                <span className="commission-label">Bonus Rate:</span>
                <span className="commission-value">{bonusPercent}%</span>
              </div>
              <div className="commission-item total">
                <span className="commission-label">Commission Earned:</span>
                <span className="commission-value highlight">${commission?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
            <div className="commission-note">
              <p>💡 Commission is calculated on your <strong>weaker leg</strong> (smaller PV). Balance your team for maximum earnings!</p>
            </div>
          </div>

          {/* Next Rank Progress */}
          {nextRank && (
            <div className="next-rank-card">
              <h4>🎯 Next Rank Progress</h4>
              <div className="next-rank-info">
                <div className="next-rank-name">
                  <span>Target: </span>
                  <strong>{nextRank}</strong>
                  <span className="next-bonus"> ({nextBonusPercent}% bonus)</span>
                </div>
                <div className="progress-info">
                  <p>
                    <strong>{affiliatesNeeded?.toLocaleString()}</strong> more active affiliates needed
                  </p>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${Math.min(
                          ((totalActiveAffiliates / (totalActiveAffiliates + affiliatesNeeded)) * 100),
                          100
                        )}%`,
                        background: currentColor,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Rank Table */}
      <div className="rank-table-container">
        <h4>📊 All Ranks</h4>
        <div className="rank-table">
          <div className="rank-table-header">
            <span>Rank</span>
            <span>Affiliates</span>
            <span>Bonus</span>
          </div>
          {[
            { name: 'IGNITOR', min: 3, bonus: 10, badge: '🔥' },
            { name: 'SPARK', min: 12, bonus: 10, badge: '⚡' },
            { name: 'RISER', min: 40, bonus: 10, badge: '📈' },
            { name: 'PIONEER', min: 120, bonus: 10, badge: '🎖️' },
            { name: 'INNOVATOR', min: 250, bonus: 10, badge: '💡' },
            { name: 'TRAILBLAZER', min: 500, bonus: 15, badge: '🏆' },
            { name: 'CATALYST', min: 1111, bonus: 15, badge: '⭐' },
            { name: 'MOGUL', min: 2777, bonus: 15, badge: '💎' },
            { name: 'VANGUARD', min: 5555, bonus: 15, badge: '🛡️' },
            { name: 'LUMINARY', min: 11111, bonus: 20, badge: '✨' },
            { name: 'SOVEREIGN', min: 22222, bonus: 20, badge: '👑' },
            { name: 'ZENITH', min: 44444, bonus: 20, badge: '🌟' },
          ].map((rank) => (
            <div
              key={rank.name}
              className={`rank-table-row ${currentRank === rank.name ? 'current' : ''}`}
            >
              <span className="rank-cell">
                <span className="rank-emoji">{rank.badge}</span>
                {rank.name}
              </span>
              <span className="rank-cell">{rank.min.toLocaleString()}+</span>
              <span className="rank-cell">{rank.bonus}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BinaryRank;
