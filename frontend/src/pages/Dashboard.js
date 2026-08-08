import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaCheckCircle, FaRegCircle, FaSyncAlt } from 'react-icons/fa';

import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import StreakCard from '../components/StreakCard';
import ChallengeCard from '../components/ChallengeCard';
import NextUnlockTimer from '../components/NextUnlockTimer';
import ProofVault from '../components/ProofVault';
import StreakRescue from '../components/StreakRescue';
import ConsistencyScore from '../components/ConsistencyScore';
import AchievementCard from '../components/AchievementCard';

import { getUserProgress, rescueStreak, resetProgressToFirstDay, getMaxUnlockedDay } from '../utils/storage';
import './Dashboard.css';

const Dashboard = ({ theme, toggleTheme }) => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const current = getUserProgress();
    setData(current);
  }, []);

  if (!data) {
    return (
      <div className="abtalks-v2-dashboard app-container loading-state">
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  const { profile, challenges, achievements } = data;
  const maxUnlockedDay = getMaxUnlockedDay();
  const currentDayNum = profile.currentDay || 12;
  const todayChallenge = challenges.find(c => c.day === currentDayNum) || challenges[11];

  const daysRemaining = profile.totalDays - profile.completedDaysCount;
  const progressPercent = Math.round((profile.completedDaysCount / profile.totalDays) * 100);

  const handleStreakRescue = () => {
    const updated = rescueStreak();
    setData(updated);
  };

  const handleResetToFirstDayDemo = () => {
    const updated = resetProgressToFirstDay();
    setData(updated);
  };

  if (!profile.name) {
    return (
      <div className="abtalks-v2-dashboard app-container">
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <main className="dashboard-content-390 edge-case-box">
          <h2>Your builder profile is waiting.</h2>
          <p>Complete your first challenge to start building your public story.</p>
          <button className="btn-hero-primary-v2" onClick={() => navigate('/day/1')}>
            Start Day 1 →
          </button>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="abtalks-v2-dashboard app-container">
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <main className="dashboard-content-390">
        <header className="dashboard-welcome-header">
          <div className="welcome-text">
            <h2>Good evening, {profile.name} 👋</h2>
            <p className="welcome-sub">Ready for today's build?</p>
          </div>
          <button 
            className="demo-toggle-btn" 
            title="Toggle Day 1 First Day Edge Case Demo" 
            onClick={handleResetToFirstDayDemo}
          >
            <FaSyncAlt /> Demo Day 1
          </button>
        </header>

        <StreakCard 
          currentStreak={profile.currentStreak} 
          bestStreak={profile.bestStreak} 
        />

        <div className="abtalks-dashboard-card progress-card">
          <div className="progress-header">
            <span className="progress-day-label">DAY {currentDayNum} / {profile.totalDays}</span>
            <span className="progress-pct-val">{progressPercent}%</span>
          </div>

          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
          </div>

          <div className="progress-footer-note">
            <span>{daysRemaining} days remaining</span>
          </div>
        </div>

        <div className="section-title-row">
          <h3>TODAY'S MISSION</h3>
        </div>
        <ChallengeCard challenge={todayChallenge} />

        {/* LIVE COUNTDOWN TIMER FOR NEXT DAY 12:00 AM UNLOCK */}
        <NextUnlockTimer nextDayNum={maxUnlockedDay + 1} />

        <div className="abtalks-dashboard-card proof-status-card">
          <h4>TODAY'S PROOF STATUS</h4>
          <div className="proof-status-rows">
            <div className="proof-item">
              <span className="proof-label"><FaGithub /> GitHub</span>
              {todayChallenge.githubRepoUrl ? (
                <span className="status-badge done"><FaCheckCircle /> Submitted</span>
              ) : (
                <span className="status-badge pending"><FaRegCircle /> Not submitted</span>
              )}
            </div>

            <div className="proof-item">
              <span className="proof-label"><FaLinkedin /> LinkedIn</span>
              {todayChallenge.linkedinUrl ? (
                <span className="status-badge done"><FaCheckCircle /> Submitted</span>
              ) : (
                <span className="status-badge pending"><FaRegCircle /> Not submitted</span>
              )}
            </div>
          </div>
        </div>

        <StreakRescue 
          missedDay={profile.missedDay} 
          isRescued={profile.isStreakRescued} 
          onRescue={handleStreakRescue} 
        />

        <ConsistencyScore 
          score={profile.consistencyScore} 
          breakdown={profile.scoreBreakdown} 
        />

        <AchievementCard achievements={achievements} />

        {/* 60-DAY PROOF OF WORK VAULT WITH PROOF LINKS & LEVEL FILTERS */}
        <ProofVault challenges={challenges} limit={60} showHeader={true} />

        <div className="abtalks-dashboard-card story-summary-card">
          <div className="story-summary-text">
            <h4>Your Builder Story</h4>
            <p>{profile.completedDaysCount} Builds • {profile.githubProofsCount} GitHub proofs • {profile.linkedinPostsCount} LinkedIn posts</p>
          </div>
          <Link to="/day/12" className="btn-full-story-link">
            View Full Story →
          </Link>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
