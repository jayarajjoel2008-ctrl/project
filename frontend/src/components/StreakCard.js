import React from 'react';
import { motion } from 'framer-motion';
import { FaFire } from 'react-icons/fa';
import './StreakCard.css';

const StreakCard = ({ currentStreak = 11, bestStreak = 18 }) => {
  const isFirstDay = currentStreak === 0;

  return (
    <div className="abtalks-streak-card">
      <div className="flame-bg-glow"></div>

      <div className="streak-card-content">
        <div className="streak-flame-wrapper">
          <motion.div
            className="flame-icon-box"
            animate={{ scale: [1, 1.15, 1], rotate: [-2, 2, -2] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <FaFire className="flame-svg" />
          </motion.div>
        </div>

        <div className="streak-text-box">
          <div className="streak-main-headline">
            <span className="streak-count-num">{currentStreak}</span>
            <span className="streak-unit-label">DAY STREAK</span>
          </div>

          <p className="streak-motivation-tag">
            {isFirstDay ? "Today is where your journey begins." : "Keep showing up."}
          </p>

          <div className="streak-footer-stats">
            <span className="best-streak-sub">
              Best streak: <strong>{bestStreak} days</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreakCard;
