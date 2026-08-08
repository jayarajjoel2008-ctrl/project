import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLock, FaStar, FaAward, FaTimes, FaShieldAlt, FaGem, FaDownload, FaCheckCircle } from 'react-icons/fa';
import confetti from 'canvas-confetti';
import { claimAchievement, getUserProgress } from '../utils/storage';
import './AchievementCard.css';

const AchievementCard = ({ achievements = [] }) => {
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [flippedCards, setFlippedCards] = useState({});
  const [achievementsList, setAchievementsList] = useState(achievements);
  const [userName, setUserName] = useState('Joel');

  useEffect(() => {
    const current = getUserProgress();
    if (current?.achievements) {
      setAchievementsList(current.achievements);
    }
    if (current?.profile?.name) {
      setUserName(current.profile.name);
    }
  }, [achievements]);

  const unlockedCount = achievementsList.filter(a => a.unlocked).length;

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

  const handleClaimBadge = (achievement, e) => {
    e.stopPropagation();
    const updated = claimAchievement(achievement.id);
    setAchievementsList(updated.achievements);

    // Update current selected item
    const updatedItem = updated.achievements.find(a => a.id === achievement.id);
    setSelectedAchievement(updatedItem);

    triggerCelebration(achievement);
  };

  /**
   * Generates and downloads high-resolution PNG Badge Image in realtime using HTML5 Canvas
   */
  const downloadBadgeImage = (achievement) => {
    const canvas = document.createElement('canvas');
    canvas.width = 700;
    canvas.height = 700;
    const ctx = canvas.getContext('2d');

    // 1. Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 700, 700);
    bgGrad.addColorStop(0, '#090a10');
    bgGrad.addColorStop(0.5, '#12131f');
    bgGrad.addColorStop(1, '#1a1b2e');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 700, 700);

    // 2. Outer Neon Border Frame
    const rarityColor = achievement.rarity === 'LEGENDARY' ? '#f59e0b' : achievement.rarity === 'EPIC' ? '#a855f7' : '#06b6d4';
    ctx.strokeStyle = rarityColor;
    ctx.lineWidth = 8;
    ctx.strokeRect(30, 30, 640, 640);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.strokeRect(42, 42, 616, 616);

    // 3. Header Text
    ctx.fillStyle = '#6c5ce7';
    ctx.font = '800 22px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ABTALKS 2.0 • OFFICIAL BUILDER BADGE', 350, 90);

    // 4. Central Hexagon Shield Orb
    ctx.fillStyle = 'rgba(108, 92, 231, 0.15)';
    ctx.beginPath();
    ctx.arc(350, 240, 90, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = rarityColor;
    ctx.lineWidth = 4;
    ctx.stroke();

    // 5. Badge Emoji / Icon
    ctx.font = '90px sans-serif';
    ctx.fillText(achievement.icon || '🏆', 350, 270);

    // 6. Rarity Pill Tag
    ctx.fillStyle = rarityColor;
    ctx.font = '800 16px "JetBrains Mono", monospace';
    ctx.fillText(`[ ${achievement.rarity || 'RARE'} TIER BADGE ]`, 350, 370);

    // 7. Achievement Title
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 32px "Syne", sans-serif';
    ctx.fillText(achievement.title, 350, 420);

    // 8. Description
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(achievement.desc, 350, 460);

    // 9. Verified Student Awardee Name
    ctx.fillStyle = '#f8fafc';
    ctx.font = '700 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`AWARDED TO: ${userName.toUpperCase()}`, 350, 525);

    ctx.fillStyle = '#10b981';
    ctx.font = '700 16px "JetBrains Mono", monospace';
    ctx.fillText('✓ VERIFIED PUBLIC PROOF OF WORK', 350, 560);

    // 10. Footer Seal Signature
    ctx.fillStyle = '#64748b';
    ctx.font = '14px "JetBrains Mono", monospace';
    ctx.fillText(`Issued: ${new Date().toLocaleDateString()} • Verified Digital Certificate`, 350, 620);

    // Trigger Instant PNG Download
    const imageURI = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    const filename = `ABTALKS-Badge-${achievement.title.replace(/\s+/g, '-')}.png`;
    downloadLink.href = imageURI;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="abtalks-cyber-achievements-container">
      <div className="cyber-achievements-header">
        <div className="cyber-header-left">
          <span className="cyber-trophy-orb"><FaGem /></span>
          <div>
            <h3>CYBER TROPHY VAULT</h3>
            <span className="cyber-subtext">Unlock futuristic builder badges & download in realtime</span>
          </div>
        </div>

        <div className="cyber-badge-counter">
          <FaAward className="gold-award-icon" />
          <span>{unlockedCount} / {achievementsList.length} UNLOCKED</span>
        </div>
      </div>

      {/* ULTRA-UNIQUE CYBER HEXAGON / SHIELD BADGES CAROUSEL */}
      <div className="cyber-badge-grid-scroll">
        {achievementsList.map((item) => {
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
                    item.claimed ? (
                      <span className="claimed-status-pill"><FaCheckCircle /> CLAIMED</span>
                    ) : (
                      <button 
                        className="btn-claim-pill" 
                        onClick={(e) => handleClaimBadge(item, e)}
                      >
                        Claim Badge 🎁
                      </button>
                    )
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

                  {item.unlocked && (
                    <button 
                      className="btn-download-back-mini" 
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadBadgeImage(item);
                      }}
                    >
                      <FaDownload /> Download
                    </button>
                  )}

                  <button className="btn-flip-back" onClick={(e) => toggleFlip(item.id, e)}>
                    ← Back
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ULTRA-UNIQUE CYBER MODAL SHOWCASE WITH REALTIME DOWNLOAD */}
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
                  <FaCheckCircle /> 
                  <span>
                    {selectedAchievement.claimed 
                      ? `BADGE CLAIMED ON ${selectedAchievement.claimedAt || 'TODAY'}` 
                      : 'BADGE UNLOCKED — READY TO CLAIM'}
                  </span>
                </div>
              ) : (
                <div className="cyber-locked-status-banner">
                  <FaLock /> <span>LOCK STATUS: COMPLETE CHALLENGES TO CLAIM</span>
                </div>
              )}

              {selectedAchievement.unlocked && (
                <div className="modal-download-actions">
                  {!selectedAchievement.claimed && (
                    <button 
                      className="btn-claim-primary"
                      onClick={(e) => handleClaimBadge(selectedAchievement, e)}
                    >
                      Claim Achievement Badge 🎁
                    </button>
                  )}

                  <button 
                    className="btn-cyber-download"
                    onClick={() => downloadBadgeImage(selectedAchievement)}
                  >
                    <FaDownload /> Download Badge Image (.PNG) 📥
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AchievementCard;
