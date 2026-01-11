import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './Payment.css';

const VITE_API_URL = import.meta.env.VITE_API_URL;

const PaymentPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('btc');
  const [amount, setAmount] = useState(100);
  const [estimate, setEstimate] = useState(null);
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState('subscribe');

  // Subscription plans
  const plans = [
    {
      id: 'monthly',
      name: 'Monthly Plan',
      price: 29.99,
      duration: 30,
      features: [
        'Access to all courses',
        'Live meetings and webinars',
        'Premium support',
        'Downloadable resources',
      ]
    },
    {
      id: 'quarterly',
      name: 'Quarterly Plan',
      price: 79.99,
      duration: 90,
      features: [
        'All Monthly Plan features',
        '15% discount',
        'Priority support',
        'Exclusive content',
      ],
      popular: true
    },
    {
      id: 'yearly',
      name: 'Annual Plan',
      price: 299.99,
      duration: 365,
      features: [
        'All Quarterly Plan features',
        '30% discount',
        'One-on-one mentorship',
        'Lifetime resource access',
      ]
    }
  ];

  useEffect(() => {
    fetchCurrencies();
    if (user) {
      fetchUserPayments();
    }
  }, [user]);

  const fetchCurrencies = async () => {
    try {
      const response = await axios.get(`${VITE_API_URL}/payments/currencies`);
      if (response.data.success) {
        setCurrencies(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching currencies:', error);
    }
  };

  const fetchUserPayments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${VITE_API_URL}/payments/my-payments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setPayments(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const handleGetEstimate = async (planPrice) => {
    try {
      const response = await axios.post(`${VITE_API_URL}/payments/estimate`, {
        amount: planPrice,
        currency_from: 'usd',
        currency_to: selectedCurrency
      });
      if (response.data.success) {
        setEstimate(response.data.data);
      }
    } catch (error) {
      console.error('Error getting estimate:', error);
    }
  };

  const handleSubscribe = async (plan) => {
    if (!user) {
      showModal('Login Required', 'Please login to subscribe', 'error');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Use BTC as default if selectedCurrency is unavailable
      const payCurrency = selectedCurrency && selectedCurrency.toLowerCase() !== 'usdt' ? selectedCurrency : 'btc';
      
      const response = await axios.post(
        `${VITE_API_URL}/payments/subscribe`,
        {
          planType: plan.id,
          amount: plan.price,
          currency: 'usd',
          pay_currency: payCurrency,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log('Full response:', response.data);
      if (response.data.status === 1) {
        const invoiceUrl = response.data.data.invoiceUrl || response.data.data.paymentUrl;
        const invoiceId = response.data.data.invoiceId;
        
        console.log('Invoice URL:', invoiceUrl);
        console.log('Invoice ID:', invoiceId);
        
        // Show success modal
        showModal(
          'Payment Created',
          `Invoice created for ${plan.name}. Opening payment page...`,
          'success'
        );
        
        // Redirect to NOWPayments invoice page immediately
        if (invoiceUrl) {
          console.log('Opening URL:', invoiceUrl);
          const newWindow = window.open(invoiceUrl, '_blank', 'noopener,noreferrer');
          if (!newWindow) {
            console.warn('Popup blocked - showing alternative');
            showModal('Open Payment', 'Click OK to open payment page in new tab', 'success');
          }
        } else {
          console.error('No invoice URL found in response:', response.data.data);
          showModal('Error', 'No payment URL received. Please try again.', 'error');
        }
        
        // Fetch updated payments list
        setTimeout(() => {
          fetchUserPayments();
        }, 1500);
      } else {
        console.error('Invalid response status:', response.data);
        showModal('Error', 'Failed to create invoice. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create payment. Please try again.';
      showModal(
        'Payment Failed',
        errorMessage,
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCustomPayment = async () => {
    if (!user) {
      alert('Please login to make a payment');
      return;
    }

    if (amount < 1) {
      showModal('Invalid Amount', 'Amount must be at least $1', 'error');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${VITE_API_URL}/payments/order`,
        {
          orderId: `ORDER_${Date.now()}`,
          amount: amount,
          currency: selectedCurrency,
          description: 'Custom payment'
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        const { paymentUrl } = response.data.data;
        
        showModal(
          'Payment Created',
          'Redirecting to payment page...',
          'success'
        );
        
        setTimeout(() => {
          window.open(paymentUrl, '_blank');
        }, 2000);
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      showModal(
        'Payment Failed',
        error.response?.data?.message || 'Failed to create payment',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const showModal = (title, message, type) => {
    // Create modal element
    const modal = document.createElement('div');
    modal.className = `payment-modal ${type}`;
    modal.innerHTML = `
      <div class="payment-modal-content">
        <div class="payment-modal-icon ${type}">
          ${type === 'success' ? '✓' : '✕'}
        </div>
        <h3>${title}</h3>
        <p>${message}</p>
      </div>
    `;
    document.body.appendChild(modal);
    
    setTimeout(() => {
      modal.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
    }, 3000);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'waiting': { class: 'warning', text: 'Pending' },
      'confirming': { class: 'info', text: 'Confirming' },
      'confirmed': { class: 'info', text: 'Confirmed' },
      'sending': { class: 'info', text: 'Processing' },
      'partially_paid': { class: 'warning', text: 'Partial' },
      'finished': { class: 'success', text: 'Completed' },
      'failed': { class: 'error', text: 'Failed' },
      'refunded': { class: 'secondary', text: 'Refunded' },
      'expired': { class: 'secondary', text: 'Expired' }
    };
    
    const statusInfo = statusMap[status] || { class: 'secondary', text: status };
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        <h1>Payments & Subscriptions</h1>

        {/* Tab Navigation */}
        <div className="payment-tabs">
          <button
            className={`tab-btn ${activeTab === 'subscribe' ? 'active' : ''}`}
            onClick={() => setActiveTab('subscribe')}
          >
            Subscribe
          </button>
          <button
            className={`tab-btn ${activeTab === 'custom' ? 'active' : ''}`}
            onClick={() => setActiveTab('custom')}
          >
            Custom Payment
          </button>
          <button
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            Payment History
          </button>
        </div>

        {/* Subscribe Tab */}
        {activeTab === 'subscribe' && (
          <div className="tab-content">
            {/* Currency Selector */}
            <div className="currency-selector">
              <label>Pay with Cryptocurrency:</label>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
              >
                <option value="btc">Bitcoin (BTC)</option>
                <option value="eth">Ethereum (ETH)</option>
                <option value="ltc">Litecoin (LTC)</option>
                <option value="usdt">Tether (USDT)</option>
                <option value="usdttrc20">USDT TRC20</option>
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Subscription Plans */}
            <div className="plans-grid">
              {plans.map((plan) => (
                <div key={plan.id} className={`plan-card ${plan.popular ? 'popular' : ''}`}>
                  {plan.popular && <div className="popular-badge">Most Popular</div>}
                  <h3>{plan.name}</h3>
                  <div className="plan-price">
                    <span className="currency">$</span>
                    <span className="amount">{plan.price}</span>
                    <span className="period">/ {plan.duration} days</span>
                  </div>
                  <ul className="plan-features">
                    {plan.features.map((feature, index) => (
                      <li key={index}>
                        <span className="check-icon">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    className="subscribe-btn"
                    onClick={() => handleSubscribe(plan)}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Subscribe Now'}
                  </button>
                  <button
                    className="estimate-btn"
                    onClick={() => handleGetEstimate(plan.price)}
                  >
                    Get {selectedCurrency.toUpperCase()} Estimate
                  </button>
                  {estimate && (
                    <div className="estimate-result">
                      ≈ {estimate.estimated_amount} {estimate.currency_to.toUpperCase()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Payment Tab */}
        {activeTab === 'custom' && (
          <div className="tab-content custom-payment">
            <div className="custom-payment-form">
              <h3>Make a Custom Payment</h3>
              <div className="form-group">
                <label>Amount (USD)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value))}
                  min="1"
                  step="0.01"
                  placeholder="Enter amount"
                />
              </div>
              <div className="form-group">
                <label>Payment Currency</label>
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                >
                  <option value="btc">Bitcoin (BTC)</option>
                  <option value="eth">Ethereum (ETH)</option>
                  <option value="ltc">Litecoin (LTC)</option>
                  <option value="usdt">Tether (USDT)</option>
                  <option value="usdttrc20">USDT TRC20</option>
                </select>
              </div>
              <button
                className="pay-btn"
                onClick={handleCustomPayment}
                disabled={loading}
              >
                {loading ? 'Processing...' : `Pay $${amount}`}
              </button>
            </div>
          </div>
        )}

        {/* Payment History Tab */}
        {activeTab === 'history' && (
          <div className="tab-content payment-history">
            <h3>Your Payment History</h3>
            {payments.length === 0 ? (
              <div className="no-payments">
                <p>No payments yet</p>
              </div>
            ) : (
              <div className="payments-table">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Order ID</th>
                      <th>Amount</th>
                      <th>Currency</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment._id}>
                        <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                        <td>{payment.orderId}</td>
                        <td>${payment.priceAmount}</td>
                        <td>{payment.payCurrency?.toUpperCase()}</td>
                        <td>{getStatusBadge(payment.paymentStatus)}</td>
                        <td>
                          {payment.invoiceUrl && payment.paymentStatus === 'waiting' && (
                            <a
                              href={payment.invoiceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="pay-link"
                            >
                              Complete Payment
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
