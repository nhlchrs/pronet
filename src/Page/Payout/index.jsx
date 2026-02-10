import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { teamAPI, userAPI } from "../../services/api";
import { toast } from "sonner";
import "./Payout.css";

export default function Payout() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // State management
  const [balance, setBalance] = useState(null);
  const [stats, setStats] = useState(null);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("balance");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [hasExistingWallet, setHasExistingWallet] = useState(false);

  // Form state
  const [payoutForm, setPayoutForm] = useState({
    amount: "",
    payoutMethod: "crypto",
    cryptoWalletAddress: "",
    cryptoCurrency: "USDT", // Default to USDT
  });

  // Check authentication and fetch saved wallet
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchData();
    fetchSavedWallet();
  }, [isAuthenticated]);

  // Fetch saved wallet settings
  const fetchSavedWallet = async () => {
    try {
      const response = await userAPI.getCryptoWallet();
      if (response.success && response.data.cryptoWalletAddress) {
        setPayoutForm(prev => ({
          ...prev,
          cryptoWalletAddress: response.data.cryptoWalletAddress || "",
          cryptoCurrency: response.data.cryptoCurrency || "USDT",
        }));
        setHasExistingWallet(true);
      }
    } catch (error) {
      console.error("Error fetching saved wallet:", error);
      // Don't show error toast here - it's optional to have saved wallet
    }
  };

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchBalance(),
        fetchStats(),
        fetchPayoutHistory(1),
      ]);
    } catch (error) {
      console.error("Error fetching payout data:", error);
      toast.error("Failed to load payout information");
    } finally {
      setLoading(false);
    }
  };
  // Fetch available balance
  const fetchBalance = async () => {
    try {
      const response = await teamAPI.getPayoutBalance();
      if (response.success) {
        setBalance(response.data);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  // Fetch payout statistics
  const fetchStats = async () => {
    try {
      const response = await teamAPI.getPayoutStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Fetch payout history
  const fetchPayoutHistory = async (page = 1) => {
    try {
      const response = await teamAPI.getPayoutHistory(page, 10);
      if (response.success) {
        setPayouts(response.data.payouts);
        setPagination(response.data.pagination);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Error fetching payout history:", error);
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPayoutForm({ ...payoutForm, [name]: value });
  };

  // Handle crypto currency change
  const handleCryptoCurrencyChange = (currency) => {
    setPayoutForm({
      ...payoutForm,
      cryptoCurrency: currency,
    });
  };

  // Handle payout request submission
  const handleSubmitPayout = async (e) => {
    e.preventDefault();

    // Validation
    if (!payoutForm.amount || parseFloat(payoutForm.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (parseFloat(payoutForm.amount) < 100) {
      toast.error("Minimum payout amount is ₹100");
      return;
    }

    if (balance && parseFloat(payoutForm.amount) > balance.availableBalance) {
      toast.error("Insufficient balance");
      return;
    }

    // Validate crypto wallet address
    if (!payoutForm.cryptoWalletAddress || payoutForm.cryptoWalletAddress.trim().length === 0) {
      toast.error("Please enter your crypto wallet address");
      return;
    }

    // Basic wallet address validation (length check)
    if (payoutForm.cryptoWalletAddress.trim().length < 26) {
      toast.error("Please enter a valid crypto wallet address");
      return;
    }

    try {
      setSubmitting(true);

      const payoutData = {
        amount: parseFloat(payoutForm.amount),
        payoutMethod: payoutForm.payoutMethod,
        cryptoWalletAddress: payoutForm.cryptoWalletAddress.trim(),
        cryptoCurrency: payoutForm.cryptoCurrency,
      };

      const response = await teamAPI.requestPayout(payoutData);

      if (response.success) {
        // Auto-save wallet on first use only
        if (!hasExistingWallet) {
          try {
            await userAPI.updateCryptoWallet({
              cryptoWalletAddress: payoutForm.cryptoWalletAddress.trim(),
              cryptoCurrency: payoutForm.cryptoCurrency,
            });
            setHasExistingWallet(true);
          } catch (walletError) {
            console.error("Error saving wallet settings:", walletError);
            // Don't fail the whole operation if wallet save fails
          }
        }

        toast.success(response.message || "Payout request submitted successfully!");
        
        // Reset form - keep wallet info
        setPayoutForm(prev => ({
          ...prev,
          amount: "",
        }));

        // Refresh data
        await fetchData();

        // Switch to history tab
        setActiveTab("history");
      } else {
        toast.error(response.message || "Failed to submit payout request");
      }
    } catch (error) {
      console.error("Error submitting payout:", error);
      toast.error(error.message || "Failed to submit payout request");
    } finally {
      setSubmitting(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="payout-page-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading payout information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payout-page-container">
      <div className="payout-content">
        {/* Header */}
        <div className="payout-header">
          <h1>Crypto Payout</h1>
          <p>Request instant crypto payouts via NOWPayments</p>
        </div>

        {/* Balance Cards */}
        <div className="balance-cards">
          <div className="balance-card">
            <div className="balance-card-content">
              <div className="balance-card-info">
                <h3>Available Balance</h3>
                <p className="balance-card-amount primary">
                  {balance ? formatCurrency(balance.availableBalance) : "₹0.00"}
                </p>
              </div>
              <div className="balance-card-icon primary">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="balance-card">
            <div className="balance-card-content">
              <div className="balance-card-info">
                <h3>Total Earned</h3>
                <p className="balance-card-amount success">
                  {balance ? formatCurrency(balance.totalEarned) : "₹0.00"}
                </p>
              </div>
              <div className="balance-card-icon success">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="balance-card">
            <div className="balance-card-content">
              <div className="balance-card-info">
                <h3>Total Paid</h3>
                <p className="balance-card-amount info">
                  {balance ? formatCurrency(balance.totalPaid) : "₹0.00"}
                </p>
              </div>
              <div className="balance-card-icon info">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        {/* {stats && (
          <div className="stats-card">
            <h3>Statistics</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <p className="stat-label">Total Requests</p>
                <p className="stat-value">{stats.totalRequested || 0}</p>
              </div>
              <div className="stat-item">
                <p className="stat-label">Pending</p>
                <p className="stat-value stat-pending">{stats.pending || 0}</p>
              </div>
              <div className="stat-item">
                <p className="stat-label">Processing</p>
                <p className="stat-value stat-processing">{stats.processing || 0}</p>
              </div>
              <div className="stat-item">
                <p className="stat-label">Completed</p>
                <p className="stat-value stat-completed">{stats.completed || 0}</p>
              </div>
              <div className="stat-item">
                <p className="stat-label">Failed</p>
                <p className="stat-value stat-failed">{stats.failed || 0}</p>
              </div>
            </div>
          </div>
        )} */}

        {/* Tabs */}
        <div className="payout-tabs-container">
          <div className="tabs-header">
            <nav className="tabs-nav">
              <button
                onClick={() => setActiveTab("balance")}
                className={`tab-button ${activeTab === "balance" ? "active" : ""}`}
              >
                Request Payout
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`tab-button ${activeTab === "history" ? "active" : ""}`}
              >
                History
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === "balance" && (
              <div className="payout-form-container">
                <h3 className="form-title">Request Crypto Payout</h3>
                
                <form onSubmit={handleSubmitPayout} className="payout-form">
                  {/* Amount */}
                  <div className="form-group">
                    <label className="form-label">
                      Amount <span className="required">*</span>
                    </label>
                    <div className="input-with-icon">
                      <span className="input-icon">₹</span>
                      <input
                        type="number"
                        name="amount"
                        value={payoutForm.amount}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter amount"
                        min="100"
                        step="0.01"
                        required
                      />
                    </div>
                    <p className="form-hint">
                      Minimum: ₹100 | Available Balance: {balance ? formatCurrency(balance.availableBalance) : "₹0.00"}
                    </p>
                  </div>

                  {/* Cryptocurrency Selection */}
                  <div className="form-group crypto-selection-group">
                    <label className="form-label">
                      Select Cryptocurrency <span className="required">*</span>
                    </label>
                    <div className="crypto-grid-simple">
                      <button
                        type="button"
                        onClick={() => handleCryptoCurrencyChange("USDT")}
                        className={`crypto-currency-button-large ${payoutForm.cryptoCurrency === "USDT" ? "active" : ""}`}
                      >
                        <div className="crypto-icon-wrapper">
                          <svg fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
                          </svg>
                        </div>
                        <div className="crypto-info">
                          <span className="crypto-name">USDT</span>
                          <span className="crypto-desc">Tether - Stablecoin</span>
                          <span className="crypto-badge">Recommended</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCryptoCurrencyChange("BTC")}
                        className={`crypto-currency-button-large ${payoutForm.cryptoCurrency === "BTC" ? "active" : ""}`}
                      >
                        <div className="crypto-icon-wrapper">
                          <svg fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.5 15h-1v1h-1v-1H9v-1.5h.5c.28 0 .5-.22.5-.5v-5c0-.28-.22-.5-.5-.5H9V8h1.5V7h1v1h1c1.38 0 2.5 1.12 2.5 2.5 0 .69-.28 1.31-.73 1.76.45.45.73 1.07.73 1.76 0 1.38-1.12 2.48-2.5 2.48zm0-7h-1v2h1c.55 0 1-.45 1-1s-.45-1-1-1zm0 3.5h-1v2h1c.55 0 1-.45 1-1s-.45-1-1-1z"/>
                          </svg>
                        </div>
                        <div className="crypto-info">
                          <span className="crypto-name">BTC</span>
                          <span className="crypto-desc">Bitcoin - Cryptocurrency</span>
                        </div>
                      </button>
                    </div>
                    <p className="form-hint crypto-hint">💡 Powered by NOWPayments - Fast & Secure Crypto Payouts</p>
                  </div>

                  {/* Crypto Wallet Address */}
                  <div className="crypto-wallet-form">
                    <h4>Enter Your {payoutForm.cryptoCurrency} Wallet Address</h4>
                    <div className="form-group">
                      <label className="form-label">
                        Wallet Address <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        name="cryptoWalletAddress"
                        value={payoutForm.cryptoWalletAddress}
                        onChange={handleInputChange}
                        className="wallet-address-input form-input"
                        placeholder={`Paste your ${payoutForm.cryptoCurrency} wallet address here`}
                        required
                      />
                      <div className="wallet-address-warning">
                        <p>⚠️ Important: Ensure your wallet address is correct. NOWPayments will send funds directly to this address and transactions cannot be reversed.</p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="submit-button"
                  >
                    {submitting ? "Processing..." : "Request Payout via NOWPayments"}
                  </button>

                  {/* Info Box */}
                  <div className="info-box">
                    <div className="info-box-content">
                      <div className="info-box-icon">
                        <svg fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      </div>
                      <div className="info-box-text">
                        <p className="info-box-title">Important Information</p>
                        <ul>
                          <li>Payouts processed via NOWPayments within 24-48 hours</li>
                          <li>Minimum payout: ₹100 (approx $1.20 USD)</li>
                          <li>Double-check your wallet address - transactions are irreversible</li>
                          <li>USDT recommended for stable value & lower fees</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "history" && (
              <div className="payout-history-container">
                <h3>Payout History</h3>

                {payouts.length === 0 ? (
                  <div className="empty-state">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <h4>No payout history</h4>
                    <p>You haven't requested any payouts yet.</p>
                    <button
                      onClick={() => setActiveTab("balance")}
                      className="primary-button"
                    >
                      Request Payout
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="payout-table-container">
                      <table className="payout-table">
                        <thead>
                          <tr>
                            <th>Reference</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Net</th>
                            <th>Crypto</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payouts.map((payout) => (
                            <tr key={payout._id}>
                              <td className="table-reference">
                                {payout.referenceNumber || payout._id.slice(-8)}
                              </td>
                              <td className="table-date">
                                {formatDate(payout.requestedAt || payout.createdAt)}
                              </td>
                              <td className="table-amount">
                                {formatCurrency(payout.amount)}
                              </td>
                              <td className="table-net-amount">
                                {formatCurrency(payout.netAmount)}
                              </td>
                              <td className="table-method">
                                {payout.payoutMethod === "crypto" 
                                  ? `${payout.cryptoCurrency || "CRYPTO"}` 
                                  : payout.payoutMethod.replace("_", " ").toUpperCase()}
                              </td>
                              <td>
                                <span className={`status-badge status-${payout.status}`}>
                                  {payout.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                      <div className="pagination-container">
                        <div className="pagination-info">
                          Showing page {pagination.currentPage} of {pagination.totalPages} (
                          {pagination.totalPayouts} total)
                        </div>
                        <div className="pagination-buttons">
                          <button
                            onClick={() => fetchPayoutHistory(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="pagination-button"
                          >
                            Previous
                          </button>
                          <button
                            onClick={() => fetchPayoutHistory(currentPage + 1)}
                            disabled={currentPage === pagination.totalPages}
                            className="pagination-button"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
