import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import { useNavigate } from "react-router-dom";
import { authAPI, meetingAPI, announcementAPI, paymentAPI, teamAPI } from "../../services/api";
import TermsAgreementModal from "../../Components/TermsAgreementModal";
// import CommissionEarnings from "../../Components/Commission/CommissionEarnings";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();

  const [meetings, setMeetings] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [teams, setTeams] = useState([]);
  const [teamStats, setTeamStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Check if user has agreed to terms
  useEffect(() => {
    const checkTermsAgreement = async () => {
      try {
        const response = await authAPI.checkTermsAgreement();
        console.log("Terms agreement response:", response);
        // If user hasn't agreed, show modal
        if (!response.data || !response.data.termsAgreed) {
          setShowTermsModal(true);
        } else {
          setShowTermsModal(false);
        }
      } catch (err) {
        console.warn("Could not check terms agreement:", err);
        // Show modal if we can't verify (better safe than sorry)
        setShowTermsModal(true);
      }
    };

    if (isAuthenticated && user) {
      checkTermsAgreement();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch upcoming meetings (user endpoint, not admin)
        try {
          const meetingsRes = await meetingAPI.getUpcomingMeetings();
          console.log("Meetings Response:", meetingsRes);
          // Note: API returns meetings in 'message' field, not 'data'
          const meetingData = Array.isArray(meetingsRes.message) ? meetingsRes.message : meetingsRes.data || [];
          setMeetings(Array.isArray(meetingData) ? meetingData : []);
        } catch (err) {
          console.warn("Could not fetch meetings:", err);
        }

        // Fetch announcements
        try {
          const announcementsRes = await announcementAPI.getAnnouncements();
          const announcementData = announcementsRes.data || announcementsRes;
          // Handle nested response: announcementData.announcements or announcementData as array
          const announcementList = announcementData?.announcements || announcementData?.message?.announcements || (Array.isArray(announcementData) ? announcementData : []);
          setAnnouncements(Array.isArray(announcementList) ? announcementList : []);
        } catch (err) {
          console.warn("Could not fetch announcements:", err);
        }

        // Fetch payment history
        try {
          const paymentsRes = await paymentAPI.getPaymentHistory();
          setPaymentHistory(Array.isArray(paymentsRes.data) ? paymentsRes.data : paymentsRes || []);
        } catch (err) {
          console.warn("Could not fetch payment history:", err);
        }

        // Fetch teams
        try {
          const teamsRes = await teamAPI.getTeams();
          setTeams(Array.isArray(teamsRes.data) ? teamsRes.data : teamsRes || []);
        } catch (err) {
          console.warn("Could not fetch teams:", err);
        }

        // Fetch team statistics (direct count & total downline)
        try {
          const teamStatsRes = await teamAPI.getTeamStats();
          console.log('Team Stats Response:', teamStatsRes);
          if (teamStatsRes.success && teamStatsRes.data) {
            console.log('Team Stats Data:', teamStatsRes.data);
            setTeamStats(teamStatsRes.data);
          } else if (teamStatsRes.data) {
            // Handle case where success flag might be missing
            console.log('Team Stats Data (no success flag):', teamStatsRes.data);
            setTeamStats(teamStatsRes.data);
          }
        } catch (err) {
          console.warn("Could not fetch team stats:", err);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load some dashboard data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, navigate]);

  // Socket listener for real-time announcement updates
  useEffect(() => {
    if (!socket) return;

    // Listen for new announcement
    socket.on('announcement_created', (data) => {
      console.log('📊 Dashboard: New announcement received', data);
      if (data.announcementData) {
        setAnnouncements((prev) => [data.announcementData, ...prev]);
      }
    });

    // Listen for announcement deletion
    socket.on('announcement_deleted', (data) => {
      console.log('📊 Dashboard: Announcement deleted', data);
      setAnnouncements((prev) =>
        prev.filter((ann) => ann._id !== data.announcementId)
      );
    });

    // Listen for announcement update
    socket.on('announcement_updated', (data) => {
      console.log('📊 Dashboard: Announcement updated', data);
      setAnnouncements((prev) =>
        prev.map((ann) =>
          ann._id === data.announcementId ? { ...ann, ...data.updatedData } : ann
        )
      );
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off('announcement_created');
      socket.off('announcement_deleted');
      socket.off('announcement_updated');
    };
  }, [socket]);

  const StatCard = ({ title, value, icon, color }) => (
    <div
      style={{
        backgroundColor: "#1A2A3A",
        border: "1px solid #2A4A5A",
        borderRadius: "12px",
        padding: "24px",
        marginBottom: "20px",
        flex: "1 1 calc(50% - 10px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <p style={{ color: "#5DDDD2", fontSize: "12px", margin: 0 }}>
            {title}
          </p>
          <h3 style={{ color: "#DAFAF4", fontSize: "28px", margin: "8px 0 0 0" }}>
            {value || "0"}
          </h3>
        </div>
        <div
          style={{
            fontSize: "32px",
            color: color,
            opacity: 0.7,
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );

  const ListItem = ({ title, subtitle, meta, onClick }) => (
    <div
      onClick={onClick}
      style={{
        padding: "16px",
        borderBottom: "1px solid #2A4A5A",
        cursor: onClick ? "pointer" : "default",
        transition: onClick ? "background-color 0.2s" : "none",
      }}
      onMouseOver={(e) => {
        if (onClick) e.currentTarget.style.backgroundColor = "#252525";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <p style={{ color: "#DAFAF4", margin: "0 0 4px 0", fontWeight: "bold" }}>
            {title}
          </p>
          {subtitle && (
            <p style={{ color: "#5DDDD2", margin: 0, fontSize: "12px" }}>
              {subtitle}
            </p>
          )}
        </div>
        {meta && (
          <span style={{ color: "#4CD3C8", fontSize: "12px", fontWeight: "bold" }}>
            {meta}
          </span>
        )}
      </div>
    </div>
  );

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
          <p style={{ color: "#DAFAF4" }}>Loading dashboard...</p>
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
                backgroundColor: "#4CD3C8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                fontWeight: "bold",
                color: "#0B1929",
              }}
            >
              {user?.fname?.charAt(0)?.toUpperCase() || "U"}
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
                Welcome, {user?.fname}! 👋
              </h1>
              <p style={{ color: "#5DDDD2", margin: 0 }}>
                Here's what's happening with your account today
              </p>
            </div>
          </div>
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

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "30px",
            borderBottom: "1px solid #2A4A5A",
            overflow: "auto",
            paddingBottom: "12px",
          }}
        >
          {["overview", "meetings", "announcements", "payments", "teams"].map((tab) => {
            let count = 0;
            if (tab === "meetings") count = meetings.length;
            else if (tab === "announcements") count = announcements.length;
            else if (tab === "payments") count = paymentHistory.length;
            else if (tab === "teams") count = teams.length;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "12px 24px",
                  backgroundColor: activeTab === tab ? "#4CD3C8" : "transparent",
                  color: activeTab === tab ? "#0B1929" : "#5DDDD2",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: activeTab === tab ? "bold" : "normal",
                  whiteSpace: "nowrap",
                  transition: "all 0.3s",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab !== "overview" && (
                  <span
                    style={{
                      backgroundColor: activeTab === tab ? "#0B1929" : "#4CD3C8",
                      color: activeTab === tab ? "#4CD3C8" : "#0B1929",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      minWidth: "24px",
                      textAlign: "center",
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div>
            {/* Stats Grid */}
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "40px" }}>
              <StatCard
                title="Total Meetings"
                value={meetings.length}
                icon="📅"
                color="#4CD3C8"
              />
              <StatCard
                title="Announcements"
                value={announcements.length}
                icon="📢"
                color="#5DDDD2"
              />
              <StatCard
                title="Team Members"
                value={teamStats?.totalActiveAffiliates || teamStats?.totalDownline || 0}
                icon="👥"
                color="#DAFAF4"
              />
              <StatCard
                title="Transactions"
                value={paymentHistory.length}
                icon="💳"
                color="#4CD3C8"
              />
            </div>

            {/* Team Statistics Section */}
            <div
              style={{
                backgroundColor: "#1A2A3A",
                border: "1px solid #2A4A5A",
                borderRadius: "12px",
                padding: "24px",
                marginBottom: "30px",
              }}
            >
              <h3 style={{ color: "#DAFAF4", marginTop: 0, marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "28px" }}>👥</span>
                Your Team Statistics
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "20px",
                }}
              >
                {/* Direct Referrals */}
                <div
                  style={{
                    backgroundColor: "rgba(6, 214, 160, 0.1)",
                    padding: "20px",
                    borderRadius: "12px",
                    border: "2px solid #06d6a0",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                    <span style={{ fontSize: "24px" }}>🤝</span>
                    <p
                      style={{
                        color: "#5DDDD2",
                        fontSize: "13px",
                        textTransform: "uppercase",
                        margin: 0,
                        fontWeight: "600",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Direct Referrals
                    </p>
                  </div>
                  <p
                    style={{
                      color: "#DAFAF4",
                      fontSize: "32px",
                      fontWeight: "bold",
                      margin: 0,
                    }}
                  >
                    {teamStats?.directCount || 0}
                  </p>
                  <p style={{ color: "#06d6a0", fontSize: "12px", marginTop: "8px", margin: 0 }}>
                    First-level referrals
                  </p>
                </div>

                {/* Binary Rank */}
                {teamStats?.binaryRank && (
                  <div
                    style={{
                      backgroundColor: "rgba(245, 158, 11, 0.1)",
                      padding: "20px",
                      borderRadius: "12px",
                      border: "2px solid #f59e0b",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                      <span style={{ fontSize: "24px" }}>🏆</span>
                      <p
                        style={{
                          color: "#f59e0b",
                          fontSize: "13px",
                          textTransform: "uppercase",
                          margin: 0,
                          fontWeight: "600",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Binary Rank
                      </p>
                    </div>
                    <p
                      style={{
                        color: "#DAFAF4",
                        fontSize: "24px",
                        fontWeight: "bold",
                        margin: 0,
                      }}
                    >
                      {teamStats.binaryRank}
                    </p>
                    <p style={{ color: "#f59e0b", fontSize: "12px", marginTop: "8px", margin: 0 }}>
                      {teamStats.binaryBonusPercent ? `${teamStats.binaryBonusPercent}% bonus` : 'Current rank'}
                    </p>
                  </div>
                )}
               
              </div>
            </div>

            {/* Commission Earnings Section */}
            {/* <div style={{ marginBottom: "40px" }}>
              <CommissionEarnings />
            </div> */}

            {/* Quick Actions */}
            <div
              style={{
                backgroundColor: "#1A2A3A",
                border: "1px solid #2A4A5A",
                borderRadius: "12px",
                padding: "24px",
                marginBottom: "30px",
              }}
            >
              <h3 style={{ color: "#DAFAF4", marginTop: 0, marginBottom: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "28px" }}>⚡</span>
                Quick Actions
              </h3>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <button
                  onClick={() => navigate("/rewards")}
                  style={{
                    padding: "16px 24px",
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    transition: "all 0.3s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(16, 185, 129, 0.3)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <span style={{ fontSize: "24px" }}>🎁</span>
                  View Binary Rewards
                </button>
                {/* <button
                  onClick={() => navigate("/teams")}
                  style={{
                    padding: "16px 24px",
                    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    transition: "all 0.3s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(99, 102, 241, 0.3)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                > */}
                  {/* <span style={{ fontSize: "24px" }}>👥</span>
                  Manage Teams
                </button>
                <button
                  onClick={() => navigate("/referral")}
                  style={{
                    padding: "16px 24px",
                    background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    transition: "all 0.3s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(245, 158, 11, 0.3)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                > */}
                  {/* <span style={{ fontSize: "24px" }}>🔗</span>
                  Referral Link
                </button> */}
              </div>
            </div>

            {/* Quick Summary */}
            <div
              style={{
                backgroundColor: "#1A2A3A",
                border: "1px solid #2A4A5A",
                borderRadius: "12px",
                padding: "24px",
              }}
            >
              <h3 style={{ color: "#DAFAF4", marginTop: 0 }}>Account Summary</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
                <div>
                  <p style={{ color: "#5DDDD2", fontSize: "12px" }}>Full Name</p>
                  <p style={{ color: "#DAFAF4", fontSize: "16px", fontWeight: "bold", margin: 0 }}>
                    {user?.fname} {user?.lname}
                  </p>
                </div>
                <div>
                  <p style={{ color: "#5DDDD2", fontSize: "12px" }}>Email</p>
                  <p style={{ color: "#DAFAF4", fontSize: "16px", fontWeight: "bold", margin: 0 }}>
                    {user?.email}
                  </p>
                </div>
                <div>
                  <p style={{ color: "#5DDDD2", fontSize: "12px" }}>Role</p>
                  <p style={{ color: "#DAFAF4", fontSize: "16px", fontWeight: "bold", margin: 0 }}>
                    {user?.role || "User"}
                  </p>
                </div>
                {user?.phone && (
                  <div>
                    <p style={{ color: "#5DDDD2", fontSize: "12px" }}>Phone</p>
                    <p style={{ color: "#DAFAF4", fontSize: "16px", fontWeight: "bold", margin: 0 }}>
                      {user?.phone}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Meetings Tab */}
        {activeTab === "meetings" && (
          <div
            style={{
              backgroundColor: "#1A2A3A",
              border: "1px solid #2A4A5A",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "24px", borderBottom: "1px solid #2A4A5A" }}>
              <h3 style={{ color: "#DAFAF4", margin: 0 }}>Meetings ({meetings.length})</h3>
            </div>
            {meetings.length > 0 ? (
              meetings.slice(0, 10).map((meeting, idx) => (
                <ListItem
                  key={idx}
                  title={meeting.title || meeting.name}
                  subtitle={meeting.description || meeting.date}
                  meta={meeting.status || "Upcoming"}
                />
              ))
            ) : (
              <div style={{ padding: "24px", textAlign: "center", color: "#5DDDD2" }}>
                No meetings scheduled yet
              </div>
            )}
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === "announcements" && (
          <div
            style={{
              backgroundColor: "#1A2A3A",
              border: "1px solid #2A4A5A",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "24px", borderBottom: "1px solid #2A4A5A" }}>
              <h3 style={{ color: "#DAFAF4", margin: 0 }}>Announcements ({announcements.length})</h3>
            </div>
            {announcements.length > 0 ? (
              announcements.slice(0, 10).map((announcement, idx) => (
                <ListItem
                  key={idx}
                  title={announcement.title}
                  subtitle={announcement.description || "No description"}
                  meta={announcement.flag || "Normal"}
                />
              ))
            ) : (
              <div style={{ padding: "24px", textAlign: "center", color: "#5DDDD2" }}>
                No announcements at the moment
              </div>
            )}
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === "payments" && (
          <div
            style={{
              backgroundColor: "#1A2A3A",
              border: "1px solid #2A4A5A",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "24px", borderBottom: "1px solid #2A4A5A" }}>
              <h3 style={{ color: "#DAFAF4", margin: 0 }}>Payment History ({paymentHistory.length})</h3>
            </div>
            {paymentHistory.length > 0 ? (
              paymentHistory.slice(0, 10).map((payment, idx) => (
                <ListItem
                  key={idx}
                  title={`${payment.amount || "N/A"} ${payment.currency || "USD"}`}
                  subtitle={payment.description || payment.date}
                  meta={payment.status || "Pending"}
                />
              ))
            ) : (
              <div style={{ padding: "24px", textAlign: "center", color: "#5DDDD2" }}>
                No transactions yet
              </div>
            )}
          </div>
        )}

        {/* Teams Tab */}
        {activeTab === "teams" && (
          <div
            style={{
              backgroundColor: "#1A2A3A",
              border: "1px solid #2A4A5A",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "24px", borderBottom: "1px solid #2A4A5A" }}>
              <h3 style={{ color: "#DAFAF4", margin: 0 }}>Teams ({teams.length})</h3>
            </div>
            {teams.length > 0 ? (
              teams.slice(0, 10).map((team, idx) => (
                <ListItem
                  key={idx}
                  title={team.name}
                  subtitle={team.description || "No description"}
                  meta={`${team.members?.length || 0} Members`}
                />
              ))
            ) : (
              <div style={{ padding: "24px", textAlign: "center", color: "#5DDDD2" }}>
                No teams created yet
              </div>
            )}
          </div>
        )}
      </div>

      {/* Terms Agreement Modal */}
      {showTermsModal && (
        <TermsAgreementModal
          user={user}
          onClose={() => setShowTermsModal(false)}
        />
      )}
    </div>
  );
}


