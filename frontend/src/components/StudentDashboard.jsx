import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/StudentDashboard.css";

const StudentDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const student = location.state?.student || JSON.parse(localStorage.getItem('studentData') || '{}');

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [notification, setNotification] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (!student?.name) {
      navigate("/");
      return;
    }
    
    // Load uploaded files from localStorage
    const savedFiles = JSON.parse(localStorage.getItem(`uploads_${student.usn}`) || '[]');
    setUploadedFiles(savedFiles);
  }, [student, navigate]);

  // Handle File Selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    processFile(selectedFile);
  };

  // Process selected file
  const processFile = (selectedFile) => {
    if (!selectedFile) {
      showNotification("No file selected", "error");
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      showNotification("Only PDF files are allowed", "error");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
      showNotification("File size must be less than 10MB", "error");
      return;
    }

    setFile(selectedFile);
    showNotification(`File "${selectedFile.name}" selected successfully`, "success");
  };

  // Drag and Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    processFile(droppedFile);
  };

  // Show Popup Notification
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Handle Upload Process
  const handleUpload = async () => {
    if (!file) {
      showNotification("Please select a file to upload", "error");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("studentName", student.name);
    formData.append("usn", student.usn);
    formData.append("uploadDate", new Date().toISOString());

    setUploading(true);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        const newFile = {
          id: Date.now(),
          name: file.name,
          filename: response.data.filename,
          uploadDate: new Date().toLocaleString(),
          size: file.size
        };
        
        const updatedFiles = [...uploadedFiles, newFile];
        setUploadedFiles(updatedFiles);
        localStorage.setItem(`uploads_${student.usn}`, JSON.stringify(updatedFiles));
        
        showNotification("Assignment uploaded successfully!", "success");
        setFile(null);
        
        // Reset file input
        const fileInput = document.getElementById("fileInput");
        if (fileInput) fileInput.value = "";
      } else {
        showNotification(response.data.message || "Failed to upload file", "error");
      }
    } catch (error) {
      console.error("Upload error:", error);
      showNotification(
        error.response?.data?.message || "Server error while uploading", 
        "error"
      );
    } finally {
      setUploading(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('studentData');
    localStorage.removeItem('isLoggedIn');
    navigate("/", { replace: true });
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Remove uploaded file
  const removeFile = (fileId) => {
    const updatedFiles = uploadedFiles.filter(f => f.id !== fileId);
    setUploadedFiles(updatedFiles);
    localStorage.setItem(`uploads_${student.usn}`, JSON.stringify(updatedFiles));
    showNotification("File removed successfully", "success");
  };

  // Render main content based on active section
  const renderMainContent = () => {
    switch(activeSection) {
      case 'upload':
        return (
          <div className="upload-content">
            <h2>Upload Assignment</h2>
            <div 
              className={`file-drop-zone ${dragOver ? 'drag-over' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("fileInput").click()}
            >
              <div className="drop-zone-content">
                <div className="upload-icon">📁</div>
                <p>Drag & drop your PDF file here or click to browse</p>
                <span className="file-requirements">PDF files only • Max 10MB</span>
              </div>
              <input 
                type="file" 
                accept="application/pdf" 
                id="fileInput" 
                style={{ display: "none" }} 
                onChange={handleFileChange} 
              />
            </div>
            
            {file && (
              <div className="selected-file">
                <div className="file-info">
                  <span className="file-icon">📄</span>
                  <div className="file-details">
                    <p className="file-name">{file.name}</p>
                    <p className="file-size">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button 
                  className="upload-btn"
                  onClick={handleUpload} 
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <span className="loading-spinner"></span>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <span className="upload-icon">⬆️</span>
                      Upload Assignment
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        );
      
      case 'assignments':
        return (
          <div className="assignments-content">
            <h2>My Assignments</h2>
            {uploadedFiles.length > 0 ? (
              <div className="assignments-grid">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="assignment-card">
                    <div className="assignment-header">
                      <span className="assignment-icon">📄</span>
                      <h3>{file.name}</h3>
                    </div>
                    <div className="assignment-details">
                      <p><strong>Uploaded:</strong> {file.uploadDate}</p>
                      <p><strong>Size:</strong> {formatFileSize(file.size)}</p>
                    </div>
                    <div className="assignment-actions">
                      <button 
                        className="view-btn"
                        onClick={() => window.open(`http://localhost:5000/uploads/${file.filename}`, "_blank")}
                      >
                        View
                      </button>
                      <button 
                        className="download-btn"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = `http://localhost:5000/uploads/${file.filename}`;
                          link.download = file.name;
                          link.click();
                        }}
                      >
                        Download
                      </button>
                      <button 
                        className="remove-btn"
                        onClick={() => removeFile(file.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-assignments">
                <div className="empty-state">
                  <span className="empty-icon">📋</span>
                  <h3>No assignments uploaded yet</h3>
                  <p>Upload your first assignment to get started</p>
                  <button 
                    className="upload-first-btn"
                    onClick={() => setActiveSection('upload')}
                  >
                    Upload Assignment
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      
      default:
        return (
          <div className="dashboard-welcome">
            <h1>Welcome back, {student.name}!</h1>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📚</div>
                <div className="stat-info">
                  <h3>{uploadedFiles.length}</h3>
                  <p>Assignments Uploaded</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🎓</div>
                <div className="stat-info">
                  <h3 className="g1">{student.usn}</h3>
                  <p>Your USN</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📋</div>
                <div className="stat-info">
                  <h3>Active</h3>
                  <p>Account Status</p>
                </div>
              </div>
            </div>
            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="action-buttons">
                <button onClick={() => setActiveSection('upload')}>
                  <span>📤</span>
                  Upload Assignment
                </button>
                <button onClick={() => setActiveSection('assignments')}>
                  <span>📋</span>
                  View Assignments
                </button>
                <button onClick={() => showNotification("Feature coming soon!", "info")}>
                  <span>📖</span>
                  View Notes
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-container">
      {/* Notification Popup */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          <span className="notification-icon">
            {notification.type === 'success' ? '✅' : notification.type === 'error' ? '❌' : 'ℹ️'}
          </span>
          {notification.message}
        </div>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h1>Student Portal</h1>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={activeSection === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveSection('dashboard')}
          >
            <span className="nav-icon">🏠</span>
            {!sidebarCollapsed && 'Dashboard'}
          </button>
          <button 
            className={activeSection === 'upload' ? 'active' : ''}
            onClick={() => setActiveSection('upload')}
          >
            <span className="nav-icon">📤</span>
            {!sidebarCollapsed && 'Upload Assignment'}
          </button>
          <button 
            className={activeSection === 'assignments' ? 'active' : ''}
            onClick={() => setActiveSection('assignments')}
          >
            <span className="nav-icon">📋</span>
            {!sidebarCollapsed && 'My Assignments'}
          </button>
          <button onClick={() => showNotification("Feature coming soon!", "info")}>
            <span className="nav-icon">📜</span>
            {!sidebarCollapsed && 'No Due Certificate'}
          </button>
          <button onClick={() => showNotification("Feature coming soon!", "info")}>
            <span className="nav-icon">📖</span>
            {!sidebarCollapsed && 'Notes & Materials'}
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-title">
            <h2>{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</h2>
          </div>
          
          <div className="profile-section">
            <div 
              className="profile-info" 
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img 
                src="https://via.placeholder.com/40/667eea/ffffff?text=ST" 
                alt="Profile" 
                className="profile-img" 
              />
              <span className="profile-name">{student.name}</span>
              <span className="dropdown-arrow">{showDropdown ? '▲' : '▼'}</span>
            </div>

            {showDropdown && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <img 
                    src="https://via.placeholder.com/50/667eea/ffffff?text=ST" 
                    alt="Profile" 
                  />
                  <div>
                    <p className="dropdown-name">{student.name}</p>
                    <p className="dropdown-usn">{student.usn}</p>
                  </div>
                </div>
                <div className="dropdown-actions">
                  <button onClick={() => showNotification("Profile view coming soon!", "info")}>
                    <span>👤</span>
                    View Profile
                  </button>
                  <button onClick={() => showNotification("Profile edit coming soon!", "info")}>
                    <span>✏️</span>
                    Edit Profile
                  </button>
                  <button onClick={handleLogout} className="logout-btn">
                    <span>🚪</span>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="content-area">
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;