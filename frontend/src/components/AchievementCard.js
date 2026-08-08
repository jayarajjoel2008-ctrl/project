import React, { useState } from 'react';
import './AchievementCard.css';

const AchievementCard = ({ achievements = [] }) => {
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  return (
    <div className="abtalks-achievements-wrapper">
      <div className="achievements-header">
        <h3>Unlocked Achievements</h3>
        <span className="achievements-count">{achievements.filter(a => a.unlocked).length} / {achievements.length}</span>
      </div>

      <div className="achievements-h-scroll">
        {achievements.map((item) => (
          <div
            key={item.id}
            className={`achievement-tile ${item.unlocked ? 'unlocked' : 'locked'}`}
            onClick={() => setSelectedAchievement(item)}
          >
            <span className="achievement-icon">{item.icon}</span>
            <span className="achievement-title">{item.title}</span>
            <span className="achievement-status">{item.unlocked ? '✓ Unlocked' : '🔒 Locked'}</span>
          </div>
        ))}
      </div>

      {selectedAchievement && (
        <div className="achievement-detail-modal" onClick={() => setSelectedAchievement(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="modal-icon">{selectedAchievement.icon}</span>
            <h4>{selectedAchievement.title}</h4>
            <p>{selectedAchievement.desc}</p>
            <button className="btn-modal-close" onClick={() => setSelectedAchievement(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementCard;
