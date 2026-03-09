import React, { useState, useEffect } from 'react';
import { commissionAPI, teamAPI } from '../../services/api';
import './EarningsBreakdown.css';

export const EarningsBreakdown = () => {
  const [breakdown, setBreakdown] = useState(null);
  const [binaryCommission, setBinaryCommission] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllEarnings();
  }, []);

  const fetchAllEarnings = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch commission breakdown (direct + level)
      const commissionResponse = await commissionAPI.getCommissionBreakdown();
      console.log('💰 Commission Breakdown Response:', commissionResponse);
      
      // Fetch binary commission from team list API
      const teamResponse = await teamAPI.getSimpleTeamList();
      console.log('⚡ Binary Commission Response:', teamResponse);
      
      if (commissionResponse.success) {
        setBreakdown(commissionResponse.breakdown || {});
      } else {
        setError(commissionResponse.message || 'Failed to load earnings');
      }

      if (teamResponse.success && teamResponse.data) {
        setBinaryCommission(teamResponse.data.commissionAmount || 0);
      }
    } catch (err) {
      console.error('Error fetching earnings:', err);
      setError(err.message || 'Failed to load earnings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="earnings-breakdown">
        <div className="earnings-loading">
          <div className="spinner"></div>
          <p>Loading earnings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="earnings-breakdown">
        <div className="earnings-error">
          <p>⚠️ {error}</p>
          <button onClick={fetchAllEarnings} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const directBonus = breakdown?.direct_bonus || 0;
  const levelIncome = breakdown?.level_income || 0;
  const binaryBonus = binaryCommission || 0;
  // const rewardBonus = breakdown?.reward_bonus || 0;
  const totalEarnings = directBonus + levelIncome + binaryBonus; // Including binary commission

  return (
    <div className="earnings-breakdown">
      <div className="earnings-header">
        <h2>💰 Your Earnings Overview</h2>
        <p>Track your income from different commission types</p>
      </div>

      {/* Total Earnings Card */}
      <div className="total-earnings-card">
        <div className="total-earnings-label">Total Earnings</div>
        <div className="total-earnings-value">${totalEarnings.toFixed(2)}</div>
        <div className="total-earnings-subtitle">All-time commission earnings</div>
      </div>

      {/* Earnings Grid */}
      <div className="earnings-grid">
        {/* Direct Referral Commission */}
        <div className="earning-card direct-bonus">
          <div className="earning-icon">👥</div>
          <div className="earning-content">
            <div className="earning-label">Direct Referral Commission</div>
            <div className="earning-value">${directBonus.toFixed(2)}</div>
            <div className="earning-description">
              Earn from people who join directly using your referral code
            </div>
          </div>
          <div className="earning-badge">
            {directBonus > 0 ? `${((directBonus / totalEarnings) * 100).toFixed(1)}%` : '0%'}
          </div>
        </div>

        {/* Level Income */}
        <div className="earning-card level-income">
          <div className="earning-icon">📈</div>
          <div className="earning-content">
            <div className="earning-label">Level Income</div>
            <div className="earning-value">${levelIncome.toFixed(2)}</div>
            <div className="earning-description">
              Earn from your entire downline network across multiple levels
            </div>
          </div>
          <div className="earning-badge">
            {levelIncome > 0 ? `${((levelIncome / totalEarnings) * 100).toFixed(1)}%` : '0%'}
          </div>
        </div>

        {/* Binary Bonus */}
        <div className="earning-card binary-bonus">
          <div className="earning-icon">⚖️</div>
          <div className="earning-content">
            <div className="earning-label">Binary Commission</div>
            <div className="earning-value">${binaryBonus.toFixed(2)}</div>
            <div className="earning-description">
              Earn from balanced growth of left and right team legs (1:1 weaker leg matching)
            </div>
          </div>
          <div className="earning-badge">
            {binaryBonus > 0 && totalEarnings > 0 ? `${((binaryBonus / totalEarnings) * 100).toFixed(1)}%` : '0%'}
          </div>
        </div>

        {/* Reward Bonus - Commented out
        <div className="earning-card reward-bonus">
          <div className="earning-icon">🎁</div>
          <div className="earning-content">
            <div className="earning-label">Rank Rewards</div>
            <div className="earning-value">${rewardBonus.toFixed(2)}</div>
            <div className="earning-description">
              Unlock exclusive rewards as you achieve higher ranks
            </div>
          </div>
          <div className="earning-badge">
            {rewardBonus > 0 ? `${((rewardBonus / totalEarnings) * 100).toFixed(1)}%` : '0%'}
          </div>
        </div>
        */}
      </div>

      {/* Earnings Breakdown Chart (Visual) */}
      {totalEarnings > 0 && (
        <div className="earnings-chart">
          <h3>Earnings Distribution</h3>
          <div className="chart-container">
            <div className="chart-bar-wrapper">
              {directBonus > 0 && (
                <div 
                  className="chart-bar direct" 
                  style={{ width: `${(directBonus / totalEarnings) * 100}%` }}
                  title={`Direct: $${directBonus.toFixed(2)}`}
                >
                  <span className="chart-label">{((directBonus / totalEarnings) * 100).toFixed(0)}%</span>
                </div>
              )}
              {levelIncome > 0 && (
                <div 
                  className="chart-bar level" 
                  style={{ width: `${(levelIncome / totalEarnings) * 100}%` }}
                  title={`Level: $${levelIncome.toFixed(2)}`}
                >
                  <span className="chart-label">{((levelIncome / totalEarnings) * 100).toFixed(0)}%</span>
                </div>
              )}
              {binaryBonus > 0 && (
                <div 
                  className="chart-bar binary" 
                  style={{ width: `${(binaryBonus / totalEarnings) * 100}%` }}
                  title={`Binary: $${binaryBonus.toFixed(2)}`}
                >
                  <span className="chart-label">{((binaryBonus / totalEarnings) * 100).toFixed(0)}%</span>
                </div>
              )}
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-color direct"></span>
                <span>Direct</span>
              </div>
              <div className="legend-item">
                <span className="legend-color level"></span>
                <span>Level</span>
              </div>
              <div className="legend-item">
                <span className="legend-color binary"></span>
                <span>Binary</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {totalEarnings === 0 && (
        <div className="no-earnings">
          <div className="no-earnings-icon">📊</div>
          <h3>No Earnings Yet</h3>
          <p>Start building your team to earn commissions!</p>
          <div className="earnings-tips">
            <div className="tip">
              <span className="tip-icon">✨</span>
              <span>Share your referral code</span>
            </div>
            <div className="tip">
              <span className="tip-icon">🤝</span>
              <span>Build your network</span>
            </div>
            <div className="tip">
              <span className="tip-icon">💼</span>
              <span>Grow your downline</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EarningsBreakdown;
