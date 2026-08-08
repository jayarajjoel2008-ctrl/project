import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaCheck, FaLock, FaExternalLinkAlt, FaClock } from 'react-icons/fa';
import { isDayUnlocked, getMaxUnlockedDay } from '../utils/storage';
import './ProofVault.css';

const ProofVault = ({ challenges = [], limit = 60, showHeader = true }) => {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'completed', 'locked'
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const maxUnlockedDay = getMaxUnlockedDay();

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
            <p>Verifiable public proof for all 60 coding levels</p>
          </div>

          <div className="vault-filter-tabs">
            <button 
              className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All ({limit})
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
              Locked ({Math.max(0, 60 - maxUnlockedDay)})
            </button>
          </div>
        </div>
      )}

      <div className="vault-grid">
        {filteredChallenges.map((c) => {
          const isDone = c.submitted;
          const unlocked = isDayUnlocked(c.day);
          const hasGithub = Boolean(c.githubRepoUrl || c.githubCommitUrl);
          const hasLinkedin = Boolean(c.linkedinUrl);

          return (
            <div 
              key={c.day}
              className={`vault-day-cell ${isDone ? 'completed' : unlocked ? 'unlocked' : 'locked'}`}
              onClick={() => setSelectedChallenge(c)}
            >
              <div className="cell-top">
                <span className="cell-day-num">DAY {String(c.day).padStart(2, '0')}</span>
                {isDone ? (
                  <span className="cell-check-badge"><FaCheck /></span>
                ) : !unlocked ? (
                  <span className="cell-lock-icon"><FaLock /></span>
                ) : null}
              </div>

              <div className="cell-title-sub">{c.title.replace(`Day ${c.day}: `, '')}</div>

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
                <span className="badge-status done">✓ Verified Proof</span>
              ) : isDayUnlocked(selectedChallenge.day) ? (
                <span className="badge-status open">🔓 Unlocked Level</span>
              ) : (
                <span className="badge-status locked">🔒 Unlocks at 12:00 AM Midnight</span>
              )}
            </div>

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
              {isDayUnlocked(selectedChallenge.day) ? (
                <Link 
                  to={`/day/${selectedChallenge.day}`} 
                  className="btn-modal-action-primary"
                  onClick={() => setSelectedChallenge(null)}
                >
                  {selectedChallenge.submitted ? 'View / Edit Proof →' : 'Start Level Challenge →'}
                </Link>
              ) : (
                <div className="locked-notice-banner">
                  <FaClock />
                  <span>Scheduled to open at 12:00 AM Midnight</span>
                </div>
              )}

              <button className="btn-modal-close-secondary" onClick={() => setSelectedChallenge(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProofVault;
