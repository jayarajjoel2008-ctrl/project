import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLock, FaMedal, FaStar, FaAward, FaTimes } from 'react-icons/fa';
import confetti from 'canvas-confetti';
import './AchievementCard.css';

const AchievementCard = ({ achievements = [] }) => {
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  const triggerCelebration = (achievement) => {
    if (achievement.unlocked) {
      try {
        confetti({ particleCount: 70, spread: 50, origin: { y: 0.6 } });
      } catch (e) {
        console.log('Achievement celebration');
      }
    }
  };

  return (
    <div className="abtalks-achievements-wrapper">
      <div className="achievements-header">
        <div className="achievements-title-group">
          <span className="trophy-header-icon"><FaAward /></span>
          <div>
            <h3>Trophy Room & Badges</h3>
            <span className="achievements-subtext">Earn badges by maintaining daily build discipline</span>
          </div>
        </div>

        <div className="achievements-badge-pill">
          <FaMedal className="medal-gold-icon" />
          <span>{unlockedCount} / {achievements.length} Unlocked</span>
        </div>
      </div>

      {/* HOLOGRAPHIC 3D BADGES CAROUSEL */}
      <div className="achievements-h-scroll">
        {achievements.map((item) => {
          const rarityClass = item.rarity ? item.rarity.toLowerCase() : 'uncommon';

          return (
            <motion.div
              key={item.id}
              className={`achievement-3d-card ${item.unlocked ? 'unlocked' : 'locked'} rarity-${rarityClass}`}
              whileHover={{ y: -6, scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                setSelectedAchievement(item);
                triggerCelebration(item);
              }}
            >
              {item.unlocked && <div className="holographic-shine-bar"></div>}

              <div className="card-top-rarity">
                {item.unlocked ? (
                  <span className={`rarity-tag ${rarityClass}`}>{item.rarity || 'RARE'}</span>
                ) : (
                  <span className="rarity-tag locked-tag"><FaLock /> LOCKED</span>
                )}
              </div>

              <div className="badge-orb-wrapper">
                <div className={`badge-icon-orb ${item.unlocked ? 'glow' : 'locked'}`}>
                  <span>{item.icon}</span>
                </div>
              </div>

              <div className="badge-details">
                <span className="badge-name">{item.title}</span>
                {item.points && (
                  <span className="badge-pts">+{item.points} XP</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* INTERACTIVE TROPHY DETAIL MODAL */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div 
            className="achievement-detail-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div 
              className={`trophy-modal-card ${selectedAchievement.unlocked ? 'unlocked-card' : 'locked-card'}`}
              initial={{ scale: 0.85, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="btn-modal-close-icon" onClick={() => setSelectedAchievement(null)}>
                <FaTimes />
              </button>

              <div className="modal-badge-hero-orb">
                <span className="hero-emoji">{selectedAchievement.icon}</span>
                {selectedAchievement.unlocked && <div className="orb-halo-pulse"></div>}
              </div>

              <div className="modal-rarity-row">
                <span className={`rarity-chip ${selectedAchievement.rarity ? selectedAchievement.rarity.toLowerCase() : 'rare'}`}>
                  <FaStar /> {selectedAchievement.rarity || 'RARE'} ACHIEVEMENT
                </span>
                {selectedAchievement.points && (
                  <span className="xp-chip">+{selectedAchievement.points} BUILD XP</span>
                )}
              </div>

              <h3 className="modal-trophy-title">{selectedAchievement.title}</h3>
              <p className="modal-trophy-desc">{selectedAchievement.desc}</p>

              <div className="modal-status-callout">
                {selectedAchievement.unlocked ? (
                  <span className="callout-text success">✓ BADGE UNLOCKED & CLAIMED</span>
                ) : (
                  <span className="callout-text locked"><FaLock /> Complete requirements to unlock</span>
                )}
              </div>

              {selectedAchievement.unlocked && (
                <button 
                  className="btn-celebrate-again"
                  onClick={() => triggerCelebration(selectedAchievement)}
                >
                  Celebrate Unlock 🎉
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AchievementCard;
