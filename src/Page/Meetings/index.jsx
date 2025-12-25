import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { meetingAPI } from "../../services/api";

export default function MeetingsPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [activeView, setActiveView] = useState("list"); // "list", "detail"
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [filterTab, setFilterTab] = useState("all"); // "all", "upcoming", "joined"
  
  // Missing state declarations
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scheduledAt: "",
    duration: "60",
    topic: "General",
  });

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
      const response = await meetingAPI.getUpcomingMeetings();
      
      // Backend returns: {status: 1, message: "string", data: [...meetings...]}
      const meetingList = response.data || response.message || response;
      
      // Ensure we have an array
      const meetings = Array.isArray(meetingList) ? meetingList : [];
      
      console.log("Fetched meetings:", meetings); // Debug log
      setMeetings(meetings);
    } catch (err) {
      console.warn("Could not fetch meetings:", err);
      setMeetings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateMeeting = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!formData.title.trim() || !formData.scheduledAt || !formData.duration) {
      setError("Title, date/time, and duration are required");
      return;
    }

    try {
      setLoading(true);
      await meetingAPI.createMeeting(formData);
      setSuccessMessage("Meeting created successfully!");
      setFormData({
        title: "",
        description: "",
        scheduledAt: "",
        duration: "60",
        topic: "General",
      });
      setTimeout(() => {
        setActiveView("list");
        fetchMeetings();
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to create meeting");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMeeting = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!formData.title.trim() || !formData.scheduledAt || !formData.duration) {
      setError("Title, date/time, and duration are required");
      return;
    }

    try {
      setLoading(true);
      await meetingAPI.updateMeeting(selectedMeeting._id, formData);
      setSuccessMessage("Meeting updated successfully!");
      setTimeout(() => {
        setActiveView("list");
        fetchMeetings();
        setIsEditing(false);
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to update meeting");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMeeting = async (meetingId) => {
    if (!window.confirm("Are you sure you want to delete this meeting?")) {
      return;
    }

    try {
      setLoading(true);
      await meetingAPI.deleteMeeting(meetingId);
      setSuccessMessage("Meeting deleted successfully!");
      setTimeout(() => {
        fetchMeetings();
        if (selectedMeeting?._id === meetingId) {
          setActiveView("list");
        }
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to delete meeting");
    } finally {
      setLoading(false);
    }
  };

  const handleViewMeeting = async (meetingId) => {
    try {
      setLoading(true);
      const response = await meetingAPI.getMeeting(meetingId);
      const data = response.data || response;
      setSelectedMeeting(data);
      setActiveView("detail");
    } catch (err) {
      setError(err.message || "Failed to fetch meeting");
    } finally {
      setLoading(false);
    }
  };

  const handleEditMeeting = () => {
    setFormData({
      title: selectedMeeting.title,
      description: selectedMeeting.description || "",
      scheduledAt: selectedMeeting.scheduledAt?.split('T')[0] || "",
      duration: selectedMeeting.duration?.toString() || "60",
      topic: selectedMeeting.topic || "General",
    });
    setIsEditing(true);
  };

  const handleJoinMeeting = async (meetingId) => {
    try {
      setError("");
      setLoading(true);
      const response = await meetingAPI.joinMeeting(meetingId);
      
      // Extract zoom link from response
      // Backend returns: {status, message: "string", data: {...joinData...}}
      const zoomLink = response.data?.zoomLink;
      
      if (zoomLink) {
        setSuccessMessage("Redirecting to Zoom meeting...");
        setTimeout(() => {
          window.open(zoomLink, "_blank");
          fetchMeetings();
        }, 500);
      } else {
        setError("Could not retrieve meeting link. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Failed to join meeting");
    } finally {
      setLoading(false);
    }
  };

  const getMeetingStatus = (scheduledAt) => {
    const now = new Date();
    const meetingDate = new Date(scheduledAt);
    
    if (meetingDate < now) return "Completed";
    if (meetingDate.getTime() - now.getTime() < 3600000) return "Starting Soon";
    return "Upcoming";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "#8AFFAC";
      case "Starting Soon":
        return "#FFA500";
      case "Upcoming":
        return "#11E44F";
      default:
        return "#8AFFAC";
    }
  };

  if (loading && meetings.length === 0 && activeView === "list") {
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
            {activeView === "list" && `Schedule and manage meetings (${meetings.length})`}
            {activeView === "create" && "Schedule a new meeting"}
            {activeView === "detail" && "Meeting details"}
          </p>
        </div>

        {/* Alert Messages */}
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

        {successMessage && (
          <div
            style={{
              marginBottom: "20px",
              padding: "12px 16px",
              backgroundColor: "#11E44F",
              color: "#121212",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            {successMessage}
          </div>
        )}

        {/* List View */}
        {activeView === "list" && (
          <div>
            {/* Tab Filter */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                marginBottom: "30px",
                flexWrap: "wrap",
              }}
            >
              {["all", "upcoming", "joined"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterTab(tab)}
                  style={{
                    backgroundColor:
                      filterTab === tab ? "#11E44F" : "#252525",
                    color:
                      filterTab === tab ? "#121212" : "#8AFFAC",
                    border: filterTab === tab ? "none" : "1px solid #313131",
                    padding: "10px 20px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    textTransform: "capitalize",
                  }}
                  onMouseOver={(e) => {
                    if (filterTab !== tab) {
                      e.target.style.backgroundColor = "#313131";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (filterTab !== tab) {
                      e.target.style.backgroundColor = "#252525";
                    }
                  }}
                >
                  {tab === "all" ? `📅 All (${meetings.length})` : `✨ ${tab}`}
                </button>
              ))}
            </div>

            {meetings.length > 0 ? (
              <div style={{ display: "grid", gap: "16px" }}>
                {meetings.map((meeting) => {
                  const status = getMeetingStatus(meeting.scheduledAt);
                  return (
                    <div
                      key={meeting._id}
                      style={{
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #313131",
                        borderRadius: "12px",
                        padding: "20px",
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
                          gap: "20px",
                        }}
                      >
                        <div style={{ flex: 1, cursor: "pointer" }} onClick={() => handleViewMeeting(meeting._id)}>
                          <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "8px", flexWrap: "wrap" }}>
                            <h3
                              style={{
                                color: "#DAFAF4",
                                fontSize: "18px",
                                margin: 0,
                                fontWeight: "bold",
                              }}
                            >
                              {meeting.title}
                            </h3>
                            <span
                              style={{
                                backgroundColor: getStatusColor(status),
                                color: "#121212",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                fontSize: "11px",
                                fontWeight: "bold",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {status}
                            </span>
                            {meeting.isInstant && (
                              <span
                                style={{
                                  backgroundColor: "#11E44F",
                                  color: "#121212",
                                  padding: "4px 8px",
                                  borderRadius: "4px",
                                  fontSize: "11px",
                                  fontWeight: "bold",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                ⚡ Instant
                              </span>
                            )}
                          </div>
                          
                          {/* Meeting Description */}
                          <p
                            style={{
                              color: "#8AFFAC",
                              margin: "0 0 12px 0",
                              fontSize: "13px",
                              lineHeight: "1.4",
                            }}
                          >
                            {meeting.description || "No description provided"}
                          </p>
                          
                          {/* Date and Time Section */}
                          {meeting.isInstant ? (
                            <div
                              style={{
                                backgroundColor: "rgba(17, 228, 79, 0.15)",
                                border: "2px solid #11E44F",
                                borderRadius: "6px",
                                padding: "12px",
                                marginBottom: "12px",
                                fontSize: "14px",
                                textAlign: "center",
                              }}
                            >
                              <span style={{ color: "#11E44F", fontWeight: "bold" }}>⚡ Starts Now</span>
                              <span style={{ color: "#DAFAF4", marginLeft: "8px" }}>
                                {meeting.duration} minutes
                              </span>
                            </div>
                          ) : (
                            <div
                              style={{
                                backgroundColor: "rgba(17, 228, 79, 0.1)",
                                border: "1px solid #11E44F",
                                borderRadius: "6px",
                                padding: "8px 12px",
                                marginBottom: "12px",
                                display: "grid",
                                gridTemplateColumns: "repeat(2, 1fr)",
                                gap: "12px",
                                fontSize: "12px",
                              }}
                            >
                              <div>
                                <span style={{ color: "#11E44F", fontWeight: "bold" }}>📅 Date:</span>
                                <span style={{ color: "#DAFAF4", marginLeft: "6px" }}>
                                  {new Date(meeting.scheduledAt).toLocaleDateString("en-US", {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                              <div>
                                <span style={{ color: "#11E44F", fontWeight: "bold" }}>⏰ Time:</span>
                                <span style={{ color: "#DAFAF4", marginLeft: "6px" }}>
                                  {new Date(meeting.scheduledAt).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  })}
                                </span>
                              </div>
                              <div>
                                <span style={{ color: "#11E44F", fontWeight: "bold" }}>⏱️ Duration:</span>
                                <span style={{ color: "#DAFAF4", marginLeft: "6px" }}>{meeting.duration} minutes</span>
                              </div>
                              <div>
                                <span style={{ color: "#11E44F", fontWeight: "bold" }}>🏁 Ends:</span>
                                <span style={{ color: "#DAFAF4", marginLeft: "6px" }}>
                                  {new Date(new Date(meeting.scheduledAt).getTime() + meeting.duration * 60000).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  })}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Meeting Details Grid */}
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(2, 1fr)",
                              gap: "12px",
                              fontSize: "12px",
                              marginBottom: "12px",
                            }}
                          >
                            <div>
                              <span style={{ color: "#11E44F", fontWeight: "bold" }}>🏷️ Topic:</span>
                              <span style={{ color: "#DAFAF4", marginLeft: "6px" }}>{meeting.topic || "General"}</span>
                            </div>
                            <div>
                              <span style={{ color: "#11E44F", fontWeight: "bold" }}>👥 Attendees:</span>
                              <span style={{ color: "#DAFAF4", marginLeft: "6px" }}>
                                {meeting.totalAttendees || 0}
                                {meeting.maxAttendees ? ` / ${meeting.maxAttendees}` : ""}
                              </span>
                            </div>
                            {meeting.isRecorded && (
                              <div>
                                <span style={{ color: "#11E44F", fontWeight: "bold" }}>🎥 Recording:</span>
                                <span style={{ color: "#DAFAF4", marginLeft: "6px" }}>Yes</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleJoinMeeting(meeting._id)}
                          style={{
                            backgroundColor: "#11E44F",
                            color: "#121212",
                            border: "none",
                            padding: "12px 24px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "13px",
                            fontWeight: "bold",
                            transition: "all 0.3s",
                            whiteSpace: "nowrap",
                            minWidth: "100px",
                            height: "fit-content",
                            alignSelf: "flex-start",
                          }}
                          onMouseOver={(e) => {
                            e.target.style.backgroundColor = "#0FCC41";
                            e.target.style.transform = "scale(1.05)";
                            e.target.style.boxShadow = "0 4px 12px rgba(17, 228, 79, 0.3)";
                          }}
                          onMouseOut={(e) => {
                            e.target.style.backgroundColor = "#11E44F";
                            e.target.style.transform = "scale(1)";
                            e.target.style.boxShadow = "none";
                          }}
                        >
                          Join Now
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #313131",
                  borderRadius: "12px",
                  padding: "40px",
                  textAlign: "center",
                }}
              >
                <p style={{ color: "#8AFFAC", fontSize: "16px", margin: 0 }}>
                  No meetings available. Check back soon!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Create/Edit View */}
        {(activeView === "create" || (activeView === "detail" && isEditing)) && isAdmin && (
          <div
            style={{
              backgroundColor: "#1a1a1a",
              border: "1px solid #313131",
              borderRadius: "12px",
              padding: "30px",
            }}
          >
            <p style={{ color: "#8AFFAC" }}>Admin meeting management is available in the Admin Panel.</p>
            <button
              onClick={() => setActiveView("list")}
              style={{
                backgroundColor: "transparent",
                color: "#8AFFAC",
                border: "1px solid #313131",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#252525";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
            >
              Back to Meetings
            </button>
          </div>
        )}

        {/* Detail View */}
        {activeView === "detail" && !isEditing && selectedMeeting && (
          <div
            style={{
              backgroundColor: "#1a1a1a",
              border: "1px solid #313131",
              borderRadius: "12px",
              padding: "30px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                marginBottom: "30px",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <h2
                    style={{
                      color: "#DAFAF4",
                      fontSize: "28px",
                      margin: 0,
                      fontWeight: "bold",
                    }}
                  >
                    {selectedMeeting.title}
                  </h2>
                  <span
                    style={{
                      backgroundColor: getStatusColor(getMeetingStatus(selectedMeeting.scheduledAt)),
                      color: "#121212",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {getMeetingStatus(selectedMeeting.scheduledAt)}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={() => handleJoinMeeting(selectedMeeting._id)}
                  style={{
                    backgroundColor: "#11E44F",
                    color: "#121212",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "bold",
                    transition: "all 0.3s",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#0FCC41";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "#11E44F";
                  }}
                >
                  Join Meeting
                </button>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                marginBottom: "30px",
              }}
            >
              {selectedMeeting.isInstant && (
                <div
                  style={{
                    backgroundColor: "#252525",
                    padding: "16px",
                    borderRadius: "8px",
                    borderLeft: "4px solid #11E44F",
                    gridColumn: "1 / -1",
                  }}
                >
                  <p style={{ color: "#11E44F", fontSize: "12px", margin: "0 0 4px 0", textTransform: "uppercase", fontWeight: "bold" }}>
                    ⚡ Meeting Type
                  </p>
                  <p style={{ color: "#11E44F", fontSize: "16px", margin: 0, fontWeight: "bold" }}>
                    Instant Meeting - Starts Now
                  </p>
                </div>
              )}
              
              <div
                style={{
                  backgroundColor: "#252525",
                  padding: "16px",
                  borderRadius: "8px",
                  borderLeft: "4px solid #11E44F",
                }}
              >
                <p style={{ color: "#8AFFAC", fontSize: "12px", margin: "0 0 4px 0", textTransform: "uppercase" }}>
                  📅 Date & Time
                </p>
                {selectedMeeting.isInstant ? (
                  <>
                    <p style={{ color: "#DAFAF4", fontSize: "16px", margin: "0 0 8px 0", fontWeight: "bold" }}>
                      Created on {new Date(selectedMeeting.createdAt).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p style={{ color: "#11E44F", fontSize: "14px", margin: 0, fontWeight: "bold" }}>
                      🕐 {new Date(selectedMeeting.scheduledAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  </>
                ) : (
                  <>
                    <p style={{ color: "#DAFAF4", fontSize: "16px", margin: "0 0 8px 0", fontWeight: "bold" }}>
                      {new Date(selectedMeeting.scheduledAt).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p style={{ color: "#DAFAF4", fontSize: "14px", margin: 0 }}>
                      🕐 Start: {new Date(selectedMeeting.scheduledAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                    <p style={{ color: "#DAFAF4", fontSize: "14px", margin: 0 }}>
                      🏁 End: {new Date(new Date(selectedMeeting.scheduledAt).getTime() + selectedMeeting.duration * 60000).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  </>
                )}
              </div>

              <div
                style={{
                  backgroundColor: "#252525",
                  padding: "16px",
                  borderRadius: "8px",
                  borderLeft: "4px solid #8AFFAC",
                }}
              >
                <p style={{ color: "#8AFFAC", fontSize: "12px", margin: "0 0 4px 0", textTransform: "uppercase" }}>
                  ⏱️ Duration
                </p>
                <p style={{ color: "#DAFAF4", fontSize: "16px", margin: 0, fontWeight: "bold" }}>
                  {selectedMeeting.duration} minutes
                </p>
              </div>

              <div
                style={{
                  backgroundColor: "#252525",
                  padding: "16px",
                  borderRadius: "8px",
                  borderLeft: "4px solid #11E44F",
                }}
              >
                <p style={{ color: "#8AFFAC", fontSize: "12px", margin: "0 0 4px 0", textTransform: "uppercase" }}>
                  🏷️ Topic
                </p>
                <p style={{ color: "#DAFAF4", fontSize: "16px", margin: 0, fontWeight: "bold" }}>
                  {selectedMeeting.topic || "General"}
                </p>
              </div>

              <div
                style={{
                  backgroundColor: "#252525",
                  padding: "16px",
                  borderRadius: "8px",
                  borderLeft: "4px solid #8AFFAC",
                }}
              >
                <p style={{ color: "#8AFFAC", fontSize: "12px", margin: "0 0 4px 0", textTransform: "uppercase" }}>
                  👥 Attendees
                </p>
                <p style={{ color: "#DAFAF4", fontSize: "16px", margin: 0, fontWeight: "bold" }}>
                  {selectedMeeting.totalAttendees || selectedMeeting.attendees?.length || 0}
                  {selectedMeeting.maxAttendees ? ` / ${selectedMeeting.maxAttendees}` : ""} registered
                </p>
              </div>
              
              {selectedMeeting.isRecorded && (
                <div
                  style={{
                    backgroundColor: "#252525",
                    padding: "16px",
                    borderRadius: "8px",
                    borderLeft: "4px solid #11E44F",
                  }}
                >
                  <p style={{ color: "#8AFFAC", fontSize: "12px", margin: "0 0 4px 0", textTransform: "uppercase" }}>
                    🎥 Recording
                  </p>
                  <p style={{ color: "#11E44F", fontSize: "16px", margin: 0, fontWeight: "bold" }}>
                    Yes, this meeting will be recorded
                  </p>
                </div>
              )}
            </div>

            {selectedMeeting.description && (
              <div
                style={{
                  backgroundColor: "#252525",
                  padding: "20px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  borderLeft: "4px solid #11E44F",
                }}
              >
                <h3 style={{ color: "#DAFAF4", margin: "0 0 12px 0" }}>Description</h3>
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

            <button
              onClick={() => setActiveView("list")}
              style={{
                backgroundColor: "transparent",
                color: "#8AFFAC",
                border: "1px solid #313131",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#252525";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
            >
              ← Back to Meetings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
