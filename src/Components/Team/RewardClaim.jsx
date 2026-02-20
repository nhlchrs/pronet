import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RewardClaim.css';

const RewardClaim = ({ binaryRank }) => {
  const [availableRewards, setAvailableRewards] = useState([]);
  const [claimedRewards, setClaimedRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [binaryActivated, setBinaryActivated] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimForm, setClaimForm] = useState({
    rewardType: '',
    size: 'N/A',
    color: '',
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      phone: '',
    },
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  // Fetch available rewards
  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/team/rewards/available');
      
      if (response.data.success) {
        setAvailableRewards(response.data.availableRewards || []);
        setClaimedRewards(response.data.claimedRewards || []);
      }
    } catch (error) {
      console.error('Error fetching rewards:', error);
      setMessage({ type: 'error', text: 'Failed to load rewards' });
    } finally {
      setLoading(false);
    }
  };

  const openClaimModal = (reward) => {
    setSelectedReward(reward);
    setClaimForm({
      ...claimForm,
      rewardType: reward.rewardType || '',
    });
    setShowClaimModal(true);
  };

  const closeClaimModal = () => {
    setShowClaimModal(false);
    setSelectedReward(null);
    setMessage(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setClaimForm({
        ...claimForm,
        shippingAddress: {
          ...claimForm.shippingAddress,
          [field]: value,
        },
      });
    } else {
      setClaimForm({
        ...claimForm,
        [name]: value,
      });
    }
  };

  const handleSubmitClaim = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const response = await axios.post('/api/team/rewards/claim', {
        rank: selectedReward.rank,
        shippingAddress: selectedReward.requiresShipping ? claimForm.shippingAddress : null,
        size: selectedReward.requiresSize ? claimForm.size : undefined,
        color: selectedReward.requiresColor ? claimForm.color : undefined,
        notes: claimForm.notes,
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: response.data.message });
        setTimeout(() => {
          closeClaimModal();
          fetchRewards(); // Refresh rewards list
        }, 2000);
      } else {
        setMessage({ type: 'error', text: response.data.message });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to claim reward' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      AVAILABLE: { color: 'green', text: '✅ Available' },
      CLAIMED: { color: 'blue', text: '🎁 Claimed' },
      PROCESSING: { color: 'orange', text: '⚙️ Processing' },
      SHIPPED: { color: 'purple', text: '🚚 Shipped' },
      DELIVERED: { color: 'teal', text: '📦 Delivered' },
    };
    return badges[status] || badges.AVAILABLE;
  };

  if (loading) {
    return <div className="reward-loading">Loading rewards...</div>;
  }

  return (
    <div className="reward-claim-container">
      <div className="reward-header">
        <h2>🎁 Binary Rank Rewards</h2>
        <p>Claim exclusive rewards based on your highest rank achieved!</p>
        <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '8px' }}>
          One reward per rank • Unlocked by highest rank ever achieved • One-time redemption
        </p>
      </div>

      {/* Available Rewards */}
      {availableRewards.length > 0 && (
        <div className="available-rewards-section">
          <h3>🎉 Available to Redeem</h3>
          <div className="rewards-grid">
            {availableRewards.map((reward) => (
              <div key={reward.rank} className="reward-card available">
                <div className="reward-badge">
                  <span className="badge-icon">{reward.badge}</span>
                  <span className="badge-name">{reward.rank}</span>
                </div>
                <h4>{reward.rewardName}</h4>
                <p className="reward-description">{reward.rewardDescription}</p>
                <div className="reward-meta">
                  <span className="reward-type">Type: {reward.rewardType.replace(/_/g, ' ')}</span>
                </div>
                <button
                  className="claim-btn"
                  onClick={() => openClaimModal(reward)}
                >
                  Redeem Reward
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Available Rewards */}
      {availableRewards.length === 0 && claimedRewards.length === 0 && (
        <div className="no-rewards">
          <p>🏆 Keep building your team to unlock rank rewards!</p>
          <p>Your current rank: <strong style={{ color: '#4f46e5' }}>{binaryRank?.currentRank || 'NONE'}</strong></p>
        </div>
      )}

      {/* Claimed Rewards History */}
      {claimedRewards.length > 0 && (
        <div className="claimed-rewards-section">
          <h3>📋 Claimed Rewards History</h3>
          <div className="rewards-list">
            {claimedRewards.map((reward, idx) => {
              const statusBadge = getStatusBadge(reward.status);
              return (
                <div key={idx} className="reward-history-item">
                  <div className="history-left">
                    <div className="history-rank">{reward.rank}</div>
                    <div className="history-details">
                      <div className="history-type">{reward.rewardType}</div>
                      <div className="history-date">
                        Claimed: {new Date(reward.claimedDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="history-right">
                    <span 
                      className={`status-badge status-${statusBadge.color}`}
                    >
                      {statusBadge.text}
                    </span>
                    {reward.trackingNumber && (
                      <div className="tracking-info">
                        📦 {reward.trackingNumber}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Claim Modal */}
      {showClaimModal && selectedReward && (
        <div className="modal-overlay" onClick={closeClaimModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <span className="modal-badge">{selectedReward.badge}</span>
                Claim {selectedReward.rank} Reward
              </h3>
              <button className="modal-close" onClick={closeClaimModal}>×</button>
            </div>

            {message && (
              <div className={`message message-${message.type}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmitClaim} className="claim-form">
              {/* Reward Display */}
              <div className="form-group">
                <label>Reward</label>
                <div style={{ 
                  padding: '12px', 
                  backgroundColor: '#f3f4f6', 
                  borderRadius: '6px',
                  fontWeight: '600',
                  color: '#1f2937'
                }}>
                  {selectedReward.rewardName}
                </div>
                <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                  {selectedReward.rewardDescription}
                </p>
              </div>

              {/* Size Selection (if required) */}
              {selectedReward?.requiresSize && (
                <div className="form-group">
                  <label>Size *</label>
                  <select
                    name="size"
                    value={claimForm.size}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Size</option>
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Color Selection (if required) */}
              {selectedReward?.requiresColor && (
                <div className="form-group">
                  <label>Color *</label>
                  <select
                    name="color"
                    value={claimForm.color}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Color</option>
                    {selectedReward.colors?.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Shipping Address */}
              {selectedReward?.requiresShipping && (
                <div className="form-section">
                  <h4>Shipping Address *</h4>
                
                <div className="form-group">
                  <label>Street Address *</label>
                  <input
                    type="text"
                    name="address.street"
                    value={claimForm.shippingAddress.street}
                    onChange={handleInputChange}
                    required
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      name="address.city"
                      value={claimForm.shippingAddress.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>State *</label>
                    <input
                      type="text"
                      name="address.state"
                      value={claimForm.shippingAddress.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Zip Code *</label>
                    <input
                      type="text"
                      name="address.zipCode"
                      value={claimForm.shippingAddress.zipCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Country *</label>
                    <input
                      type="text"
                      name="address.country"
                      value={claimForm.shippingAddress.country}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="address.phone"
                    value={claimForm.shippingAddress.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
)}
              {/* Additional Notes */}
              <div className="form-group">
                <label>Additional Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={claimForm.notes}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Any special instructions for delivery..."
                />
              </div>

              {/* Submit Button */}
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={closeClaimModal}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={submitting}
                >
                  {submitting ? 'Redeeming...' : 'Redeem Reward'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardClaim;
