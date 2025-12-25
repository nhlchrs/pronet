import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { authAPI, meetingAPI, announcementAPI, paymentAPI, teamAPI } from "../../services/api";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch metrics
        try {
          const metricsRes = await authAPI.getUserMetrics();
          setMetrics(metricsRes.data || metricsRes);
        } catch (err) {
          console.warn("Could not fetch metrics:", err);
        }

        // Fetch meetings
        try {
          const meetingsRes = await meetingAPI.getAllMeetings();
          setMeetings(Array.isArray(meetingsRes.data) ? meetingsRes.data : meetingsRes || []);
        } catch (err) {
          console.warn("Could not fetch meetings:", err);
        }

        // Fetch announcements
        try {
          const announcementsRes = await announcementAPI.getAnnouncements();
          setAnnouncements(Array.isArray(announcementsRes.data) ? announcementsRes.data : announcementsRes || []);
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
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load some dashboard data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, navigate]);

  const StatCard = ({ title, value, icon, color }) => (
    <div
      style={{
        backgroundColor: "#1a1a1a",
        border: "1px solid #313131",
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
          <p style={{ color: "#8AFFAC", fontSize: "12px", margin: 0 }}>
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
        borderBottom: "1px solid #313131",
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
            <p style={{ color: "#8AFFAC", margin: 0, fontSize: "12px" }}>
              {subtitle}
            </p>
          )}
        </div>
        {meta && (
          <span style={{ color: "#11E44F", fontSize: "12px", fontWeight: "bold" }}>
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
          backgroundColor: "#121212",
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
              border: "3px solid #11E44F",
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
        backgroundColor: "#121212",
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
                backgroundColor: "#11E44F",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                fontWeight: "bold",
                color: "#121212",
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
              <p style={{ color: "#8AFFAC", margin: 0 }}>
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
            borderBottom: "1px solid #313131",
            overflow: "auto",
            paddingBottom: "12px",
          }}
        >
          {["overview", "meetings", "announcements", "payments", "teams"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "12px 24px",
                backgroundColor: activeTab === tab ? "#11E44F" : "transparent",
                color: activeTab === tab ? "#121212" : "#8AFFAC",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: activeTab === tab ? "bold" : "normal",
                whiteSpace: "nowrap",
                transition: "all 0.3s",
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
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
                color="#11E44F"
              />
              <StatCard
                title="Announcements"
                value={announcements.length}
                icon="📢"
                color="#8AFFAC"
              />
              <StatCard
                title="Teams"
                value={teams.length}
                icon="👥"
                color="#DAFAF4"
              />
              <StatCard
                title="Transactions"
                value={paymentHistory.length}
                icon="💳"
                color="#11E44F"
              />
            </div>

            {/* Metrics */}
            {metrics && (
              <div
                style={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #313131",
                  borderRadius: "12px",
                  padding: "24px",
                  marginBottom: "30px",
                }}
              >
                <h3 style={{ color: "#DAFAF4", marginTop: 0, marginBottom: "24px" }}>
                  Platform Metrics
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "20px",
                  }}
                >
                  {Object.entries(metrics)
                    .filter(([_, value]) => {
                      // Only show simple values, not complex objects
                      return (
                        typeof value === "number" ||
                        typeof value === "string" ||
                        typeof value === "boolean"
                      );
                    })
                    .map(([key, value]) => (
                      <div
                        key={key}
                        style={{
                          backgroundColor: "#252525",
                          padding: "16px",
                          borderRadius: "8px",
                          border: "1px solid #313131",
                        }}
                      >
                        <p
                          style={{
                            color: "#8AFFAC",
                            fontSize: "12px",
                            textTransform: "capitalize",
                            margin: 0,
                            marginBottom: "8px",
                            fontWeight: "bold",
                          }}
                        >
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </p>
                        <p
                          style={{
                            color: "#11E44F",
                            fontSize: "24px",
                            fontWeight: "bold",
                            margin: 0,
                          }}
                        >
                          {typeof value === "boolean"
                            ? value
                              ? "Active"
                              : "Inactive"
                            : value}
                        </p>
                      </div>
                    ))}
                </div>

                {/* Show complex metrics separately if any */}
                {Object.entries(metrics).some(
                  ([_, value]) =>
                    typeof value === "object" && value !== null
                ) && (
                  <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #313131" }}>
                    <h4 style={{ color: "#DAFAF4", marginTop: 0 }}>Additional Details</h4>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "16px",
                      }}
                    >
                      {Object.entries(metrics)
                        .filter(
                          ([_, value]) =>
                            typeof value === "object" && value !== null
                        )
                        .map(([key, value]) => (
                          <div
                            key={key}
                            style={{
                              backgroundColor: "#252525",
                              padding: "16px",
                              borderRadius: "8px",
                              border: "1px solid #313131",
                            }}
                          >
                            <p
                              style={{
                                color: "#8AFFAC",
                                fontSize: "12px",
                                textTransform: "capitalize",
                                margin: 0,
                                marginBottom: "8px",
                                fontWeight: "bold",
                              }}
                            >
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </p>
                            <ul style={{ color: "#DAFAF4", fontSize: "13px", margin: 0, paddingLeft: "20px" }}>
                              {Object.entries(value).map(([subKey, subValue]) => (
                                <li key={subKey} style={{ marginBottom: "4px" }}>
                                  <strong>{subKey}:</strong> {String(subValue)}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quick Summary */}
            <div
              style={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #313131",
                borderRadius: "12px",
                padding: "24px",
              }}
            >
              <h3 style={{ color: "#DAFAF4", marginTop: 0 }}>Account Summary</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
                <div>
                  <p style={{ color: "#8AFFAC", fontSize: "12px" }}>Full Name</p>
                  <p style={{ color: "#DAFAF4", fontSize: "16px", fontWeight: "bold", margin: 0 }}>
                    {user?.fname} {user?.lname}
                  </p>
                </div>
                <div>
                  <p style={{ color: "#8AFFAC", fontSize: "12px" }}>Email</p>
                  <p style={{ color: "#DAFAF4", fontSize: "16px", fontWeight: "bold", margin: 0 }}>
                    {user?.email}
                  </p>
                </div>
                <div>
                  <p style={{ color: "#8AFFAC", fontSize: "12px" }}>Role</p>
                  <p style={{ color: "#DAFAF4", fontSize: "16px", fontWeight: "bold", margin: 0 }}>
                    {user?.role || "User"}
                  </p>
                </div>
                {user?.phone && (
                  <div>
                    <p style={{ color: "#8AFFAC", fontSize: "12px" }}>Phone</p>
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
              backgroundColor: "#1a1a1a",
              border: "1px solid #313131",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "24px", borderBottom: "1px solid #313131" }}>
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
              <div style={{ padding: "24px", textAlign: "center", color: "#8AFFAC" }}>
                No meetings scheduled yet
              </div>
            )}
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === "announcements" && (
          <div
            style={{
              backgroundColor: "#1a1a1a",
              border: "1px solid #313131",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "24px", borderBottom: "1px solid #313131" }}>
              <h3 style={{ color: "#DAFAF4", margin: 0 }}>Announcements ({announcements.length})</h3>
            </div>
            {announcements.length > 0 ? (
              announcements.slice(0, 10).map((announcement, idx) => (
                <ListItem
                  key={idx}
                  title={announcement.title}
                  subtitle={announcement.content || "No description"}
                  meta={announcement.priority || "Normal"}
                />
              ))
            ) : (
              <div style={{ padding: "24px", textAlign: "center", color: "#8AFFAC" }}>
                No announcements at the moment
              </div>
            )}
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === "payments" && (
          <div
            style={{
              backgroundColor: "#1a1a1a",
              border: "1px solid #313131",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "24px", borderBottom: "1px solid #313131" }}>
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
              <div style={{ padding: "24px", textAlign: "center", color: "#8AFFAC" }}>
                No transactions yet
              </div>
            )}
          </div>
        )}

        {/* Teams Tab */}
        {activeTab === "teams" && (
          <div
            style={{
              backgroundColor: "#1a1a1a",
              border: "1px solid #313131",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "24px", borderBottom: "1px solid #313131" }}>
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
              <div style={{ padding: "24px", textAlign: "center", color: "#8AFFAC" }}>
                No teams created yet
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
