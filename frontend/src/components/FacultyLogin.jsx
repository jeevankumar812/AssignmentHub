import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, AlertCircle, LogIn } from 'lucide-react';
import '../styles/FacultyLogin.css';

const FacultyLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subjectCode: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Faculty credentials - In production, this should be handled by backend authentication
  const facultyCredentials = {
    BCS601: 'cc',
    BCS602: 'ds',
    BCS603: 'os',
    BCS604: 'cn',
    BCS605: 'se'
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'subjectCode' ? value.toUpperCase() : value
    }));
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const { subjectCode, password } = formData;

    if (!subjectCode.trim() || !password.trim()) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (facultyCredentials[subjectCode] === password) {
      // Successful login
      navigate('/faculty-dashboard', { 
        state: { 
          subjectCode,
          loginTime: new Date().toISOString()
        } 
      });
    } else {
      setError('Invalid Subject Code or Password');
    }
    
    setIsLoading(false);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="faculty-login-container">
      <div className="login-background">
        <div className="bg-pattern"></div>
      </div>
      
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">
            <User size={32} />
          </div>
          <h1 className="login-title">Faculty Login</h1>
          <p className="login-subtitle">Access your dashboard with your credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="subjectCode" className="input-label">
              Subject Code
            </label>
            <div className="input-wrapper">
              <User className="input-icon" size={18} />
              <input
                type="text"
                id="subjectCode"
                name="subjectCode"
                value={formData.subjectCode}
                onChange={handleInputChange}
                placeholder="Enter subject code (BCS601)"
                className="form-input"
                disabled={isLoading}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password: Password is cc"
                className="form-input"
                disabled={isLoading}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit" 
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Logging in...
              </>
            ) : (
              <>
                <LogIn size={18} />
                Login
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <button 
            type="button" 
            onClick={handleBackToHome}
            className="back-button"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacultyLogin;