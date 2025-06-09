import React, { useState, useEffect } from "react";
import { Users, Target, Award, BookOpen, Code, Lightbulb } from "lucide-react";
import '../styles/AboutUs.css';

const AboutUs = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <BookOpen size={24} />,
      title: "Educational Excellence",
      description: "Providing top-quality academic resources and assignment solutions"
    },
    {
      icon: <Code size={24} />,
      title: "Technical Expertise",
      description: "Specialized in computer science and engineering subjects"
    },
    {
      icon: <Users size={24} />,
      title: "Student-Centered",
      description: "Focused on helping students achieve their academic goals"
    },
    {
      icon: <Award size={24} />,
      title: "Quality Assurance",
      description: "Ensuring high standards in all our educational content"
    }
  ];

  const stats = [
    { number: "1000+", label: "Students Helped" },
    { number: "50+", label: "Subjects Covered" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "Support Available" }
  ];

  return (
    <div className="aboutus-container">
      {/* Background Elements */}
      <div className="background-elements">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-circle bg-circle-3"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`main-content ${isVisible ? 'animate-in' : ''}`}>
        {/* Header Section */}
        <div className="header-section">
          <div className="icon-wrapper">
            <Lightbulb className="main-icon" size={48} />
          </div>
          <h1 className="main-title">
            <span className="title-gradient">Assignment Hub</span>
          </h1>
          <div className="title-underline"></div>
          <p className="main-subtitle">
            Empowering students with comprehensive academic solutions and fostering educational excellence through innovative learning resources.
          </p>
        </div>

        {/* Features Grid */}
        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <h2 className="stats-title">Our Impact</h2>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="stat-item"
                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
              >
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Section */}
        <div className="mission-section">
          <div className="mission-card">
            <div className="mission-icon">
              <Target size={32} />
            </div>
            <h2 className="mission-title">Our Mission</h2>
            <p className="mission-text">
              To bridge the gap between academic challenges and student success by providing 
              comprehensive, high-quality educational resources that inspire learning, 
              promote understanding, and empower students to excel in their academic journey.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="cta-section">
          <div className="cta-content">
            <h3 className="cta-title">Ready to Excel?</h3>
            <p className="cta-text">Join thousands of students who have transformed their academic journey with Assignment Hub.</p>
            <button className="cta-button">
              <span>Get Started Today</span>
              <div className="button-glow"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;