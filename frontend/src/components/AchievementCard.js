import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLock, FaStar, FaAward, FaTimes, FaShieldAlt, FaGem } from 'react-icons/fa';
import confetti from 'canvas-confetti';
import './AchievementCard.css';

const AchievementCard = ({ achievements = [] }) => {
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [flippedCards, setFlippedCards] = useState({});

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  const toggleFlip = (id, e) => {
    e.stopPropagation();
    setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const triggerCelebration = (achievement) => {
    if (achievement.unlocked) {
      try {
        confetti({ 
          particleCount: 90, 
          spread: 70, 
          origin: { y: 0.6 },
          colors: ['#6c5ce7', '#06b6d4', '#f59e0b', '#10b981', '#a855f7']
        });
      } catch (e) {
        console.log('Achievement celebration');
      }
    }
  };

  return (
    <div className="abtalks-cyber-achievements-container">
      <div className="cyber-achievements-header">
        <div className="cyber-header-left">
          <span className="cyber-trophy-orb"><FaGem /></span>
          <div>
            <h3>CYBER TROPHY VAULT</h3>
            <span className="cyber-subtext">Unlock futuristic builder badges & earn XP</span>
          </div>
        </div>

        <div className="cyber-badge-counter">
          <FaAward className="gold-award-icon" />
          <span>{unlockedCount} / {achievements.length} UNLOCKED</span>
        </div>
      </div>

      {/* ULTRA-UNIQUE CYBER HEXAGON / SHIELD BADGES CAROUSEL */}
      <div className="cyber-badge-grid-scroll">
        {achievements.map((item) => {
          const rarityClass = item.rarity ? item.rarity.toLowerCase() : 'uncommon';
          const isFlipped = Boolean(flippedCards[item.id]);

          return (
            <motion.div
              key={item.id}
              className={`cyber-badge-card ${item.unlocked ? 'unlocked' : 'locked'} rarity-${rarityClass} ${isFlipped ? 'flipped' : ''}`}
              whileHover={{ y: -8, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedAchievement(item);
                triggerCelebration(item);
              }}
            >
              {/* ROTATING LASER BORDER ACCENT */}
              {item.unlocked && <div className="cyber-laser-spinner"></div>}

              <div className="cyber-badge-inner">
                {/* FRONT FACE */}
                <div className="cyber-badge-front">
                  <div className="badge-corner-tag">
                    {item.unlocked ? (
                      <span className={`cyber-rarity-pill ${rarityClass}`}>{item.rarity || 'RARE'}</span>
                    ) : (
                      <span className="cyber-rarity-pill locked-pill"><FaLock /> LOCKED</span>
                    )}
                  </div>

                  <div className="cyber-hexagon-frame">
                    <div className="hexagon-glow-aura"></div>
                    <span className="cyber-badge-emoji">{item.icon}</span>
                  </div>

                  <span className="cyber-badge-title">{item.title}</span>
                  
                  {item.unlocked ? (
                    <span className="cyber-badge-xp">+{item.points || 150} XP</span>
                  ) : (
                    <span className="cyber-badge-status-locked">LOCKED</span>
                  )}

                  {item.unlocked && (
                    <button 
                      className="btn-quick-flip" 
                      onClick={(e) => toggleFlip(item.id, e)}
                      title="Flip for info"
                    >
                      ⚡ info
                    </button>
                  )}
                </div>

                {/* BACK FACE (CARD FLIP INFO) */}
                <div className="cyber-badge-back">
                  <span className="back-rarity-header">{item.rarity || 'RARE'} BADGE</span>
                  <p className="back-desc">{item.desc}</p>
                  <span className="back-xp-reward">Reward: +{item.points || 150} XP</span>
                  <button className="btn-flip-back" onClick={(e) => toggleFlip(item.id, e)}>
                    ← Back
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ULTRA-UNIQUE CYBER MODAL SHOWCASE */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div 
            className="cyber-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div 
              className={`cyber-trophy-modal ${selectedAchievement.unlocked ? 'unlocked' : 'locked'}`}
              initial={{ scale: 0.8, rotateX: 20 }}
              animate={{ scale: 1, rotateX: 0 }}
              exit={{ scale: 0.8, rotateX: -20 }}
              transition={{ type: 'spring', damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="cyber-modal-close" onClick={() => setSelectedAchievement(null)}>
                <FaTimes />
              </button>

              <div className="cyber-modal-header-tag">
                <FaShieldAlt /> VERIFIED BUILDER TROPHY
              </div>

              <div className="cyber-modal-hero-hexagon">
                <div className="hero-hexagon-border"></div>
                <span className="hero-emoji-icon">{selectedAchievement.icon}</span>
              </div>

              <div className="cyber-modal-rarity-row">
                <span className={`cyber-rarity-pill ${selectedAchievement.rarity ? selectedAchievement.rarity.toLowerCase() : 'rare'}`}>
                  <FaStar /> {selectedAchievement.rarity || 'RARE'} TIER
                </span>
                <span className="cyber-xp-pill">+{selectedAchievement.points || 150} XP REWARD</span>
              </div>

              <h3 className="cyber-modal-title">{selectedAchievement.title}</h3>
              <p className="cyber-modal-desc">{selectedAchievement.desc}</p>

              {selectedAchievement.unlocked ? (
                <div className="cyber-unlocked-status-banner">
                  <FaAward /> <span>BADGE UNLOCKED & RECORDED ON PROFILE</span>
                </div>
              ) : (
                <div className="cyber-locked-status-banner">
                  <FaLock /> <span>LOCK STATUS: COMPLETE CHALLENGES TO CLAIM</span>
                </div>
              )}

              {selectedAchievement.unlocked && (
                <button 
                  className="btn-cyber-celebrate"
                  onClick={() => triggerCelebration(selectedAchievement)}
                >
                  Trigger Victory Spark 🎉
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
