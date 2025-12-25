import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { meetingAPI } from "../../services/api";

export default function MeetingsPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    fetchMeetings();
  }, [isAuthenticated, navigate]);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await meetingAPI.getAllMeetings();
      const data = response.data || response;
      setMeetings(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to fetch meetings");
      setMeetings([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
      case "upcoming":
        return "#11E44F";
      case "ongoing":
      case "in progress":
        return "#FFA500";
      case "completed":
      case "finished":
        return "#8AFFAC";
      case "cancelled":
        return "#ff4444";
      default:
        return "#8AFFAC";
    }
  };

  const filteredMeetings = meetings.filter((meeting) => {
    if (filterStatus === "all") return true;
    return meeting.status?.toLowerCase() === filterStatus.toLowerCase();
  });

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
          <p style={{ color: "#DAFAF4" }}>Loading meetings...</p>
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
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
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
            📅 Meetings
          </h1>
          <p style={{ color: "#8AFFAC", margin: 0 }}>
            View all scheduled meetings ({filteredMeetings.length})
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

        {/* Filter Buttons */}
        {meetings.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginBottom: "30px",
              flexWrap: "wrap",
            }}
          >
            {["all", "scheduled", "upcoming", "ongoing", "completed"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                style={{
                  backgroundColor:
                    filterStatus === status ? "#11E44F" : "#252525",
                  color:
                    filterStatus === status ? "#121212" : "#8AFFAC",
                  border: filterStatus === status ? "none" : "1px solid #313131",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  textTransform: "capitalize",
                }}
                onMouseOver={(e) => {
                  if (filterStatus !== status) {
                    e.target.style.backgroundColor = "#313131";
                  }
                }}
                onMouseOut={(e) => {
                  if (filterStatus !== status) {
                    e.target.style.backgroundColor = "#252525";
                  }
                }}
              >
                {status}
              </button>
            ))}
          </div>
        )}

        {/* Meetings List */}
        {filteredMeetings.length > 0 ? (
          <div style={{ display: "grid", gap: "16px" }}>
            {filteredMeetings.map((meeting) => (
              <div
                key={meeting._id}
                onClick={() => setSelectedMeeting(meeting)}
                style={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #313131",
                  borderRadius: "12px",
                  padding: "24px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = "#11E44F";
                  e.currentTarget.style.boxShadow = "0 0 20px rgba(17, 228, 79, 0.1)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "#313131";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    marginBottom: "12px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        color: "#DAFAF4",
                        fontSize: "18px",
                        margin: "0 0 8px 0",
                        fontWeight: "bold",
                      }}
                    >
                      {meeting.title || meeting.name || "Untitled Meeting"}
                    </h3>
                    <p
                      style={{
                        color: "#8AFFAC",
                        margin: 0,
                        fontSize: "13px",
                      }}
                    >
                      📍 {meeting.location || "Location TBD"}
                    </p>
                  </div>

                  <span
                    style={{
                      backgroundColor: getStatusColor(meeting.status),
                      color: "#121212",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      marginLeft: "12px",
                      textTransform: "capitalize",
                    }}
                  >
                    {meeting.status || "Scheduled"}
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    marginTop: "16px",
                  }}
                >
                  <div>
                    <p
                      style={{
                        color: "#8AFFAC",
                        fontSize: "11px",
                        margin: "0 0 4px 0",
                      }}
                    >
                      Date & Time
                    </p>
                    <p
                      style={{
                        color: "#DAFAF4",
                        fontSize: "13px",
                        margin: 0,
                        fontWeight: "bold",
                      }}
                    >
                      {meeting.date ? new Date(meeting.date).toLocaleDateString() : "TBD"}
                    </p>
                    {meeting.time && (
                      <p
                        style={{
                          color: "#8AFFAC",
                          fontSize: "12px",
                          margin: "2px 0 0 0",
                        }}
                      >
                        {meeting.time}
                      </p>
                    )}
                  </div>

                  <div>
                    <p
                      style={{
                        color: "#8AFFAC",
                        fontSize: "11px",
                        margin: "0 0 4px 0",
                      }}
                    >
                      Duration
                    </p>
                    <p
                      style={{
                        color: "#DAFAF4",
                        fontSize: "13px",
                        margin: 0,
                        fontWeight: "bold",
                      }}
                    >
                      {meeting.duration || "30 mins"}
                    </p>
                  </div>
                </div>

                {meeting.description && (
                  <p
                    style={{
                      color: "#8AFFAC",
                      fontSize: "13px",
                      margin: "12px 0 0 0",
                      lineHeight: "1.4",
                    }}
                  >
                    {meeting.description.substring(0, 80)}
                    {meeting.description.length > 80 ? "..." : ""}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              backgroundColor: "#1a1a1a",
              border: "1px solid #313131",
              borderRadius: "12px",
              padding: "60px 40px",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#8AFFAC", fontSize: "16px", margin: 0 }}>
              {filterStatus === "all"
                ? "No meetings scheduled yet"
                : `No ${filterStatus} meetings`}
            </p>
          </div>
        )}

        {/* Meeting Detail Modal */}
        {selectedMeeting && (
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
            onClick={() => setSelectedMeeting(null)}
          >
            <div
              style={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #313131",
                borderRadius: "16px",
                padding: "40px",
                maxWidth: "600px",
                width: "100%",
                maxHeight: "80vh",
                overflow: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  marginBottom: "24px",
                }}
              >
                <div style={{ flex: 1 }}>
                  <h2
                    style={{
                      color: "#DAFAF4",
                      fontSize: "24px",
                      margin: "0 0 8px 0",
                      fontWeight: "bold",
                    }}
                  >
                    {selectedMeeting.title || selectedMeeting.name}
                  </h2>
                  <p
                    style={{
                      color: "#8AFFAC",
                      margin: 0,
                      fontSize: "13px",
                    }}
                  >
                    📍 {selectedMeeting.location || "Location TBD"}
                  </p>
                </div>

                <span
                  style={{
                    backgroundColor: getStatusColor(selectedMeeting.status),
                    color: "#121212",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                    textTransform: "capitalize",
                  }}
                >
                  {selectedMeeting.status || "Scheduled"}
                </span>
              </div>

              <div
                style={{
                  backgroundColor: "#252525",
                  padding: "20px",
                  borderRadius: "8px",
                  marginBottom: "24px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                }}
              >
                <div>
                  <p
                    style={{
                      color: "#8AFFAC",
                      fontSize: "12px",
                      textTransform: "uppercase",
                      margin: "0 0 8px 0",
                      fontWeight: "bold",
                    }}
                  >
                    Date
                  </p>
                  <p
                    style={{
                      color: "#DAFAF4",
                      fontSize: "16px",
                      margin: 0,
                      fontWeight: "bold",
                    }}
                  >
                    {selectedMeeting.date
                      ? new Date(selectedMeeting.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "TBD"}
                  </p>
                </div>

                <div>
                  <p
                    style={{
                      color: "#8AFFAC",
                      fontSize: "12px",
                      textTransform: "uppercase",
                      margin: "0 0 8px 0",
                      fontWeight: "bold",
                    }}
                  >
                    Time
                  </p>
                  <p
                    style={{
                      color: "#DAFAF4",
                      fontSize: "16px",
                      margin: 0,
                      fontWeight: "bold",
                    }}
                  >
                    {selectedMeeting.time || "TBD"}
                  </p>
                </div>

                <div>
                  <p
                    style={{
                      color: "#8AFFAC",
                      fontSize: "12px",
                      textTransform: "uppercase",
                      margin: "0 0 8px 0",
                      fontWeight: "bold",
                    }}
                  >
                    Duration
                  </p>
                  <p
                    style={{
                      color: "#DAFAF4",
                      fontSize: "16px",
                      margin: 0,
                      fontWeight: "bold",
                    }}
                  >
                    {selectedMeeting.duration || "30 mins"}
                  </p>
                </div>

                <div>
                  <p
                    style={{
                      color: "#8AFFAC",
                      fontSize: "12px",
                      textTransform: "uppercase",
                      margin: "0 0 8px 0",
                      fontWeight: "bold",
                    }}
                  >
                    Organizer
                  </p>
                  <p
                    style={{
                      color: "#DAFAF4",
                      fontSize: "16px",
                      margin: 0,
                      fontWeight: "bold",
                    }}
                  >
                    {selectedMeeting.organizer || "N/A"}
                  </p>
                </div>
              </div>

              {selectedMeeting.description && (
                <div style={{ marginBottom: "24px" }}>
                  <h3 style={{ color: "#DAFAF4", margin: "0 0 12px 0" }}>
                    Description
                  </h3>
                  <p
                    style={{
                      color: "#DAFAF4",
                      lineHeight: "1.6",
                      margin: 0,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {selectedMeeting.description}
                  </p>
                </div>
              )}

              {selectedMeeting.attendees && selectedMeeting.attendees.length > 0 && (
                <div style={{ marginBottom: "24px" }}>
                  <h3 style={{ color: "#DAFAF4", margin: "0 0 12px 0" }}>
                    Attendees ({selectedMeeting.attendees.length})
                  </h3>
                  <div style={{ display: "grid", gap: "8px" }}>
                    {selectedMeeting.attendees.map((attendee, idx) => (
                      <div
                        key={idx}
                        style={{
                          backgroundColor: "#252525",
                          padding: "10px 12px",
                          borderRadius: "6px",
                          color: "#DAFAF4",
                          fontSize: "13px",
                        }}
                      >
                        {typeof attendee === "string" ? attendee : attendee.name || attendee.email || "Attendee"}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedMeeting(null)}
                style={{
                  width: "100%",
                  backgroundColor: "#11E44F",
                  color: "#121212",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#0FCC41";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#11E44F";
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
