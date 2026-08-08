import React, { useState } from 'react';
import './LandingPage.css';

const LandingPage = ({ onStart }) => {
  const [selectedTrack, setSelectedTrack] = useState('Full Stack Development');

  const tracks = [
    { id: 'fullstack', name: 'Full Stack Development', icon: '💻', color: '#6366f1' },
    { id: 'datascience', name: 'Data Science', icon: '📊', color: '#06b6d4' },
    { id: 'devops', name: 'DevOps', icon: '🚀', color: '#f59e0b' },
    { id: 'mobile', name: 'Mobile Development', icon: '📱', color: '#ec4899' }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-badge">🔥 10,000+ Students Enrolled</div>
        <h1 className="hero-title">
          60-Day Coding Challenge
          <span className="highlight"> Master Your Skills</span>
        </h1>
        <p className="hero-subtitle">
          Join thousands of Indian college students building consistent coding habits.
          One commit, one post, every day.
        </p>
        
        <div className="stats-row">
          <div className="stat-item">
            <span className="stat-number">12K+</span>
            <span className="stat-label">Students</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">85%</span>
            <span className="stat-label">Completion Rate</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">200+</span>
            <span className="stat-label">Hiring Partners</span>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-icon">1️⃣</div>
            <h3>Choose Your Track</h3>
            <p>Pick from Full Stack, Data Science, DevOps, or Mobile Development</p>
          </div>
          <div className="step-card">
            <div className="step-icon">2️⃣</div>
            <h3>Code Daily</h3>
            <p>Complete a new challenge every day for 60 days</p>
          </div>
          <div className="step-card">
            <div className="step-icon">3️⃣</div>
            <h3>Share Your Work</h3>
            <p>Submit your GitHub commit and LinkedIn post daily</p>
          </div>
          <div className="step-card">
            <div className="step-icon">4️⃣</div>
            <h3>Get Noticed</h3>
            <p>Build your portfolio and get hired by top companies</p>
          </div>
        </div>
      </div>

      {/* Tracks Selection */}
      <div className="tracks-section">
        <h2 className="section-title">Choose Your Track</h2>
        <div className="tracks-grid">
          {tracks.map(track => (
            <div 
              key={track.id}
              className={`track-card ${selectedTrack === track.name ? 'selected' : ''}`}
              onClick={() => setSelectedTrack(track.name)}
              style={{ '--track-color': track.color }}
            >
              <div className="track-icon">{track.icon}</div>
              <h3>{track.name}</h3>
              <p>60 days of daily challenges</p>
              {selectedTrack === track.name && (
                <div className="check-mark">✓</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Success Stories */}
      <div className="testimonials">
        <h2 className="section-title">What Students Say</h2>
        <div className="testimonial-grid">
          <div className="testimonial-card">
            <div className="testimonial-text">
              "ABTalks changed my life. I went from zero to landing a job at a top product company in just 60 days."
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">A</div>
              <div>
                <div className="author-name">Ananya Reddy</div>
                <div className="author-college">IIT Kharagpur</div>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-text">
              "The daily commitment made me consistent. My GitHub profile is now my biggest asset."
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">R</div>
              <div>
                <div className="author-name">Rohit Kumar</div>
                <div className="author-college">NIT Trichy</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your Career?</h2>
          <p>Start your 60-day journey today. It's free, and your future self will thank you.</p>
          <button className="cta-button" onClick={() => onStart(selectedTrack)}>
            Start Your Challenge 🚀
          </button>
          <div className="cta-footer">
            <span>⚡ 100% Free</span>
            <span>📅 60 Days</span>
            <span>🏆 Certificates</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;