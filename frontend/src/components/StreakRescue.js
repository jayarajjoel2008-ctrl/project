import React, { useState } from 'react';
import { FaLifeRing, FaCheckCircle } from 'react-icons/fa';
import './StreakRescue.css';

const StreakRescue = ({ missedDay = 11, isRescued = false, onRescue }) => {
  const [loading, setLoading] = useState(false);
  const [rescuedLocal, setRescuedLocal] = useState(isRescued);

  const handleRescueClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRescuedLocal(true);
      if (onRescue) onRescue();
    }, 1200);
  };

  if (rescuedLocal) {
    return (
      <div className="abtalks-streak-rescue-card on-track">
        <div className="rescue-icon-box success">
          <FaCheckCircle />
        </div>
        <div className="rescue-content">
          <h4>✓ You're on track!</h4>
          <p>Your streak is safe. Keep building every day.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="abtalks-streak-rescue-card alert">
      <div className="rescue-icon-box alert">
        <FaLifeRing />
      </div>

      <div className="rescue-content">
        <div className="rescue-badge">🛟 STREAK RESCUE</div>
        <h4>Day {missedDay} was missed</h4>
        <p>College gets busy. Complete a short 5-minute recovery challenge to restore your streak!</p>

        <button className="btn-rescue-action" onClick={handleRescueClick} disabled={loading}>
          {loading ? "Restoring Streak..." : "Rescue My Streak →"}
        </button>
      </div>
    </div>
  );
};

export default StreakRescue;
