import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaCheckSquare, FaSquare, FaFire, FaCheck, FaLock } from 'react-icons/fa';
import confetti from 'canvas-confetti';

import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import BuildBuddy from '../components/BuildBuddy';
import SubmissionForm from '../components/SubmissionForm';
import NextUnlockTimer from '../components/NextUnlockTimer';
import { getUserProgress, submitDayProof, toggleChecklistItem, isDayUnlocked } from '../utils/storage';

import './ChallengeDay.css';

const ChallengeDay = ({ theme, toggleTheme }) => {
  const { dayId } = useParams();
  const navigate = useNavigate();
  const dayNum = Number(dayId) || 12;

  const [data, setData] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const current = getUserProgress();
    setData(current);
  }, [dayId]);

  if (!data) {
    return (
      <div className="abtalks-v2-challenge app-container loading-state">
        <p>Loading Challenge Day {dayNum}...</p>
      </div>
    );
  }

  const unlocked = isDayUnlocked(dayNum);
  const challenge = data.challenges.find(c => c.day === dayNum) || data.challenges[11];
  const totalDays = data.profile.totalDays || 60;
  const progressPct = Math.round((dayNum / totalDays) * 100);

  const handleToggleChecklist = (itemId) => {
    if (!unlocked) return;
    const updated = toggleChecklistItem(dayNum, itemId);
    setData(updated);
  };

  const handleFormSubmitSuccess = (proofData) => {
    const updated = submitDayProof(
      dayNum,
      proofData.githubRepo,
      proofData.githubCommit,
      proofData.linkedinUrl,
      proofData.projectDescription
    );
    setData(updated);

    try {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } catch (e) {
      console.log('Confetti triggered');
    }

    setShowSuccessModal(true);
  };

  return (
    <div className="abtalks-v2-challenge app-container">
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <main className="challenge-content-390">
        <div className="challenge-top-bar">
          <Link to="/dashboard" className="btn-back-link">
            <FaArrowLeft /> Dashboard
          </Link>
          <span className="challenge-day-count">DAY {dayNum} / {totalDays}</span>
        </div>

        <div className="challenge-progress-line">
          <div className="challenge-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>

        {/* LOCKED DAY STATE DISPLAY WITH 12:00 AM COUNTDOWN */}
        {!unlocked ? (
          <div className="locked-day-container-card">
            <div className="locked-header-badge">
              <FaLock /> LEVEL DAY {dayNum} IS LOCKED
            </div>

            <h2>Day {dayNum} opens at 12:00 AM Midnight</h2>
            <p>Challenges open one level per day at midnight local time to build true consistency.</p>

            <NextUnlockTimer nextDayNum={dayNum} />

            <button className="btn-back-dashboard-primary" onClick={() => navigate('/dashboard')}>
              ← Back to Dashboard
            </button>
          </div>
        ) : (
          <>
            <div className="challenge-header-card">
              <div className="card-header-tags">
                <span className="day-pill">DAY {dayNum}</span>
                <span className="diff-pill">{challenge.difficulty}</span>
                <span className="time-pill">⏱️ {challenge.estimatedTime}</span>
              </div>

              <h1 className="challenge-main-title">{challenge.title}</h1>
            </div>

            <div className="abtalks-challenge-card objective-card">
              <h3>Objective</h3>
              <p>{challenge.objective}</p>
            </div>

            <div className="abtalks-challenge-card checklist-card">
              <h3>What You Need to Build</h3>
              <div className="checklist-items-list">
                {challenge.checklist.map((item) => (
                  <div 
                    key={item.id} 
                    className={`checklist-item ${item.completed ? 'completed' : ''}`}
                    onClick={() => handleToggleChecklist(item.id)}
                  >
                    <span className="checkbox-icon">
                      {item.completed ? <FaCheckSquare className="icon-checked" /> : <FaSquare className="icon-unchecked" />}
                    </span>
                    <span className="item-text">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="abtalks-challenge-card skills-card">
              <h3>Skills You'll Master</h3>
              <div className="skills-tags-list">
                {challenge.skills.map((s, idx) => (
                  <span key={idx} className="skill-pill-tag">✓ {s}</span>
                ))}
              </div>
            </div>

            <SubmissionForm 
              onSubmitSuccess={handleFormSubmitSuccess}
              initialRepo={challenge.githubRepoUrl}
              initialCommit={challenge.githubCommitUrl}
              initialLinkedin={challenge.linkedinUrl}
            />
          </>
        )}
      </main>

      {unlocked && <BuildBuddy isEmbedded={false} />}

      <AnimatePresence>
        {showSuccessModal && (
          <motion.div 
            className="success-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="success-modal-card"
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
            >
              <div className="success-icon-badge">🎉</div>

              <h2>DAY {dayNum} COMPLETE</h2>
              <p className="success-subtitle">Another build added to your public story.</p>

              <div className="success-proof-checks">
                <div className="check-row"><span>GitHub</span> <FaCheck className="icon-success" /></div>
                <div className="check-row"><span>LinkedIn</span> <FaCheck className="icon-success" /></div>
              </div>

              <div className="streak-reward-box">
                <div className="reward-item">
                  <FaFire className="reward-flame" />
                  <span>+{data.profile.currentStreak} Day Streak</span>
                </div>
                <div className="reward-item">
                  <span>+1 Proof of Work</span>
                </div>
              </div>

              <button 
                className="btn-next-day" 
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate(`/day/${dayNum + 1}`);
                }}
              >
                Continue to Day {dayNum + 1} →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
};

export default ChallengeDay;
