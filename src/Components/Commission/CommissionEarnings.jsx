import React, { useState, useEffect } from 'react';
import { commissionAPI } from '../../services/api';
import './CommissionEarnings.css';

const CommissionEarnings = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPending, setTotalPending] = useState(0);
  const [breakdown, setBreakdown] = useState({
    direct_bonus: 0,
    level_income: 0,
    binary_bonus: 0,
    reward_bonus: 0,
  });
  const [commissions, setCommissions] = useState([]);

  useEffect(() => {
    fetchCommissionData();
  }, []);

  const fetchCommissionData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch total pending amount
      const totalRes = await commissionAPI.getTotalPending();
      const totalAmount = totalRes?.data?.totalPendingAmount || 0;
      setTotalPending(totalAmount);

      // Fetch commission breakdown
      const breakdownRes = await commissionAPI.getCommissionBreakdown();
      const breakdownData = breakdownRes?.data || {};
      
      setBreakdown({
        direct_bonus: breakdownData.directBonus || 0,
        level_income: breakdownData.levelIncome || 0,
        binary_bonus: breakdownData.binaryBonus || 0,
        reward_bonus: breakdownData.rewardBonus || 0,
      });

      // Fetch pending commissions list
      const commissionsRes = await commissionAPI.getPendingCommissions();
      const commissionsList = commissionsRes?.data?.commissions || [];
      setCommissions(commissionsList);

    } catch (err) {
      console.error('Error fetching commission data:', err);
      setError(err.message || 'Failed to load commission data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="commission-earnings-loading">
        <div className="spinner"></div>
        <p>Loading earnings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="commission-earnings-error">
        <p>⚠️ {error}</p>
        <button onClick={fetchCommissionData}>Retry</button>
      </div>
    );
  }

  const totalEarnings = breakdown.direct_bonus + breakdown.level_income + breakdown.binary_bonus + breakdown.reward_bonus;

  return (
    <div className="commission-earnings-container">
      {/* Total Earnings Card */}
      <div className="total-earnings-card">
        <div className="earnings-icon">💰</div>
        <div className="earnings-content">
          <h3>Total Pending Earnings</h3>
          <div className="earnings-amount">${totalPending.toFixed(2)}</div>
          <p className="earnings-subtitle">Commissions waiting for payout</p>
        </div>
      </div>

      {/* Commission Breakdown */}
      <div className="commission-breakdown-section">
        <h4>📊 Commission Breakdown</h4>
        <div className="breakdown-grid">
          {/* Direct Bonus */}
          <div className="breakdown-item">
            <div className="breakdown-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              👥
            </div>
            <div className="breakdown-content">
              <div className="breakdown-label">Direct Bonus</div>
              <div className="breakdown-amount">${breakdown.direct_bonus.toFixed(2)}</div>
              <div className="breakdown-description">From direct referrals</div>
            </div>
          </div>

          {/* Level Income */}
          <div className="breakdown-item">
            <div className="breakdown-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
              📈
            </div>
            <div className="breakdown-content">
              <div className="breakdown-label">Level Income</div>
              <div className="breakdown-amount">${breakdown.level_income.toFixed(2)}</div>
              <div className="breakdown-description">From downline levels</div>
            </div>
          </div>

          {/* Binary Bonus */}
          <div className="breakdown-item">
            <div className="breakdown-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
              ⚖️
            </div>
            <div className="breakdown-content">
              <div className="breakdown-label">Binary Bonus</div>
              <div className="breakdown-amount">${breakdown.binary_bonus.toFixed(2)}</div>
              <div className="breakdown-description">From binary matching</div>
            </div>
          </div>

          {/* Reward Bonus */}
          <div className="breakdown-item">
            <div className="breakdown-icon" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
              🎁
            </div>
            <div className="breakdown-content">
              <div className="breakdown-label">Reward Bonus</div>
              <div className="breakdown-amount">${breakdown.reward_bonus.toFixed(2)}</div>
              <div className="breakdown-description">From achievements</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Commissions */}
      {commissions.length > 0 && (
        <div className="recent-commissions-section">
          <h4>📋 Recent Pending Commissions</h4>
          <div className="commissions-list">
            {commissions.slice(0, 5).map((commission) => (
              <div key={commission._id} className="commission-item">
                <div className="commission-type">
                  <span className={`type-badge ${commission.commissionType.replace('_', '-')}`}>
                    {commission.commissionType.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="commission-details">
                  <div className="commission-description">{commission.description || 'Commission earned'}</div>
                  <div className="commission-date">
                    {new Date(commission.earningDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="commission-amount">
                  ${commission.netAmount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          {commissions.length > 5 && (
            <div className="view-all-link">
              <a href="/payout">View all {commissions.length} commissions →</a>
            </div>
          )}
        </div>
      )}

      {commissions.length === 0 && (
        <div className="no-commissions-message">
          <p>💡 No pending commissions yet. Start building your team to earn!</p>
        </div>
      )}
    </div>
  );
};

export default CommissionEarnings;
