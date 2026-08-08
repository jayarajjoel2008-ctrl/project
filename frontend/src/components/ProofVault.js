import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaCheck, FaLock, FaExternalLinkAlt, FaClock, FaHourglassHalf } from 'react-icons/fa';
import { isDayUnlocked, getLastCompletedDay, getTimeUntilMidnight } from '../utils/storage';
import './ProofVault.css';

const ProofVault = ({ challenges = [], limit = 60, showHeader = true }) => {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'completed', 'locked'
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [midnightTimer, setMidnightTimer] = useState(getTimeUntilMidnight());

  const lastCompletedDay = getLastCompletedDay(); // e.g. 11
  const nextUnlockingDay = lastCompletedDay + 1; // e.g. 12

  useEffect(() => {
    const timer = setInterval(() => {
      setMidnightTimer(getTimeUntilMidnight());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredChallenges = challenges.slice(0, limit).filter((c) => {
    const isCompleted = c.submitted;
    const isUnlocked = isDayUnlocked(c.day);

    if (activeFilter === 'completed') return isCompleted;
    if (activeFilter === 'locked') return !isUnlocked;
    return true;
  });

  const completedCount = challenges.filter(c => c.submitted).length;

  return (
    <div className="abtalks-proof-vault">
      {showHeader && (
        <div className="vault-header-block">
          <div className="vault-header-title">
            <h3>Proof of Work Vault</h3>
            <p>Level Progression: Complete previous level to unlock the next</p>
          </div>

          <div className="vault-filter-tabs">
            <button 
              className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All Levels ({limit})
            </button>
            <button 
              className={`filter-tab ${activeFilter === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveFilter('completed')}
            >
              Completed ({completedCount})
            </button>
            <button 
              className={`filter-tab ${activeFilter === 'locked' ? 'active' : ''}`}
              onClick={() => setActiveFilter('locked')}
            >
              Locked ({Math.max(0, 60 - lastCompletedDay)})
            </button>
          </div>
        </div>
      )}

      {/* LIVE MIDNIGHT COUNTDOWN TIMER BANNER BELOW LAST COMPLETED DAY */}
      <div className="vault-live-timer-banner">
        <div className="banner-left">
          <span className="banner-timer-icon"><FaHourglassHalf className="hourglass-spin" /></span>
          <div className="banner-text">
            <span className="banner-label">LAST COMPLETED: LEVEL DAY {lastCompletedDay}</span>
            <span className="banner-next-title">Level Day {nextUnlockingDay} Unlocks at 12:00 AM Midnight</span>
          </div>
        </div>

        <div className="banner-countdown-box">
          <FaClock />
          <span className="countdown-digits">{midnightTimer.formatted}</span>
        </div>
      </div>

      <div className="vault-grid">
        {filteredChallenges.map((c) => {
          const isCompleted = c.submitted;
          const isNextTarget = c.day === nextUnlockingDay;
          const unlocked = isDayUnlocked(c.day);
          const hasGithub = Boolean(c.githubRepoUrl || c.githubCommitUrl);
          const hasLinkedin = Boolean(c.linkedinUrl);

          return (
            <div 
              key={c.day}
              className={`vault-day-cell ${isCompleted ? 'completed' : isNextTarget ? 'next-target' : unlocked ? 'unlocked' : 'locked'}`}
              onClick={() => setSelectedChallenge(c)}
            >
              <div className="cell-top">
                <span className="cell-day-num">DAY {String(c.day).padStart(2, '0')}</span>
                {isCompleted ? (
                  <span className="cell-check-badge"><FaCheck /></span>
                ) : isNextTarget ? (
                  <span className="cell-target-badge">UNLOCKS 12:00 AM</span>
                ) : !unlocked ? (
                  <span className="cell-lock-icon"><FaLock /></span>
                ) : null}
              </div>

              <div className="cell-title-sub">
                {unlocked ? c.title.replace(`Day ${c.day}: `, '') : `Day ${c.day} Challenge (Locked)`}
              </div>

              {isNextTarget && !unlocked && (
                <div className="cell-next-timer-mini">
                  ⏱️ Unlocks 12:00 AM ({midnightTimer.hours}h {midnightTimer.minutes}m)
                </div>
              )}

              <div className="cell-proof-icons">
                <span className={`proof-dot ${hasGithub ? 'active' : ''}`} title="GitHub Proof">
                  <FaGithub />
                </span>
                <span className={`proof-dot ${hasLinkedin ? 'active' : ''}`} title="LinkedIn Proof">
                  <FaLinkedin />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAIL MODAL FOR SELECTED LEVEL */}
      {selectedChallenge && (
        <div className="vault-detail-modal-overlay" onClick={() => setSelectedChallenge(null)}>
          <div className="vault-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <span className="modal-day-tag">LEVEL DAY {selectedChallenge.day}</span>
              {selectedChallenge.submitted ? (
                <span className="badge-status done">✓ Verified Level Completed</span>
              ) : isDayUnlocked(selectedChallenge.day) ? (
                <span className="badge-status open">🔓 Unlocked — Complete Today</span>
              ) : selectedChallenge.day === nextUnlockingDay ? (
                <span className="badge-status timer">⏱️ Unlocks 12:00 AM Midnight</span>
              ) : (
                <span className="badge-status locked">🔒 Locked Level</span>
              )}
            </div>

            {/* IF UNLOCKED: SHOW FULL TITLE & OBJECTIVE. IF LOCKED: LOCK & OBSCURE */}
            {isDayUnlocked(selectedChallenge.day) ? (
              <>
                <h3 className="modal-title">{selectedChallenge.title}</h3>
                <p className="modal-objective">{selectedChallenge.objective}</p>

                <div className="modal-proof-links-box">
                  <h4>Verified Proof URLs</h4>
                  {selectedChallenge.githubRepoUrl ? (
                    <a 
                      href={selectedChallenge.githubRepoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="proof-link-item github"
                    >
                      <FaGithub />
                      <span className="link-text">GitHub Repository Proof</span>
                      <FaExternalLinkAlt className="ext-icon" />
                    </a>
                  ) : (
                    <div className="proof-link-item placeholder">
                      <FaGithub /> <span>No GitHub proof submitted yet</span>
                    </div>
                  )}

                  {selectedChallenge.linkedinUrl ? (
                    <a 
                      href={selectedChallenge.linkedinUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="proof-link-item linkedin"
                    >
                      <FaLinkedin />
                      <span className="link-text">LinkedIn Post Proof</span>
                      <FaExternalLinkAlt className="ext-icon" />
                    </a>
                  ) : (
                    <div className="proof-link-item placeholder">
                      <FaLinkedin /> <span>No LinkedIn proof submitted yet</span>
                    </div>
                  )}
                </div>

                <div className="modal-actions-row">
                  <Link 
                    to={`/day/${selectedChallenge.day}`} 
                    className="btn-modal-action-primary"
                    onClick={() => setSelectedChallenge(null)}
                  >
                    {selectedChallenge.submitted ? 'View / Edit Proof →' : 'Start Level Challenge →'}
                  </Link>

                  <button className="btn-modal-close-secondary" onClick={() => setSelectedChallenge(null)}>
                    Close
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="modal-title">🔒 Day {selectedChallenge.day} Challenge Statements Locked</h3>
                <p className="modal-objective">
                  Build statements, requirements, and challenge access unlock automatically at 12:00 AM Midnight.
                </p>

                {/* LIVE COUNTDOWN TIMER INSIDE MODAL */}
                <div className="modal-countdown-timer-box">
                  <FaClock className="hourglass-spin" />
                  <span>Unlocks in: <strong>{midnightTimer.formatted}</strong></span>
                </div>

                <div className="locked-notice-banner">
                  <FaLock />
                  <span>
                    {selectedChallenge.day === nextUnlockingDay
                      ? `Day ${selectedChallenge.day} opens at 12:00 AM Midnight`
                      : `Complete Level Day ${selectedChallenge.day - 1} to unlock this challenge`}
                  </span>
                </div>

                <div className="modal-actions-row">
                  <button className="btn-modal-action-disabled" disabled>
                    🔒 Challenge Unlocks at 12:00 AM Midnight
                  </button>

                  <button className="btn-modal-close-secondary" onClick={() => setSelectedChallenge(null)}>
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProofVault;
