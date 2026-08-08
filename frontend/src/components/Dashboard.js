import React, { useState, useEffect } from 'react';
import { format, differenceInDays, parseISO } from 'date-fns';
import { FaFire, FaCalendarCheck, FaTrophy, FaRocket, FaGithub } from 'react-icons/fa';
import { fetchUserWithFallback } from '../api/api';
import './Dashboard.css';

const Dashboard = ({ user, onDaySelect }) => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        // Fetch real data from backend API
        const data = await fetchUserWithFallback('user_1');
        setUserData(data);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  const handleDayClick = (day) => {
    onDaySelect(day);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="dashboard-error">
        <p>Failed to load user data. Please try again.</p>
      </div>
    );
  }

  const progress = (userData.totalDaysCompleted / userData.totalDays) * 100;
  const today = new Date();
  const startDate = parseISO(userData.startDate);
  const daysPassed = differenceInDays(today, startDate) + 1;
  const isTodayCompleted = userData.submissions.includes(daysPassed);

  return (
    <div className="dashboard">
      {/* Welcome Header */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1 className="welcome-title">
            Welcome back, <span className="user-name">{userData.name}</span>! 👋
          </h1>
          <p className="welcome-subtitle">
            {userData.track} • {userData.college}
          </p>
        </div>
        <div className="header-actions">
          <button className="share-btn" onClick={() => window.open('https://github.com', '_blank')}>
            <FaGithub /> Share
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card streak">
          <div className="stat-icon">
            <FaFire />
          </div>
          <div className="stat-content">
            <span className="stat-value">{userData.currentStreak}</span>
            <span className="stat-label">Day Streak</span>
            <span className="stat-sub">Best: {userData.longestStreak} days</span>
          </div>
        </div>

        <div className="stat-card completed">
          <div className="stat-icon">
            <FaCalendarCheck />
          </div>
          <div className="stat-content">
            <span className="stat-value">{userData.totalDaysCompleted}</span>
            <span className="stat-label">Days Completed</span>
            <span className="stat-sub">of {userData.totalDays}</span>
          </div>
        </div>

        <div className="stat-card progress-stat">
          <div className="stat-icon">
            <FaRocket />
          </div>
          <div className="stat-content">
            <span className="stat-value">{Math.round(progress)}%</span>
            <span className="stat-label">Progress</span>
            <span className="stat-sub">{userData.totalDays - userData.totalDaysCompleted} days left</span>
          </div>
        </div>

        <div className="stat-card achievements">
          <div className="stat-icon">
            <FaTrophy />
          </div>
          <div className="stat-content">
            <span className="stat-value">{userData.achievements?.length || 0}</span>
            <span className="stat-label">Achievements</span>
            <span className="stat-sub">Unlocked</span>
          </div>
        </div>
      </div>

      {/* Today's Task */}
      <div className="today-task">
        <div className="task-header">
          <h2>📌 Today's Task</h2>
          <span className="task-day">Day {daysPassed}</span>
        </div>
        <div className={`task-card ${isTodayCompleted ? 'completed' : ''}`}>
          <div className="task-status">
            {isTodayCompleted ? (
              <span className="status-badge completed">✅ Completed</span>
            ) : (
              <span className="status-badge pending">⏳ Pending</span>
            )}
          </div>
          <h3>Build Your Personal Portfolio Website</h3>
          <p className="task-description">
            Create a responsive personal portfolio website using HTML, CSS, and JavaScript. 
            Include sections for About, Projects, Skills, and Contact.
          </p>
          <div className="task-meta">
            <span>⏱️ 2-3 hours</span>
            <span>📊 Beginner</span>
          </div>
          <button 
            className="task-action-btn"
            onClick={() => handleDayClick(daysPassed)}
          >
            {isTodayCompleted ? '📝 Review Task' : '🚀 Start Task'}
          </button>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="progress-timeline">
        <h2>Your Journey</h2>
        <div className="timeline-grid">
          {Array.from({ length: 60 }, (_, i) => i + 1).map(day => {
            const isCompleted = userData.submissions.includes(day);
            const isCurrent = day === daysPassed;
            return (
              <div 
                key={day}
                className={`timeline-day ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                onClick={() => handleDayClick(day)}
                title={`Day ${day}${isCompleted ? ' ✅' : ''}${isCurrent ? ' 📌' : ''}`}
              >
                {isCompleted && <span className="day-check">✓</span>}
                {isCurrent && <span className="day-indicator">📍</span>}
                <span className="day-number">{day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      <div className="achievements-section">
        <h2>🏆 Achievements</h2>
        <div className="achievements-grid">
          {userData.achievements && userData.achievements.length > 0 ? (
            userData.achievements.map(achievement => (
              <div key={achievement.id} className="achievement-card">
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="achievement-info">
                  <h4>{achievement.name}</h4>
                  <p>{achievement.description}</p>
                  <span className="achievement-date">
                    Unlocked {format(parseISO(achievement.unlockedAt), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-achievements">
              <p>Keep going! Your first achievement is waiting. 🚀</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
