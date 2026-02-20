import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { teamAPI } from "../../services/api";
import RewardClaim from "../../Components/Team/RewardClaim";
import BinaryRank from "../../Components/Team/BinaryRank";

export default function RewardsPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [binaryRank, setBinaryRank] = useState(null);
  const [directReferrals, setDirectReferrals] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    fetchBinaryRankData();
  }, [isAuthenticated, navigate]);

  const fetchBinaryRankData = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Fetch binary rank info and stats
      const response = await teamAPI.getTeamStats();
      const data = response.data || response;
      
      // Set binary rank data
      if (data) {
        setBinaryRank({
          binaryActivated: data.binaryActivated || false,
          currentRank: data.binaryRank || "NONE",
          binaryBonusPercent: data.binaryBonusPercent || 0,
          totalActiveAffiliates: data.totalActiveAffiliates || 0,
          leftLegPV: data.leftLegPV || 0,
          rightLegPV: data.rightLegPV || 0,
          weakerLegPV: data.weakerLegPV || 0,
          binaryCommissionEarned: data.binaryCommissionEarned || 0,
        });
        setDirectReferrals(data.directCount || 0);
      }
    } catch (err) {
      console.error("Error fetching rewards data:", err);
      setError(err.message || "Failed to fetch rewards data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#0B1929",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Red Hat Text', 'Red Hat Content', sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "3px solid #4CD3C8",
              borderTop: "3px solid transparent",
              borderRadius: "50%",
              margin: "0 auto 20px",
              animation: "spin 1s linear infinite",
            }}
          ></div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: "#DAFAF4" }}>Loading rewards...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0B1929",
        padding: "40px 20px",
        fontFamily: "'Red Hat Text', 'Red Hat Content', sans-serif",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "42px",
              }}
            >
              🎁
            </div>
            <div>
              <h1
                style={{
                  fontSize: "32px",
                  color: "#DAFAF4",
                  margin: "0 0 8px 0",
                  fontWeight: "bold",
                }}
              >
                Binary Rank Rewards
              </h1>
              <p style={{ color: "#5DDDD2", margin: 0 }}>
                Claim exclusive rewards for reaching new binary ranks
              </p>
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              padding: "10px 20px",
              backgroundColor: "transparent",
              color: "#4CD3C8",
              border: "2px solid #4CD3C8",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              transition: "all 0.3s",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#4CD3C8";
              e.currentTarget.style.color = "#0B1929";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#4CD3C8";
            }}
          >
            <span>←</span> Back to Dashboard
          </button>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "#ff4444",
              color: "#fff",
              padding: "16px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        {/* Binary Rank Display */}
        {binaryRank && (
          <div style={{ marginBottom: "40px" }}>
            <BinaryRank binaryRank={binaryRank} directReferrals={directReferrals} />
          </div>
        )}

        {/* Reward Claim Component */}
        <div
          style={{
            backgroundColor: "#1A2A3A",
            border: "1px solid #2A4A5A",
            borderRadius: "12px",
            padding: "32px",
          }}
        >
          <RewardClaim binaryRank={binaryRank} />
        </div>

        {/* Info Section */}
        <div
          style={{
            marginTop: "40px",
            backgroundColor: "rgba(76, 211, 200, 0.1)",
            border: "2px solid #4CD3C8",
            borderRadius: "12px",
            padding: "24px",
          }}
        >
          <h3 style={{ color: "#DAFAF4", marginTop: 0, marginBottom: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "24px" }}>ℹ️</span>
            How Rewards Work
          </h3>
          <ul style={{ color: "#5DDDD2", lineHeight: "1.8", margin: 0 }}>
            <li>Earn <strong style={{ color: "#DAFAF4" }}>ONE reward per binary rank</strong> achieved</li>
            <li>Rewards are unlocked by <strong style={{ color: "#DAFAF4" }}>highest rank ever achieved</strong></li>
            <li>Each reward is <strong style={{ color: "#DAFAF4" }}>one-time redeemable</strong></li>
            <li>Rank drops <strong style={{ color: "#DAFAF4" }}>do NOT affect</strong> reward eligibility</li>
            <li>Ranks based on <strong style={{ color: "#DAFAF4" }}>total active affiliates</strong> in your team</li>
            <li>
              <strong style={{ color: "#DAFAF4" }}>IGNITOR</strong>: 3 affiliates (T-Shirt) &nbsp;|&nbsp;
              <strong style={{ color: "#DAFAF4" }}>SPARK</strong>: 12 affiliates (Gift Hamper)
            </li>
            <li>
              <strong style={{ color: "#DAFAF4" }}>ZENITH</strong>: 44,444 affiliates (₹4,00,000 Cash!)
            </li>
            <li><em>Note: Binary commission (10%, 15%, 20%) requires 10+ direct referrals</em></li>
          </ul>
        </div>

        {/* Progress Incentive */}
        {binaryRank && binaryRank.currentRank === 'NONE' && (
          <div
            style={{
              marginTop: "20px",
              backgroundColor: "rgba(251, 146, 60, 0.1)",
              border: "2px solid #fb923c",
              borderRadius: "12px",
              padding: "24px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔥</div>
            <h3 style={{ color: "#DAFAF4", margin: "0 0 12px 0" }}>
              Start Your Ranking Journey!
            </h3>
            <p style={{ color: "#fb923c", margin: 0, fontSize: "18px" }}>
              Build <strong>3 active affiliates</strong> to reach <strong>IGNITOR rank</strong> and claim your first reward!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
