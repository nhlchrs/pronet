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
    leftLegCount = 0,
    rightLegCount = 0,
    leftLegPV = 0,
    rightLegPV = 0,
  } = binaryRank;

  // Check 2:1 or 1:2 activation ratio
  const meetsActivationRatio = (leftLegCount >= 2 && rightLegCount >= 1) || (leftLegCount >= 1 && rightLegCount >= 2);
  const isActivationComplete = meetsActivationRatio;

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
      {!isActivationComplete && (
        <div className="activation-warning">
          <div className="warning-icon">🔒</div>
          <div className="warning-content">
            <h4>Binary Commission Not Activated</h4>
            <p>
              <strong>Activation Requirement: 2:1 or 1:2 Ratio</strong>
            </p>
            <p style={{ fontSize: '15px', marginTop: '8px' }}>
              You need <strong>either 2 members in one leg + 1 in the other, or 1 member in one leg + 2 in the other</strong> to activate binary matching.
            </p>
            <div style={{ marginTop: '16px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: (leftLegCount >= 2 && rightLegCount >= 1) || (leftLegCount >= 1 && rightLegCount >= 2) ? '#10B981' : '#F59E0B' }}>
                  {leftLegCount}
                </div>
                <div style={{ fontSize: '12px', marginTop: '4px' }}>Left Leg</div>
                <div style={{ fontSize: '10px', opacity: 0.8 }}>{leftLegCount >= 1 ? '✓' : 'Need 1+'}</div>
              </div>
              <div style={{ fontSize: '24px', alignSelf: 'center', opacity: 0.5 }}>×</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: (leftLegCount >= 2 && rightLegCount >= 1) || (leftLegCount >= 1 && rightLegCount >= 2) ? '#10B981' : '#F59E0B' }}>
                  {rightLegCount}
                </div>
                <div style={{ fontSize: '12px', marginTop: '4px' }}>Right Leg</div>
                <div style={{ fontSize: '10px', opacity: 0.8 }}>{rightLegCount >= 1 ? '✓' : 'Need 1+'}</div>
              </div>
            </div>
            <p style={{ fontSize: '13px', marginTop: '16px', opacity: 0.9 }}>
              <em>📌 Note: You can still achieve ranks and claim rewards based on your active affiliates!</em>
            </p>
          </div>
        </div>
      )}

      {/* Current Rank Display */}
      {isActivationComplete && (
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

          {/* Leg Performance Display */}
          <div className="commission-card" style={{ marginTop: '20px' }}>
            <h4>📊 Binary Tree Legs Performance</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '16px' }}>
              {/* Left Leg */}
              <div style={{ 
                padding: '16px', 
                borderRadius: '8px', 
                border: `2px solid ${leftLegPV < rightLegPV ? '#F59E0B' : '#10B981'}`,
                backgroundColor: leftLegPV < rightLegPV ? 'rgba(251, 146, 60, 0.1)' : 'rgba(16, 185, 129, 0.1)'
              }}>
                <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                  <div style={{ fontSize: '24px', marginBottom: '4px' }}>⬅️</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1F2937', marginBottom: '4px' }}>
                    Left Leg
                    {leftLegPV < rightLegPV && leftLegPV > 0 && (
                      <span style={{ marginLeft: '8px', fontSize: '14px', color: '#F59E0B' }}>⚡ Weaker</span>
                    )}
                    {leftLegPV === rightLegPV && leftLegPV > 0 && (
                      <span style={{ marginLeft: '8px', fontSize: '14px', color: '#10B981' }}>⚖️ Balanced</span>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#0D9488', marginBottom: '4px' }}>Members</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1F2937', marginBottom: '12px' }}>{leftLegCount}</div>
                  <div style={{ fontSize: '12px', color: '#0D9488', marginBottom: '4px' }}>Point Value (PV)</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0F766E' }}>{leftLegPV || 0}</div>
                </div>
              </div>

              {/* Right Leg */}
              <div style={{ 
                padding: '16px', 
                borderRadius: '8px', 
                border: `2px solid ${rightLegPV < leftLegPV ? '#F59E0B' : '#10B981'}`,
                backgroundColor: rightLegPV < leftLegPV ? 'rgba(251, 146, 60, 0.1)' : 'rgba(16, 185, 129, 0.1)'
              }}>
                <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                  <div style={{ fontSize: '24px', marginBottom: '4px' }}>➡️</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1F2937', marginBottom: '4px' }}>
                    Right Leg
                    {rightLegPV < leftLegPV && rightLegPV > 0 && (
                      <span style={{ marginLeft: '8px', fontSize: '14px', color: '#F59E0B' }}>⚡ Weaker</span>
                    )}
                    {leftLegPV === rightLegPV && rightLegPV > 0 && (
                      <span style={{ marginLeft: '8px', fontSize: '14px', color: '#10B981' }}>⚖️ Balanced</span>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#0D9488', marginBottom: '4px' }}>Members</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1F2937', marginBottom: '12px' }}>{rightLegCount}</div>
                  <div style={{ fontSize: '12px', color: '#0D9488', marginBottom: '4px' }}>Point Value (PV)</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0F766E' }}>{rightLegPV || 0}</div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: '16px', padding: '12px', backgroundColor: 'rgba(76, 211, 200, 0.1)', borderRadius: '8px', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#0D9488' }}>
                <strong style={{ color: '#1F2937' }}>💡 Tip:</strong> Commission is calculated on the <strong style={{ color: '#F59E0B' }}>weaker leg</strong> (smaller PV). 
                Build both legs evenly to maximize your earnings!
              </p>
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
