import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/RegisterStudent.css';

const RegisterStudent = () => {
  const [formData, setFormData] = useState({
    name: '',
    usn: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const navigate = useNavigate();

  // Password strength calculation
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  // Real-time validation - Wrapped in useCallback
  const validateForm = useCallback(() => {
    const errors = {};
    const { name, usn, password, confirmPassword } = formData;

    // Name validation
    if (!name.trim()) {
      errors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    // USN validation
    if (!usn.trim()) {
      errors.usn = 'USN is required';
    } else if (!/^[A-Za-z0-9]{10,12}$/.test(usn.trim())) {
      errors.usn = 'USN must be 10-12 alphanumeric characters';
    }

    // Password validation
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    // Confirm password validation
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0 && name && usn && password && confirmPassword);
  }, [formData]); // validateForm depends on formData

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Calculate password strength for password field
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Clear messages when user starts typing
    if (errorMessage) setErrorMessage('');
    if (successMessage) setSuccessMessage('');
  };

  // Effect to validate form on data change
  useEffect(() => {
    validateForm();
  }, [formData, validateForm]); // Added validateForm to dependency array

  // Handle form submission
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      setErrorMessage('Please fix all validation errors before submitting.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    const email = `${formData.usn.toLowerCase()}@student.com`;

    try {
      const response = await axios.post('http://localhost:5000/students/register', {
        name: formData.name.trim(),
        usn: formData.usn.trim().toUpperCase(),
        password: formData.password,
        email: email
      });

      if (response.data.success) {
        setSuccessMessage('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/student-login');
        }, 2000);
      } else {
        setErrorMessage(response.data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.status === 409) {
        setErrorMessage('A student with this USN already exists. Please use a different USN or login instead.');
      } else if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Server error. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return '#FF4757';
    if (passwordStrength < 50) return '#FF6B35';
    if (passwordStrength < 75) return '#F39C12';
    return '#2ECC71';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Weak';
    if (passwordStrength < 50) return 'Fair';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };

  return (
    <div className="register-page">
      {/* Background Elements */}
      <div className="background-elements">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
      </div>

      {/* Navigation */}
      <nav className="register-nav">
        <Link to="/" className="nav-brand">
          <span className="logo-icon">📚</span>
          <span className="logo-text">AssignmentHub</span>
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/faculty-login" className="nav-link">Faculty Login</Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="register-container">
        <div className="register-content">

          {/* Left Side - Welcome Content */}
          <div className="welcome-section">
            <div className="welcome-content">
              <h1 className="welcome-title">
                Join Our
                <span className="highlight-text">Academic Community</span>
              </h1>
              <p className="welcome-description">
                Start your journey with our comprehensive assignment tracking system.
                Monitor your progress, stay organized, and achieve academic excellence.
              </p>

              <div className="features-list">
                <div className="feature-item">
                  <div className="feature-icon">📊</div>
                  <div className="feature-text">
                    <h4>Track Progress</h4>
                    <p>Monitor your assignment completion rates in real-time</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🔔</div>
                  <div className="feature-text">
                    <h4>Smart Reminders</h4>
                    <p>Never miss a deadline with intelligent notifications</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🎯</div>
                  <div className="feature-text">
                    <h4>Goal Setting</h4>
                    <p>Set and achieve your academic goals systematically</p>
                  </div>
                </div>
              </div>

              <div className="stats-preview">
                <div className="stat-item">
                  <span className="stat-number">2,847+</span>
                  <span className="stat-label">Students Registered</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">89%</span>
                  <span className="stat-label">Success Rate</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="form-section">
            <div className="form-container">
              <div className="form-header">
                <h2 className="form-title">Create Your Account</h2>
                <p className="form-subtitle">Fill in your details to get started</p>
              </div>

              <form className="register-form" onSubmit={handleRegister} noValidate>

                {/* Name Field */}
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`form-input ${validationErrors.name ? 'error' : ''}`}
                      placeholder="Enter your full name"
                      required
                    />
                    <div className="input-icon">👤</div>
                  </div>
                  {validationErrors.name && (
                    <span className="error-text">{validationErrors.name}</span>
                  )}
                </div>

                {/* USN Field */}
                <div className="form-group">
                  <label className="form-label">University Seat Number (USN)</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      name="usn"
                      value={formData.usn}
                      onChange={handleInputChange}
                      className={`form-input ${validationErrors.usn ? 'error' : ''}`}
                      placeholder="Enter your USN"
                      style={{ textTransform: 'uppercase' }}
                      required
                    />
                    <div className="input-icon">🎓</div>
                  </div>
                  {validationErrors.usn && (
                    <span className="error-text">{validationErrors.usn}</span>
                  )}
                </div>

                {/* Password Field */}
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`form-input ${validationErrors.password ? 'error' : ''}`}
                      placeholder="Create a strong password"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="password-strength">
                      <div className="strength-bar">
                        <div
                          className="strength-fill"
                          style={{
                            width: `${passwordStrength}%`,
                            backgroundColor: getPasswordStrengthColor()
                          }}
                        ></div>
                      </div>
                      <span
                        className="strength-text"
                        style={{ color: getPasswordStrengthColor() }}
                      >
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                  )}

                  {validationErrors.password && (
                    <span className="error-text">{validationErrors.password}</span>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <div className="input-wrapper">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`form-input ${validationErrors.confirmPassword ? 'error' : ''}`}
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {validationErrors.confirmPassword && (
                    <span className="error-text">{validationErrors.confirmPassword}</span>
                  )}
                </div>

                {/* Messages */}
                {errorMessage && (
                  <div className="alert alert-error">
                    <span className="alert-icon">⚠️</span>
                    {errorMessage}
                  </div>
                )}

                {successMessage && (
                  <div className="alert alert-success">
                    <span className="alert-icon">✅</span>
                    {successMessage}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className={`submit-button ${loading ? 'loading' : ''} ${!isFormValid ? 'disabled' : ''}`}
                  disabled={loading || !isFormValid}
                >
                  {loading ? (
                    <>
                      <div className="loading-spinner"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <span className="button-arrow">→</span>
                    </>
                  )}
                </button>

                {/* Login Link */}
                <div className="form-footer">
                  <p className="login-prompt">
                    Already have an account?
                    <Link to="/student-login" className="login-link">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterStudent;