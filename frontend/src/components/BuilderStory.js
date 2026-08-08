import React from 'react';
import { FaGithub, FaLinkedin, FaAward } from 'react-icons/fa';
import './BuilderStory.css';

const BuilderStory = ({ profile, onActionClick }) => {
  const name = profile?.name || "JOEL";
  const role = profile?.role || "60-DAY BUILDER";
  const completed = profile?.completedDaysCount || 47;
  const total = profile?.totalDays || 60;
  const githubCount = profile?.githubProofsCount || 44;
  const linkedinCount = profile?.linkedinPostsCount || 42;
  const skills = profile?.skills || ["React", "JavaScript", "Python", "APIs", "Git", "Problem Solving"];

  return (
    <div className="abtalks-builder-story-card">
      <div className="story-card-top">
        <div className="avatar-orb">
          <span>⚡</span>
        </div>
        <div className="story-user-meta">
          <h3>{name}</h3>
          <span className="story-badge">{role}</span>
        </div>
      </div>

      <div className="story-metrics-grid">
        <div className="story-metric">
          <span className="metric-num">{completed}/{total}</span>
          <span className="metric-label">Days completed</span>
        </div>
        <div className="story-metric">
          <span className="metric-num"><FaGithub /> {githubCount}</span>
          <span className="metric-label">GitHub proofs</span>
        </div>
        <div className="story-metric">
          <span className="metric-num"><FaLinkedin /> {linkedinCount}</span>
          <span className="metric-label">LinkedIn posts</span>
        </div>
      </div>

      <div className="story-skills-cloud">
        <span className="skills-heading">Verified Skills:</span>
        <div className="skills-pills">
          {skills.map((s, idx) => (
            <span key={idx} className="skill-tag">✓ {s}</span>
          ))}
        </div>
      </div>

      <button className="btn-view-story" onClick={onActionClick || (() => alert("Opening Joel's public builder story link..."))}>
        <span>View Builder Story</span>
        <FaAward />
      </button>
    </div>
  );
};

export default BuilderStory;
