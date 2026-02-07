import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { teamAPI } from "../../services/api";

export default function TeamsPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    fetchTeams();
  }, [isAuthenticated, navigate]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await teamAPI.getTeams();
      const data = response.data || response;
      setTeams(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to fetch teams");
      setTeams([]);
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
          <p style={{ color: "#DAFAF4" }}>Loading teams...</p>
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
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <h1
            style={{
              fontSize: "32px",
              color: "#DAFAF4",
              margin: "0 0 10px 0",
              fontWeight: "bold",
            }}
          >
            👥 Teams
          </h1>
          <p style={{ color: "#5DDDD2", margin: 0 }}>
            Browse all available teams ({teams.length})
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              marginBottom: "20px",
              padding: "12px 16px",
              backgroundColor: "#ff4444",
              color: "#fff",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        {/* Teams Grid */}
        {teams.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px",
              marginBottom: "40px",
            }}
          >
            {teams.map((team) => (
              <div
                key={team._id}
                onClick={() => setSelectedTeam(team)}
                style={{
                  backgroundColor: "#1A2A3A",
                  border: "1px solid #2A4A5A",
                  borderRadius: "12px",
                  padding: "24px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = "#4CD3C8";
                  e.currentTarget.style.boxShadow = "0 0 20px rgba(17, 228, 79, 0.1)";
                  e.currentTarget.style.transform = "translateY(-5px)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "#2A4A5A";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    backgroundColor: "#4CD3C8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                    fontSize: "28px",
                    color: "#0B1929",
                    fontWeight: "bold",
                  }}
                >
                  {team.name?.charAt(0)?.toUpperCase() || "T"}
                </div>

                <h3
                  style={{
                    color: "#DAFAF4",
                    fontSize: "18px",
                    margin: "0 0 8px 0",
                    fontWeight: "bold",
                  }}
                >
                  {team.name}
                </h3>

                <p
                  style={{
                    color: "#5DDDD2",
                    fontSize: "13px",
                    margin: "0 0 12px 0",
                    minHeight: "40px",
                  }}
                >
                  {team.description || "No description provided"}
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#4CD3C8",
                    fontSize: "13px",
                    fontWeight: "bold",
                  }}
                >
                  👥 {team.members?.length || 0} Members
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              backgroundColor: "#1A2A3A",
              border: "1px solid #2A4A5A",
              borderRadius: "12px",
              padding: "60px 40px",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#5DDDD2", fontSize: "16px", margin: 0 }}>
              No teams available yet
            </p>
          </div>
        )}

        {/* Team Detail Modal */}
        {selectedTeam && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              zIndex: 1000,
            }}
            onClick={() => setSelectedTeam(null)}
          >
            <div
              style={{
                backgroundColor: "#1A2A3A",
                border: "1px solid #2A4A5A",
                borderRadius: "16px",
                padding: "40px",
                maxWidth: "500px",
                width: "100%",
                maxHeight: "80vh",
                overflow: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  marginBottom: "30px",
                  alignItems: "start",
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    backgroundColor: "#4CD3C8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "40px",
                    color: "#0B1929",
                    fontWeight: "bold",
                    flexShrink: 0,
                  }}
                >
                  {selectedTeam.name?.charAt(0)?.toUpperCase() || "T"}
                </div>

                <div style={{ flex: 1 }}>
                  <h2
                    style={{
                      color: "#DAFAF4",
                      fontSize: "24px",
                      margin: "0 0 8px 0",
                      fontWeight: "bold",
                    }}
                  >
                    {selectedTeam.name}
                  </h2>
                  <p
                    style={{
                      color: "#5DDDD2",
                      margin: 0,
                      fontSize: "13px",
                    }}
                  >
                    👥 {selectedTeam.members?.length || 0} Members
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: "30px", paddingBottom: "30px", borderBottom: "1px solid #2A4A5A" }}>
                <h3 style={{ color: "#DAFAF4", margin: "0 0 12px 0" }}>About</h3>
                <p
                  style={{
                    color: "#DAFAF4",
                    margin: 0,
                    lineHeight: "1.6",
                    fontSize: "14px",
                  }}
                >
                  {selectedTeam.description || "No description provided"}
                </p>
              </div>

              {selectedTeam.members && selectedTeam.members.length > 0 && (
                <div style={{ marginBottom: "30px" }}>
                  <h3 style={{ color: "#DAFAF4", margin: "0 0 12px 0" }}>Members</h3>
                  <div style={{ display: "grid", gap: "8px" }}>
                    {selectedTeam.members.map((member, idx) => (
                      <div
                        key={idx}
                        style={{
                          backgroundColor: "#252525",
                          padding: "12px 16px",
                          borderRadius: "8px",
                          color: "#DAFAF4",
                          fontSize: "13px",
                        }}
                      >
                        {typeof member === "string" ? member : member.name || member.email || "Member"}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedTeam(null)}
                style={{
                  width: "100%",
                  backgroundColor: "#4CD3C8",
                  color: "#0B1929",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#4CD3C8";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#4CD3C8";
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


