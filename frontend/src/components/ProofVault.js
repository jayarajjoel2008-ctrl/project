import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaCheck } from 'react-icons/fa';
import './ProofVault.css';

const ProofVault = ({ challenges = [], limit = 60, showHeader = true }) => {
  const displayChallenges = challenges.slice(0, limit);

  return (
    <div className="abtalks-proof-vault">
      {showHeader && (
        <div className="vault-header">
          <div>
            <h3>Proof of Work Vault</h3>
            <p>Your public 60-day builder history</p>
          </div>
          <Link to="/dashboard" className="vault-link">
            View All
          </Link>
        </div>
      )}

      <div className="vault-grid">
        {displayChallenges.map((c) => {
          const isDone = c.submitted;
          const hasGithub = Boolean(c.githubRepoUrl || c.githubCommitUrl);
          const hasLinkedin = Boolean(c.linkedinUrl);

          return (
            <Link key={c.day} to={`/day/${c.day}`} className={`vault-day-cell ${isDone ? 'completed' : ''}`}>
              <div className="cell-top">
                <span className="cell-day-num">DAY {String(c.day).padStart(2, '0')}</span>
                {isDone && <span className="cell-check-badge"><FaCheck /></span>}
              </div>

              <div className="cell-proof-icons">
                <span className={`proof-dot ${hasGithub ? 'active' : ''}`} title="GitHub Proof">
                  <FaGithub />
                </span>
                <span className={`proof-dot ${hasLinkedin ? 'active' : ''}`} title="LinkedIn Proof">
                  <FaLinkedin />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ProofVault;
