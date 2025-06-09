import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/MainPage.css';

const MainPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeStats, setActiveStats] = useState({
    assignments: 0,
    students: 0,
    completion: 0
  });

  // Handle navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animate statistics on component mount
  useEffect(() => {
    const animateStats = () => {
      const targetStats = { assignments: 2847, students: 456, completion: 89 };
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = duration / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setActiveStats({
          assignments: Math.floor(targetStats.assignments * progress),
          students: Math.floor(targetStats.students * progress),
          completion: Math.floor(targetStats.completion * progress)
        });

        if (currentStep >= steps) {
          clearInterval(timer);
          setActiveStats(targetStats);
        }
      }, increment);
    };

    // Start animation after a short delay
    const timeout = setTimeout(animateStats, 500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="main-page">
      {/* Navigation Bar */}
      <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-brand">
            <Link to="/" className="nav-logo">
              <span className="logo-icon">📚</span>
              <span className="logo-text">AssignmentHub</span>
            </Link>
          </div>
          
          <ul className="nav-links">
            <li><Link to="/" className="nav-link active">Home</Link></li>
            <li><Link to="/student-register" className="nav-link active">Student Portal</Link></li>
            <li><Link to="/faculty-login" className="nav-link active">Faculty Dashboard</Link></li>
           
          </ul>

          <div className="nav-cta">
            <Link to="/student-register" className="btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="bg-pattern"></div>
          <div className="bg-gradient"></div>
        </div>

        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                <span className="title-line">See How Many</span>
                <span className="title-line highlight">Assignments</span>
                <span className="title-line">Are Completed</span>
              </h1>
              
              <p className="hero-description">
                Transform your academic workflow with our intelligent assignment tracking system. 
                Monitor progress, boost productivity, and achieve excellence in every submission.
              </p>

              <div className="hero-actions">
                <Link to="/student-register" className="btn-primary btn-lg">
                  Start Tracking
                  <span className="btn-arrow">→</span>
                </Link>
                <Link to="/demo" className="btn-secondary btn-lg">
                  View Demo
                </Link>
              </div>

              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">{activeStats.assignments.toLocaleString()}+</span>
                  <span className="stat-label">Assignments Tracked</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{activeStats.students}+</span>
                  <span className="stat-label">Active Students</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{activeStats.completion}%</span>
                  <span className="stat-label">Success Rate</span>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="dashboard-preview">
              <div className="dashboard-header">
                <div className="dashboard-title">Assignment Dashboard</div>
                <div className="dashboard-status">
                  <span className="status-dot"></span>
                  Live Updates
                </div>
              </div>
              
              <div className="dashboard-content">
                <div className="progress-section">
                  <div className="progress-title">Overall Progress</div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: `${activeStats.completion}%`}}></div>
                  </div>
                  <div className="progress-label">{activeStats.completion}% Complete</div>
                </div>

                <div className="metrics-grid">
                  <div className="metric-card">
                    <div className="metric-icon">📝</div>
                    <div className="metric-value">24</div>
                    <div className="metric-label">Due This Week</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-icon">✅</div>
                    <div className="metric-value">18</div>
                    <div className="metric-label">Completed</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-icon">⏰</div>
                    <div className="metric-value">6</div>
                    <div className="metric-label">Pending</div>
                  </div>
                </div>

                <div className="recent-activity">
                  <div className="activity-title">Recent Activity</div>
                  <div className="activity-list">
                    <div className="activity-item">
                      <span className="activity-dot completed"></span>
                      <span className="activity-text">Math Assignment #5 submitted</span>
                    </div>
                    <div className="activity-item">
                      <span className="activity-dot pending"></span>
                      <span className="activity-text">Physics Lab Report due tomorrow</span>
                    </div>
                    <div className="activity-item">
                      <span className="activity-dot completed"></span>
                      <span className="activity-text">History Essay reviewed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="floating-elements">
              <div className="floating-card card-1">
                <div className="card-icon">🎯</div>
                <div className="card-text">Goal Tracking</div>
              </div>
              <div className="floating-card card-2">
                <div className="card-icon">📊</div>
                <div className="card-text">Analytics</div>
              </div>
              <div className="floating-card card-3">
                <div className="card-icon">🔔</div>
                <div className="card-text">Smart Reminders</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview Section */}
      <section className="features-preview">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">📈</div>
              <h3>Progress Tracking</h3>
              <p>Monitor your assignment completion rates and academic performance in real-time.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🎓</div>
              <h3>Student-Friendly</h3>
              <p>Intuitive interface designed specifically for students to manage their workload effectively.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">👨‍🏫</div>
              <h3>Faculty Dashboard</h3>
              <p>Comprehensive tools for educators to track student progress and manage assignments.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-content">
          <p className="jeev">&copy; {new Date().getFullYear()} AssignmentHub. All rights reserved.</p>
          <p className="jeev">Developed by **K Jeevan Kumar**, Alva's Institute of Engineering and Technology</p>
        </div>
      </footer>
    </div>
  );
};

export default MainPage;