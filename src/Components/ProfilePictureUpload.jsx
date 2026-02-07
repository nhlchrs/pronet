import React, { useState } from "react";
import axios from "axios";

export default function ProfilePictureUpload({ currentPicture, onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!allowedTypes.includes(file.type) || !allowedExtensions.includes(fileExtension)) {
      setErrorMessage("Invalid file type. Only JPG, PNG, and GIF images are allowed.");
      setShowErrorModal(true);
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrorMessage("File too large. Maximum size is 5MB.");
      setShowErrorModal(true);
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setShowModal(true);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("profilePicture", selectedFile);

      await axios.post(`${API_URL}/user/upload-profile-picture`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setShowModal(false);
      setSelectedFile(null);
      setPreview(null);
      setSuccessMessage("Profile picture uploaded successfully!");
      setShowSuccessModal(true);
      onUploadSuccess();
    } catch (error) {
      console.error("Upload error:", error);
      setErrorMessage(error.response?.data?.message || "Failed to upload profile picture");
      setShowErrorModal(true);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    setShowDeleteModal(false);
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/user/delete-profile-picture`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccessMessage("Profile picture deleted successfully!");
      setShowSuccessModal(true);
      onUploadSuccess();
    } catch (error) {
      console.error("Delete error:", error);
      setErrorMessage(error.response?.data?.message || "Failed to delete profile picture");
      setShowErrorModal(true);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedFile(null);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    // Remove /api from URL for uploads (static files are served at root level)
    const baseUrl = API_URL.replace(/\/api$/, '');
    return `${baseUrl}${path}`;
  };

  return (
    <div style={{ marginBottom: "30px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {/* Current Picture Display */}
        <div style={{ position: "relative" }}>
          {currentPicture ? (
            <img
              src={getImageUrl(currentPicture)}
              alt="Profile"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #4CD3C8",
              }}
            />
          ) : (
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                backgroundColor: "#1E1E1E",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "3px solid #4CD3C8",
              }}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4CD3C8"
                strokeWidth="2"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <label style={{ cursor: "pointer" }}>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif"
              onChange={handleFileSelect}
              style={{ display: "none" }}
            />
            <div
              style={{
                padding: "10px 20px",
                backgroundColor: "#4CD3C8",
                color: "#0B1929",
                borderRadius: "8px",
                fontWeight: "600",
                textAlign: "center",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#0FC945";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#4CD3C8";
                e.target.style.transform = "translateY(0)";
              }}
            >
              {currentPicture ? "Change Picture" : "Upload Picture"}
            </div>
          </label>

          {currentPicture && (
            <button
              onClick={() => setShowDeleteModal(true)}
              disabled={isDeleting}
              style={{
                padding: "10px 20px",
                backgroundColor: "#FF4444",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: isDeleting ? "not-allowed" : "pointer",
                opacity: isDeleting ? 0.6 : 1,
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                if (!isDeleting) {
                  e.target.style.backgroundColor = "#CC0000";
                  e.target.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isDeleting) {
                  e.target.style.backgroundColor = "#FF4444";
                  e.target.style.transform = "translateY(0)";
                }
              }}
            >
              {isDeleting ? "Deleting..." : "Remove Picture"}
            </button>
          )}
        </div>
      </div>

      {/* Upload Preview Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={handleCancel}
        >
          <div
            style={{
              backgroundColor: "#1E1E1E",
              borderRadius: "16px",
              padding: "30px",
              maxWidth: "500px",
              width: "90%",
              border: "2px solid #4CD3C8",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h3 style={{ color: "#DAFAF4", margin: 0 }}>Upload Profile Picture</h3>
              <button
                onClick={handleCancel}
                style={{
                  background: "none",
                  border: "none",
                  color: "#888",
                  fontSize: "24px",
                  cursor: "pointer",
                  padding: "0",
                  width: "30px",
                  height: "30px",
                }}
              >
                Ã—
              </button>
            </div>

            {/* Preview */}
            {preview && (
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "3px solid #4CD3C8",
                  }}
                />
              </div>
            )}

            {/* File Info */}
            {selectedFile && (
              <div style={{ marginBottom: "20px", color: "#888", fontSize: "14px" }}>
                <p>File: {selectedFile.name}</p>
                <p>Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleCancel}
                disabled={isUploading}
                style={{
                  flex: 1,
                  padding: "12px",
                  backgroundColor: "#2A2A2A",
                  color: "#DAFAF4",
                  border: "1px solid #4CD3C8",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: isUploading ? "not-allowed" : "pointer",
                  opacity: isUploading ? 0.6 : 1,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={isUploading}
                style={{
                  flex: 1,
                  padding: "12px",
                  backgroundColor: "#4CD3C8",
                  color: "#0B1929",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: isUploading ? "not-allowed" : "pointer",
                  opacity: isUploading ? 0.6 : 1,
                }}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            style={{
              backgroundColor: "#1E1E1E",
              borderRadius: "16px",
              padding: "30px",
              maxWidth: "400px",
              width: "90%",
              border: "2px solid #FF4444",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ color: "#DAFAF4", marginBottom: "15px", fontSize: "20px" }}>
              Delete Profile Picture
            </h3>
            <p style={{ color: "#888", marginBottom: "25px" }}>
              Are you sure you want to delete your profile picture? This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{
                  flex: 1,
                  padding: "12px",
                  backgroundColor: "#2A2A2A",
                  color: "#DAFAF4",
                  border: "1px solid #4CD3C8",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                style={{
                  flex: 1,
                  padding: "12px",
                  backgroundColor: "#FF4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={() => setShowSuccessModal(false)}
        >
          <div
            style={{
              backgroundColor: "#1E1E1E",
              borderRadius: "16px",
              padding: "30px",
              maxWidth: "400px",
              width: "90%",
              border: "2px solid #4CD3C8",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: "48px", marginBottom: "15px" }}>âœ“</div>
            <h3 style={{ color: "#4CD3C8", marginBottom: "10px", fontSize: "20px" }}>
              Success!
            </h3>
            <p style={{ color: "#888", marginBottom: "25px" }}>
              {successMessage}
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#4CD3C8",
                color: "#0B1929",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={() => setShowErrorModal(false)}
        >
          <div
            style={{
              backgroundColor: "#1E1E1E",
              borderRadius: "16px",
              padding: "30px",
              maxWidth: "400px",
              width: "90%",
              border: "2px solid #FF4444",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: "48px", marginBottom: "15px" }}>âš </div>
            <h3 style={{ color: "#FF4444", marginBottom: "10px", fontSize: "20px" }}>
              Error
            </h3>
            <p style={{ color: "#888", marginBottom: "25px" }}>
              {errorMessage}
            </p>
            <button
              onClick={() => setShowErrorModal(false)}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#FF4444",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


