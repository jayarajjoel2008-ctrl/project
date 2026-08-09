import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaTags, FaArrowRight, FaLock } from 'react-icons/fa';
import { isDayUnlocked, getTimeUntilMidnight } from '../utils/storage';
import './ChallengeCard.css';

const ChallengeCard = ({ challenge }) => {
  const [midnightTimer, setMidnightTimer] = useState(getTimeUntilMidnight());

  useEffect(() => {
    const timer = setInterval(() => {
      setMidnightTimer(getTimeUntilMidnight());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dayNum = challenge?.day || 12;
  const title = challenge?.title || "Build an AI Weather Assistant";
  const difficulty = challenge?.difficulty || "Intermediate";
  const time = challenge?.estimatedTime || "30 min";
  const skills = challenge?.skills || ["React", "API", "JavaScript"];

  const unlocked = isDayUnlocked(dayNum);

  return (
    <div className={`abtalks-mission-card ${unlocked ? 'unlocked' : 'locked'}`}>
      <div className="mission-card-header">
        <span className="mission-day-badge">DAY {dayNum} MISSION</span>
        {unlocked ? (
          <span className={`mission-diff-badge ${difficulty.toLowerCase()}`}>
            {difficulty}
          </span>
        ) : (
          <span className="mission-locked-tag">
            <FaLock /> UNLOCKS 9:30 AM
          </span>
        )}
      </div>

      <h3 className="mission-title">{title}</h3>

      {unlocked ? (
        <>
          <div className="mission-meta-row">
            <span className="meta-item"><FaClock /> {time}</span>
            <span className="meta-item"><FaTags /> {skills.join(' • ')}</span>
          </div>

          <Link to={`/day/${dayNum}`} className="btn-start-mission">
            <span>Start Today's Challenge</span>
            <FaArrowRight />
          </Link>
        </>
      ) : (
        <div className="mission-locked-info-box">
          <div className="locked-timer-row">
            <FaClock className="clock-icon-pulse" />
            <span>Unlocks in: <strong>{midnightTimer.formatted}</strong></span>
          </div>
          <p className="locked-sub-text">
            Build statements & objectives unlock automatically at 9:30 AM daily.
          </p>
          <Link to={`/day/${dayNum}`} className="btn-locked-preview">
            <span>View Locked Countdown Details</span>
            <FaLock />
          </Link>
        </div>
      )}
    </div>
  );
};

export default ChallengeCard;
