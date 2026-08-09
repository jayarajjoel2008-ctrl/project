import React, { useState, useEffect } from 'react';
import { FaClock, FaLock } from 'react-icons/fa';
import { getTimeUntilMidnight, getMaxUnlockedDay } from '../utils/storage';
import './NextUnlockTimer.css';

const NextUnlockTimer = ({ nextDayNum }) => {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilMidnight());
  const maxUnlocked = getMaxUnlockedDay();
  const nextTargetDay = nextDayNum || maxUnlocked + 1;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilMidnight());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="abtalks-unlock-timer-card">
      <div className="timer-header">
        <div className="timer-title-group">
          <span className="timer-icon-badge"><FaLock /></span>
          <div>
            <h4>Day {nextTargetDay} Challenge Unlocks</h4>
            <span className="timer-subtext">Automatically at 9:30 AM Daily</span>
          </div>
        </div>
      </div>

      <div className="timer-display-row">
        <div className="time-unit">
          <span className="unit-number">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="unit-label">HOURS</span>
        </div>

        <span className="time-colon">:</span>

        <div className="time-unit">
          <span className="unit-number">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="unit-label">MINS</span>
        </div>

        <span className="time-colon">:</span>

        <div className="time-unit">
          <span className="unit-number">{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span className="unit-label">SECS</span>
        </div>
      </div>

      <div className="timer-footer">
        <FaClock className="clock-pulse-icon" />
        <span>Live countdown to next 9:30 AM daily unlock</span>
      </div>
    </div>
  );
};

export default NextUnlockTimer;
