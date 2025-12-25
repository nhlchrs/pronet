import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { announcementAPI } from "../../services/api";

export default function AnnouncementsPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const isAdmin = user?.role === "Admin";

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [activeView, setActiveView] = useState("list"); // "list", "create", "detail"
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "Normal",
    category: "General",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    fetchAnnouncements();
  }, [isAuthenticated, navigate]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await announcementAPI.getAnnouncements();
      const data = response.data || response;
      setAnnouncements(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to fetch announcements");
      setAnnouncements([]);
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

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Title and content are required");
      return;
    }

    try {
      setLoading(true);
      await announcementAPI.createAnnouncement(formData);
      setSuccessMessage("Announcement created successfully!");
      setFormData({
        title: "",
        content: "",
        priority: "Normal",
        category: "General",
      });
      setTimeout(() => {
        setActiveView("list");
        fetchAnnouncements();
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to create announcement");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAnnouncement = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Title and content are required");
      return;
    }

    try {
      setLoading(true);
      await announcementAPI.updateAnnouncement(selectedAnnouncement._id, formData);
      setSuccessMessage("Announcement updated successfully!");
      setTimeout(() => {
        setActiveView("list");
        fetchAnnouncements();
        setIsEditing(false);
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to update announcement");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) {
      return;
    }

    try {
      setLoading(true);
      await announcementAPI.deleteAnnouncement(announcementId);
      setSuccessMessage("Announcement deleted successfully!");
      setTimeout(() => {
        fetchAnnouncements();
        if (selectedAnnouncement?._id === announcementId) {
          setActiveView("list");
        }
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to delete announcement");
    } finally {
      setLoading(false);
    }
  };

  const handleViewAnnouncement = async (announcementId) => {
    try {
      setLoading(true);
      const response = await announcementAPI.getAnnouncement(announcementId);
      const data = response.data || response;
      setSelectedAnnouncement(data);
      setActiveView("detail");
    } catch (err) {
      setError(err.message || "Failed to fetch announcement");
    } finally {
      setLoading(false);
    }
  };

  const handleEditAnnouncement = () => {
    setFormData({
      title: selectedAnnouncement.title,
      content: selectedAnnouncement.content,
      priority: selectedAnnouncement.priority || "Normal",
      category: selectedAnnouncement.category || "General",
    });
    setIsEditing(true);
  };

  if (loading && announcements.length === 0 && activeView === "list") {
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
          <p style={{ color: "#DAFAF4" }}>Loading announcements...</p>
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
            📢 Announcements
          </h1>
          <p style={{ color: "#8AFFAC", margin: 0 }}>
            {activeView === "list" && `Manage and view all announcements (${announcements.length})`}
            {activeView === "create" && "Create a new announcement"}
            {activeView === "detail" && "Announcement details"}
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
            {isAdmin && (
              <button
                onClick={() => {
                  setActiveView("create");
                  setFormData({
                    title: "",
                    content: "",
                    priority: "Normal",
                    category: "General",
                  });
                }}
                style={{
                  backgroundColor: "#11E44F",
                  color: "#121212",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  marginBottom: "30px",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#0FCC41";
                  e.target.style.transform = "scale(1.05)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#11E44F";
                  e.target.style.transform = "scale(1)";
                }}
              >
                + Create Announcement
              </button>
            )}

            {!isAdmin && (
              <div
                style={{
                  backgroundColor: "#252525",
                  border: "1px solid #313131",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  marginBottom: "30px",
                  color: "#8AFFAC",
                  fontSize: "14px",
                }}
              >
                ℹ️ Only administrators can create, edit, or delete announcements
              </div>
            )}

            {announcements.length > 0 ? (
              <div style={{ display: "grid", gap: "16px" }}>
                {announcements.map((announcement) => (
                  <div
                    key={announcement._id}
                    style={{
                      backgroundColor: "#1a1a1a",
                      border: "1px solid #313131",
                      borderRadius: "12px",
                      padding: "20px",
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
                    onClick={() => handleViewAnnouncement(announcement._id)}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "8px" }}>
                          <h3
                            style={{
                              color: "#DAFAF4",
                              fontSize: "18px",
                              margin: 0,
                              fontWeight: "bold",
                            }}
                          >
                            {announcement.title}
                          </h3>
                          <span
                            style={{
                              backgroundColor:
                                announcement.priority === "High"
                                  ? "#ff4444"
                                  : announcement.priority === "Medium"
                                  ? "#FFA500"
                                  : "#8AFFAC",
                              color: announcement.priority === "High" ? "#fff" : "#121212",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontSize: "11px",
                              fontWeight: "bold",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {announcement.priority || "Normal"}
                          </span>
                        </div>
                        <p
                          style={{
                            color: "#8AFFAC",
                            margin: "0 0 8px 0",
                            fontSize: "13px",
                          }}
                        >
                          {announcement.content.substring(0, 100)}
                          {announcement.content.length > 100 ? "..." : ""}
                        </p>
                        <p
                          style={{
                            color: "#8AFFAC",
                            margin: 0,
                            fontSize: "11px",
                          }}
                        >
                          Category: {announcement.category || "General"}
                        </p>
                      </div>
                      {isAdmin && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAnnouncement(announcement._id);
                          }}
                          style={{
                            backgroundColor: "transparent",
                            color: "#ff4444",
                            border: "1px solid #ff4444",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: "bold",
                            transition: "all 0.3s",
                          }}
                          onMouseOver={(e) => {
                            e.target.style.backgroundColor = "rgba(255, 68, 68, 0.1)";
                          }}
                          onMouseOut={(e) => {
                            e.target.style.backgroundColor = "transparent";
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
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
                  No announcements yet. Create one to get started!
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
            <form
              onSubmit={activeView === "create" ? handleCreateAnnouncement : handleUpdateAnnouncement}
            >
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#8AFFAC",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                    fontWeight: "bold",
                  }}
                >
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  placeholder="Announcement title"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    backgroundColor: "#252525",
                    border: "1px solid #313131",
                    borderRadius: "8px",
                    color: "#DAFAF4",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#8AFFAC",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                    fontWeight: "bold",
                  }}
                >
                  Content
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleFormChange}
                  placeholder="Announcement content"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    backgroundColor: "#252525",
                    border: "1px solid #313131",
                    borderRadius: "8px",
                    color: "#DAFAF4",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    minHeight: "120px",
                    fontFamily: "'Red Hat Text', 'Red Hat Content', sans-serif",
                    resize: "vertical",
                  }}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  marginBottom: "30px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      color: "#8AFFAC",
                      fontSize: "12px",
                      textTransform: "uppercase",
                      marginBottom: "8px",
                      fontWeight: "bold",
                    }}
                  >
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleFormChange}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      backgroundColor: "#252525",
                      border: "1px solid #313131",
                      borderRadius: "8px",
                      color: "#DAFAF4",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  >
                    <option value="Low">Low</option>
                    <option value="Normal">Normal</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      color: "#8AFFAC",
                      fontSize: "12px",
                      textTransform: "uppercase",
                      marginBottom: "8px",
                      fontWeight: "bold",
                    }}
                  >
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      backgroundColor: "#252525",
                      border: "1px solid #313131",
                      borderRadius: "8px",
                      color: "#DAFAF4",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  >
                    <option value="General">General</option>
                    <option value="Update">Update</option>
                    <option value="Alert">Alert</option>
                    <option value="Event">Event</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    backgroundColor: "#11E44F",
                    color: "#121212",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease",
                    opacity: loading ? 0.6 : 1,
                  }}
                  onMouseOver={(e) => {
                    if (!loading) {
                      e.target.style.backgroundColor = "#0FCC41";
                      e.target.style.transform = "scale(1.05)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!loading) {
                      e.target.style.backgroundColor = "#11E44F";
                      e.target.style.transform = "scale(1)";
                    }
                  }}
                >
                  {loading
                    ? activeView === "create"
                      ? "Creating..."
                      : "Updating..."
                    : activeView === "create"
                    ? "Create Announcement"
                    : "Update Announcement"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (activeView === "detail" && isEditing) {
                      setIsEditing(false);
                    } else {
                      setActiveView("list");
                    }
                  }}
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
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Detail View */}
        {activeView === "detail" && !isEditing && selectedAnnouncement && (
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
                    {selectedAnnouncement.title}
                  </h2>
                  <span
                    style={{
                      backgroundColor:
                        selectedAnnouncement.priority === "High"
                          ? "#ff4444"
                          : selectedAnnouncement.priority === "Medium"
                          ? "#FFA500"
                          : "#8AFFAC",
                      color:
                        selectedAnnouncement.priority === "High" ? "#fff" : "#121212",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {selectedAnnouncement.priority || "Normal"}
                  </span>
                </div>
                <p
                  style={{
                    color: "#8AFFAC",
                    margin: 0,
                    fontSize: "13px",
                  }}
                >
                  Category: {selectedAnnouncement.category || "General"}
                </p>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                {isAdmin && (
                  <>
                    <button
                      onClick={handleEditAnnouncement}
                      style={{
                        backgroundColor: "#11E44F",
                        color: "#121212",
                        border: "none",
                        padding: "8px 16px",
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
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteAnnouncement(selectedAnnouncement._id)}
                      style={{
                        backgroundColor: "transparent",
                        color: "#ff4444",
                        border: "1px solid #ff4444",
                        padding: "8px 16px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: "bold",
                        transition: "all 0.3s",
                      }}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = "rgba(255, 68, 68, 0.1)";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = "transparent";
                      }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#252525",
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "20px",
                borderLeft: "4px solid #11E44F",
              }}
            >
              <p
                style={{
                  color: "#DAFAF4",
                  lineHeight: "1.6",
                  margin: 0,
                  whiteSpace: "pre-wrap",
                }}
              >
                {selectedAnnouncement.content}
              </p>
            </div>

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
              ← Back to Announcements
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
