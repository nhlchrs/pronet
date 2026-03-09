import React, { useState, useEffect } from 'react';
import { teamAPI } from '../../services/api';
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
      const response = await teamAPI.getAvailableRewards();
      console.log('🎁 Rewards API Response:', response);
      
      if (response.success) {
        setAvailableRewards(response.availableRewards || []);
        setClaimedRewards(response.claimedRewards || []);
      }
    } catch (error) {
      console.error('Error fetching rewards:', error);
      setMessage({ type: 'error', text: 'Failed to load rewards' });
    } finally {
      setLoading(false);
    }
  };

  const openClaimModal = (reward) => {
    console.log('🎯 Opening claim modal for reward:', reward);
    console.log('🔍 Before state update - showClaimModal:', showClaimModal);
    setSelectedReward(reward);
    setClaimForm({
      rewardType: reward.rewardType || '',
      size: reward.requiresSize ? '' : 'N/A',
      color: reward.requiresColor ? '' : '',
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
    setShowClaimModal(true);
    console.log('✅ Modal state updated to true');
    // Force check after state update
    setTimeout(() => {
      console.log('🔍 After state update - showClaimModal:', showClaimModal);
      const modalElement = document.querySelector('.modal-overlay');
      console.log('🔍 Modal element in DOM:', modalElement);
      if (modalElement) {
        console.log('✅ Modal element exists in DOM');
        console.log('🔍 Modal computed styles:', window.getComputedStyle(modalElement));
      } else {
        console.log('❌ Modal element NOT found in DOM');
      }
    }, 100);
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
    console.log('🔥 handleSubmitClaim CALLED!', e);
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      console.log('🎁 Submitting reward claim:', {
        rank: selectedReward.rank,
        requiresShipping: selectedReward.requiresShipping,
        requiresSize: selectedReward.requiresSize,
        requiresColor: selectedReward.requiresColor,
        size: claimForm.size,
        color: claimForm.color,
      });

      const payload = {
        rank: selectedReward.rank,
        shippingAddress: selectedReward.requiresShipping ? claimForm.shippingAddress : undefined,
        size: selectedReward.requiresSize ? claimForm.size : undefined,
        color: selectedReward.requiresColor ? claimForm.color : undefined,
        notes: claimForm.notes || undefined,
      };

      console.log('📦 Claim payload:', payload);

      const response = await teamAPI.claimReward(payload);

      console.log('✅ Claim response:', response);

      if (response.success) {
        setMessage({ type: 'success', text: response.message || 'Reward redeemed successfully!' });
        setTimeout(() => {
          closeClaimModal();
          fetchRewards(); // Refresh rewards list
        }, 2000);
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to claim reward' });
      }
    } catch (error) {
      console.error('❌ Claim error:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || error.message || 'Failed to claim reward. Please try again.' 
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

  // Debug logging for modal state
  console.log('🔍 Render - showClaimModal:', showClaimModal, 'selectedReward:', selectedReward);

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
      {console.log('🔍 Modal condition check:', showClaimModal && selectedReward)}
      {showClaimModal && selectedReward && (
        <div 
          className="modal-overlay" 
          onClick={closeClaimModal}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            display: 'flex',
            background: 'rgba(11, 25, 41, 0.95)',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {console.log('🎨 RENDERING MODAL OVERLAY')}
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              zIndex: 10000,
              background: '#1A2A3A',
              border: '2px solid #4CD3C8',
              borderRadius: '16px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 20px 60px rgba(76, 211, 200, 0.2)'
            }}
          >
            {console.log('🎨 RENDERING MODAL CONTENT')}
            <div className="modal-header" style={{
              background: '#1A2A3A',
              borderBottom: '1px solid #2A4A5A',
              padding: '24px',
              position: 'sticky',
              top: 0,
              zIndex: 10
            }}>
              <h3 style={{
                color: '#DAFAF4',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span className="modal-badge">{selectedReward.badge}</span>
                Claim {selectedReward.rank} Reward
              </h3>
              <button 
                className="modal-close" 
                onClick={closeClaimModal}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#5DDDD2',
                  fontSize: '32px',
                  cursor: 'pointer'
                }}
              >×</button>
            </div>

            {message && (
              <div className={`message message-${message.type}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmitClaim} className="claim-form">
              {/* Reward Display */}
              <div className="form-group" style={{ padding: '0 24px' }}>
                <label style={{ color: '#5DDDD2', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Reward</label>
                <div style={{ 
                  padding: '12px', 
                  backgroundColor: '#0B1929', 
                  border: '1px solid #2A4A5A',
                  borderRadius: '6px',
                  fontWeight: '600',
                  color: '#DAFAF4'
                }}>
                  {selectedReward.rewardName}
                </div>
                <p style={{ fontSize: '13px', color: '#5DDDD2', marginTop: '4px' }}>
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
