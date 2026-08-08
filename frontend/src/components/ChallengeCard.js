import React from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaTags, FaArrowRight } from 'react-icons/fa';
import './ChallengeCard.css';

const ChallengeCard = ({ challenge }) => {
  const dayNum = challenge?.day || 12;
  const title = challenge?.title || "Build an AI Weather Assistant";
  const difficulty = challenge?.difficulty || "Intermediate";
  const time = challenge?.estimatedTime || "30 min";
  const skills = challenge?.skills || ["React", "API", "JavaScript"];

  return (
    <div className="abtalks-mission-card">
      <div className="mission-card-header">
        <span className="mission-day-badge">DAY {dayNum} MISSION</span>
        <span className={`mission-diff-badge ${difficulty.toLowerCase()}`}>
          {difficulty}
        </span>
      </div>

      <h3 className="mission-title">{title}</h3>

      <div className="mission-meta-row">
        <span className="meta-item"><FaClock /> {time}</span>
        <span className="meta-item"><FaTags /> {skills.join(' • ')}</span>
      </div>

      <Link to={`/day/${dayNum}`} className="btn-start-mission">
        <span>Start Today's Challenge</span>
        <FaArrowRight />
      </Link>
    </div>
  );
};

export default ChallengeCard;
