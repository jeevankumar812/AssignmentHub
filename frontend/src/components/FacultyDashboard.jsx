import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Users,
  CheckCircle,
  Clock,
  Eye,
  Upload,
  AlertCircle,
  LogOut,
  RefreshCw,
  Filter,
  Search
} from 'lucide-react';
import '../styles/FacultyDashboard.css';

const FacultyDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const subjectCode = location.state?.subjectCode || 'BCS601';

  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Subject mapping
  const subjectNames = {
    BCS601: 'Cloud Computing',
    BCS602: 'Data Structures',
    BCS603: 'Operating Systems',
    BCS604: 'Computer Networks',
    BCS605: 'Software Engineering'
  };

  // Fetch students list
  const fetchStudents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await axios.get('http://localhost:5000/students/list');
      const sortedStudents = response.data.map(student => ({
        ...student,
        status: student.pdf?.filename ? (student.status || validatePdf(student.pdf.filename)) : 'Hold'
      })).sort((a, b) => a.usn.localeCompare(b.usn));

      setStudents(sortedStudents);
      setFilteredStudents(sortedStudents);
      setCompletedCount(sortedStudents.filter(student => student.status === 'Completed').length);
    } catch (error) {
      console.error('Error fetching student list!', error);
      setError('Failed to fetch student data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchStudents();
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Filter and search functionality
  useEffect(() => {
    let filtered = students;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.usn.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(student => student.status === statusFilter);
    }

    setFilteredStudents(filtered);
  }, [students, searchTerm, statusFilter]);

  // Status update functions
  const handleSubmit = async (index) => {
    await updateStatus(index, 'Completed');
  };

  const handleHold = async (index) => {
    await updateStatus(index, 'Hold');
  };

  const updateStatus = async (index, newStatus) => {
    const student = filteredStudents[index];
    const originalStudentIndex = students.findIndex(s => s._id === student._id);

    try {
      const updatedStudents = [...students];
      updatedStudents[originalStudentIndex].status = newStatus;
      setStudents(updatedStudents);
      setCompletedCount(updatedStudents.filter(student => student.status === 'Completed').length);

      await axios.post(`http://localhost:5000/students/update/${student._id}`, {
        status: newStatus
      });
    } catch (error) {
      console.error('Error updating status!', error);
      setError('Failed to update status. Please try again.');
    }
  };

  const validatePdf = (filename) => {
    if (!filename || filename.includes('fake') || filename.includes('invalid')) {
      return 'Hold';
    }
    return 'Pending';
  };

  const handleLogout = () => {
    navigate('/faculty-login');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="status-icon completed" size={18} />;
      case 'Hold':
        return <AlertCircle className="status-icon hold" size={18} />;
      default:
        return <Clock className="status-icon pending" size={18} />;
    }
  };

  const getStatusCount = (status) => {
    return students.filter(student => student.status === status).length;
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="faculty-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-info">
            <h1 className="dashboard-title">
              {subjectNames[subjectCode] || 'Subject'} - {subjectCode}
            </h1>
            
          </div>
          {/* Removed header-actions from here */}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon total">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>{students.length}</h3>
            <p>Total Students</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon completed">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>{completedCount}</h3>
            <p>Completed</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <h3>{getStatusCount('Pending')}</h3>
            <p>Pending</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon hold">
            <AlertCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>{getStatusCount('Hold')}</h3>
            <p>On Hold</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="dashboard-controls">
        <div className="search-container">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search by name or USN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-container">
          <Filter className="filter-icon" size={18} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Hold">Hold</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-banner">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Students Table */}
      <div className="table-container">
        <div className="table-wrapper">
          <table className="students-table">
            <thead>
              <tr>
                <th>SI No</th>
                <th>Student Name</th>
                <th>USN</th>
                <th>Assignment</th>
                <th>Progress</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <tr key={student._id} className={`table-row ${student.status.toLowerCase()}`}>
                    <td className="serial-number">{index + 1}</td>
                    <td className="student-name">
                      <div className="name-cell">
                        <span className="name">{student.name}</span>
                      </div>
                    </td>
                    <td className="usn">{student.usn}</td>
                    <td className="assignment-cell">
                      {student.pdf?.filename ? (
                        <a
                          href={`http://localhost:5000/uploads/${student.pdf.filename}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="assignment-link"
                        >
                          <Eye size={16} />
                          View Assignment
                        </a>
                      ) : (
                        <span className="no-assignment">
                          <Upload size={16} />
                          Not Uploaded
                        </span>
                      )}
                    </td>
                    <td className="progress-cell">
                      {student.status === 'Completed' || student.status === 'Hold' ? (
                        <span className={`status-badge ${student.status.toLowerCase()}`}>
                          {getStatusIcon(student.status)}
                          {student.status}
                        </span>
                      ) : (
                        <div className="action-buttons">
                          <button
                            className="submit-btn"
                            onClick={() => handleSubmit(index)}
                          >
                            <CheckCircle size={16} />
                            Submit
                          </button>
                          <button
                            className="hold-btn"
                            onClick={() => handleHold(index)}
                          >
                            <AlertCircle size={16} />
                            Hold
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="completion-cell">
                      {getStatusIcon(student.status)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">
                    <div className="empty-state">
                      <Users size={48} />
                      <h3>No Students Found</h3>
                      <p>No student records match your current filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="dashboard-footer">
        <p>Showing {filteredStudents.length} of {students.length} students</p>
      </div>

      {/* New: Bottom Action Buttons */}
      <div className="dashboard-bottom-actions">
        <button
          onClick={handleRefresh}
          className={`refresh-button ${isRefreshing ? 'refreshing' : ''}`}
          disabled={isRefreshing}
        >
          <RefreshCw size={18} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
        <button onClick={handleLogout} className="logout-button">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default FacultyDashboard;