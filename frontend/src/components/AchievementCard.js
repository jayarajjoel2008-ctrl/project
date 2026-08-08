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
  const [userName, setUserName] = useState('Arvind');

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
          particleCount: 100, 
          spread: 80, 
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#6c5ce7', '#06b6d4', '#10b981', '#a855f7']
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

    const updatedItem = updated.achievements.find(a => a.id === achievement.id);
    setSelectedAchievement(updatedItem);

    triggerCelebration(achievement);
  };

  /**
   * Generates and downloads ultra-stylish, high-resolution PNG Badge Certificate in realtime
   */
  const downloadBadgeImage = (achievement, e) => {
    if (e) e.stopPropagation();

    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    const mainColor = achievement.rarity === 'LEGENDARY' ? '#f59e0b' : achievement.rarity === 'EPIC' ? '#a855f7' : '#06b6d4';

    // 1. Cyber Dark Metallic Background Gradient
    const bgGrad = ctx.createRadialGradient(400, 400, 60, 400, 400, 560);
    bgGrad.addColorStop(0, '#16172b');
    bgGrad.addColorStop(0.5, '#0b0c15');
    bgGrad.addColorStop(1, '#050609');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 800, 800);

    // Subtle Grid Watermark
    ctx.strokeStyle = 'rgba(108, 92, 231, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 800; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 800);
      ctx.stroke();
    }
    for (let y = 0; y < 800; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(800, y);
      ctx.stroke();
    }

    // 2. Outer Bevelled Laser Frame Lines
    ctx.strokeStyle = mainColor;
    ctx.lineWidth = 12;
    ctx.strokeRect(32, 32, 736, 736);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 2;
    ctx.strokeRect(48, 48, 704, 704);

    // Glowing Corner Gems
    const drawGemCorner = (x, y) => {
      ctx.fillStyle = mainColor;
      ctx.fillRect(x - 10, y - 10, 24, 24);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(x - 10, y - 10, 24, 24);
    };
    drawGemCorner(32, 32);
    drawGemCorner(768, 32);
    drawGemCorner(32, 768);
    drawGemCorner(768, 768);

    // 3. Top Header Brand Tag
    ctx.fillStyle = '#6c5ce7';
    ctx.font = '800 20px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('🎙️ ABTALKS 2.0 • OFFICIAL BUILDER TROPHY CERTIFICATE', 400, 92);

    // 4. Central Shield Emblem
    ctx.fillStyle = 'rgba(108, 92, 231, 0.2)';
    ctx.beginPath();
    ctx.arc(400, 255, 95, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = mainColor;
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(400, 255, 82, 0, Math.PI * 2);
    ctx.stroke();

    // Emoji Trophy Icon
    ctx.font = '100px sans-serif';
    ctx.fillText(achievement.icon || '🏆', 400, 290);

    // 5. Rarity & XP Chip
    ctx.fillStyle = mainColor;
    ctx.font = '800 18px "JetBrains Mono", monospace';
    ctx.fillText(`[ ${achievement.rarity || 'RARE'} TIER • +${achievement.points || 150} BUILD XP ]`, 400, 395);

    // 6. Achievement Title
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 36px "Syne", sans-serif';
    ctx.fillText(achievement.title, 400, 450);

    // 7. Achievement Description
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(achievement.desc, 400, 490);

    // 8. Awarded To Section
    ctx.fillStyle = '#64748b';
    ctx.font = '700 14px "JetBrains Mono", monospace';
    ctx.fillText('THIS CERTIFICATE IS OFFICIALLY PRESENTED TO:', 400, 560);

    ctx.fillStyle = '#f59e0b';
    ctx.font = '900 38px "Syne", sans-serif';
    ctx.fillText(userName.toUpperCase(), 400, 610);

    // Verified Stamp
    ctx.fillStyle = '#10b981';
    ctx.font = '800 16px "JetBrains Mono", monospace';
    ctx.fillText('✓ VERIFIED PUBLIC PROOF OF WORK • 60-DAY FULL-STACK TRACK', 400, 655);

    // Barcode Simulation & Serial Hash
    ctx.fillStyle = '#475569';
    ctx.font = '14px "JetBrains Mono", monospace';
    ctx.fillText('║▌║█║▌│║▌║▌█║▌│║▌║▌█║▌│║▌', 400, 700);

    const serialHash = `CERT-ID: #ABTALKS-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    ctx.fillStyle = '#64748b';
    ctx.font = '13px "JetBrains Mono", monospace';
    ctx.fillText(`${serialHash} • Issued: ${new Date().toLocaleDateString()}`, 400, 730);

    // Trigger Instant PNG Download
    const imageURI = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    const filename = `ABTALKS-Certificate-${achievement.title.replace(/\s+/g, '-')}.png`;
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
                    <div className="unlocked-card-actions-row">
                      {item.claimed ? (
                        <span className="claimed-status-pill"><FaCheckCircle /> CLAIMED</span>
                      ) : (
                        <button 
                          className="btn-claim-pill" 
                          onClick={(e) => handleClaimBadge(item, e)}
                        >
                          Claim 🎁
                        </button>
                      )}

                      <button 
                        className="btn-download-direct-pill"
                        title="Download Badge Image PNG"
                        onClick={(e) => downloadBadgeImage(item, e)}
                      >
                        <FaDownload />
                      </button>
                    </div>
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
                      onClick={(e) => downloadBadgeImage(item, e)}
                    >
                      <FaDownload /> Download PNG
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
                  <FaLock /> <span>LOCK STATUS: COMPLETE CHALLENGES TO UNLOCK</span>
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
                    onClick={(e) => downloadBadgeImage(selectedAchievement, e)}
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
