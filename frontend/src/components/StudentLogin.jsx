import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/StudentLogin.css';

const StudentLogin = () => {
  const [usn, setUsn] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
    if (!usn.trim() || !password.trim()) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/students/login', {
        usn: usn.trim(),
        password
      });

      if (response.data.success) {
        // Store student data in localStorage for persistence
        localStorage.setItem('studentData', JSON.stringify(response.data.student));
        localStorage.setItem('isLoggedIn', 'true');
        
        navigate(`/student-dashboard/${usn}`, { 
          state: { student: response.data.student },
          replace: true 
        });
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      setError(
        error.response?.data?.message || 
        'Login failed. Please check your credentials and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    if (error) setError(''); // Clear error when user starts typing
  };

  return (
    <div className="student-login-container">
      <div className="student-login-form">
        <div className="student-login-header">
          <h1 className="student-login-title">Student Login</h1>
          <p className="student-login-subtitle">Access your academic dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="student-form">
          {error && (
            <div className="student-error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="student-form-group">
            <label htmlFor="usn" className="student-form-label">
              USN (University Seat Number)
            </label>
            <input
              type="text"
              id="usn"
              className="student-form-input"
              placeholder="Enter your USN"
              value={usn}
              onChange={handleInputChange(setUsn)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="student-form-group">
            <label htmlFor="password" className="student-form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="student-form-input"
              placeholder="Enter your password"
              value={password}
              onChange={handleInputChange(setPassword)}
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className={`student-login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="student-login-footer">
          <p className="contact-admin">
            Need help? <a href="/contact">Contact Administrator</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;