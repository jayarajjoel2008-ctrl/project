import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLock, FaAward, FaTimes, FaShieldAlt, FaDownload } from 'react-icons/fa';
import confetti from 'canvas-confetti';
import { claimAchievement, getUserProgress } from '../utils/storage';
import './AchievementCard.css';

const AchievementCard = ({ achievements = [] }) => {
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [achievementsList, setAchievementsList] = useState(achievements);
  const [userName, setUserName] = useState('Arvind');
  const [userProfile, setUserProfile] = useState({});

  useEffect(() => {
    const current = getUserProgress();
    if (current?.achievements) {
      setAchievementsList(current.achievements);
    }
    if (current?.profile) {
      setUserProfile(current.profile);
      if (current.profile.name) {
        setUserName(current.profile.name);
      }
    }
  }, [achievements]);

  const unlockedCount = achievementsList.filter(a => a.unlocked).length;

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
    if (e) e.stopPropagation();
    if (!achievement.unlocked) return;

    const updated = claimAchievement(achievement.id);
    setAchievementsList(updated.achievements);

    const updatedItem = updated.achievements.find(a => a.id === achievement.id);
    setSelectedAchievement(updatedItem);

    triggerCelebration(achievement);
  };

  /**
   * Generates and downloads high-resolution PNG Badge Certificate in realtime
   */
  const downloadBadgeImage = (achievement, e) => {
    if (e) e.stopPropagation();

    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    const mainColor = achievement.rarity === 'LEGENDARY' ? '#f59e0b' : achievement.rarity === 'EPIC' ? '#a855f7' : '#06b6d4';

    // 1. Blue-Purple Radial Gradient Background
    const bgGrad = ctx.createRadialGradient(400, 400, 60, 400, 400, 560);
    bgGrad.addColorStop(0, '#1e1b4b');
    bgGrad.addColorStop(0.5, '#0f172a');
    bgGrad.addColorStop(1, '#020617');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 800, 800);

    // 2. Dual Bevel Border & Corner Accents
    ctx.strokeStyle = mainColor;
    ctx.lineWidth = 10;
    ctx.strokeRect(36, 36, 728, 728);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 50, 700, 700);

    const drawCorner = (x, y) => {
      ctx.fillStyle = mainColor;
      ctx.fillRect(x - 8, y - 8, 20, 20);
    };
    drawCorner(36, 36);
    drawCorner(764, 36);
    drawCorner(36, 764);
    drawCorner(764, 764);

    // 3. Header Text
    ctx.fillStyle = '#6c5ce7';
    ctx.font = '800 20px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ABTALKS 2.0 • OFFICIAL BUILDER MILESTONE CERTIFICATE', 400, 95);

    // 4. Central Circular Arc Ring (Reference Image Design)
    ctx.lineWidth = 14;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.arc(400, 260, 100, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = mainColor;
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(400, 260, 100, -Math.PI / 2, (Math.PI * 2) * 0.85 - Math.PI / 2);
    ctx.stroke();

    // Inner Circle Fill
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.beginPath();
    ctx.arc(400, 260, 85, 0, Math.PI * 2);
    ctx.fill();

    // Emoji Icon
    ctx.font = '95px sans-serif';
    ctx.fillText(achievement.icon || '🏆', 400, 295);

    // 5. Points Pill Tag (Reference Image Style)
    ctx.fillStyle = '#f59e0b';
    ctx.font = '900 24px "Syne", sans-serif';
    ctx.fillText(`${achievement.points || 250} PTS AWARDED`, 400, 405);

    // 6. Achievement Title
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 36px "Syne", sans-serif';
    ctx.fillText(achievement.title.toUpperCase(), 400, 460);

    // 7. Achievement Description
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(achievement.desc, 400, 500);

    // 8. Awarded To Section
    ctx.fillStyle = '#64748b';
    ctx.font = '700 14px "JetBrains Mono", monospace';
    ctx.fillText('THIS CERTIFICATE IS OFFICIALLY PRESENTED TO:', 400, 570);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 38px "Syne", sans-serif';
    ctx.fillText(userName.toUpperCase(), 400, 620);

    // Verified Stamp
    ctx.fillStyle = '#10b981';
    ctx.font = '800 16px "JetBrains Mono", monospace';
    ctx.fillText('✓ VERIFIED PUBLIC PROOF OF WORK • 60-DAY FULL-STACK TRACK', 400, 665);

    // Serial & Signature Line
    const serialHash = `CERT-ID: #ABTALKS-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    ctx.fillStyle = '#64748b';
    ctx.font = '13px "JetBrains Mono", monospace';
    ctx.fillText(`${serialHash} • Issued: ${new Date().toLocaleDateString()}`, 400, 730);

    // Convert Canvas to Blob for Native Gallery Share / Direct Device Storage Download
    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const filename = `ABTALKS-Badge-${achievement.title.replace(/\s+/g, '-')}.png`;
      const file = new File([blob], filename, { type: 'image/png' });

      // Try Native Mobile Web Share API first (iOS / Android Photo Gallery)
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: `ABTALKS 2.0 Badge - ${achievement.title}`,
            text: `Check out my verified ${achievement.title} badge!`,
            files: [file]
          });
          return;
        } catch (shareErr) {
          console.log('Fallback to direct file download');
        }
      }

      // Direct Anchor Download to device storage
      const imageURI = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = imageURI;
      downloadLink.download = filename;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      setTimeout(() => URL.revokeObjectURL(imageURI), 2000);
    }, 'image/png');
  };

  /**
   * Returns progress count ratio based on achievement type
   */
  const getProgressVal = (item) => {
    if (item.type === 'streak') return userProfile.currentStreak || 11;
    if (item.type === 'posts') return userProfile.linkedinPostsCount || 10;
    if (item.type === 'github') return userProfile.githubProofsCount || 11;
    return userProfile.completedDaysCount || 11; // default days
  };

  return (
    <div className="abtalks-reference-achievements-container">
      <div className="achievements-reference-header">
        <div className="header-title-box">
          <FaShieldAlt className="header-shield-icon" />
          <div>
            <h3>Achievements</h3>
            <span className="header-subtext">Sequential Milestone Unlocks</span>
          </div>
        </div>

        <div className="header-unlocked-badge">
          <FaAward />
          <span>{unlockedCount} / {achievementsList.length} Unlocked</span>
        </div>
      </div>

      {/* 2-COLUMN GRID REFERENCE IMAGE DESIGN */}
      <div className="achievements-reference-grid">
        {achievementsList.map((item) => {
          const progressVal = getProgressVal(item);
          const target = item.target || 15;
          const ratioPct = Math.min(100, Math.round((progressVal / target) * 100));

          return (
            <motion.div
              key={item.id}
              className={`reference-achievement-card ${item.unlocked ? 'unlocked' : 'locked'}`}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedAchievement(item)}
            >
              {/* CIRCULAR ARC RING FRAME (REFERENCE DESIGN) */}
              <div className="arc-ring-container">
                <svg className="arc-ring-svg" viewBox="0 0 120 120">
                  {/* Background Arc */}
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    className="arc-bg-circle"
                    strokeWidth="10"
                  />
                  {/* Foreground Progress Arc */}
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    className={`arc-progress-circle ${item.unlocked ? 'unlocked' : ''}`}
                    strokeWidth="10"
                    strokeDasharray="314"
                    strokeDashoffset={314 - (314 * (item.unlocked ? 100 : ratioPct)) / 100}
                  />
                </svg>

                <div className="arc-badge-center-orb">
                  <span className="badge-emoji-icon">{item.icon}</span>
                  {!item.unlocked && (
                    <div className="badge-lock-overlay">
                      <FaLock />
                    </div>
                  )}
                </div>
              </div>

              {/* CARD METRICS & ACTION BUTTONS */}
              <h4 className="ref-card-title">{item.title}</h4>

              <span className="ref-card-progress-ratio">
                {Math.min(target, progressVal)}/{target} Completed
              </span>

              <span className="ref-card-pts-pill">{item.points} PTS</span>

              {/* BOTTOM CLAIM / DOWNLOAD BUTTON */}
              {!item.unlocked ? (
                <button className="btn-ref-action locked" disabled>
                  Claim
                </button>
              ) : item.claimed ? (
                <button 
                  className="btn-ref-action download" 
                  onClick={(e) => downloadBadgeImage(item, e)}
                >
                  <FaDownload /> Download Badge
                </button>
              ) : (
                <button 
                  className="btn-ref-action claim" 
                  onClick={(e) => handleClaimBadge(item, e)}
                >
                  Claim Badge 🎁
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* DETAIL MODAL SHOWCASE */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div 
            className="ref-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div 
              className={`ref-modal-card ${selectedAchievement.unlocked ? 'unlocked' : 'locked'}`}
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="ref-modal-close" onClick={() => setSelectedAchievement(null)}>
                <FaTimes />
              </button>

              <div className="ref-modal-hero-orb">
                <span className="hero-emoji">{selectedAchievement.icon}</span>
                {!selectedAchievement.unlocked && <FaLock className="modal-lock-badge" />}
              </div>

              <span className="ref-modal-pts-tag">{selectedAchievement.points} PTS REWARD</span>

              <h3 className="ref-modal-title">{selectedAchievement.title}</h3>
              <p className="ref-modal-desc">{selectedAchievement.desc}</p>

              {selectedAchievement.unlocked ? (
                <div className="ref-modal-actions">
                  {!selectedAchievement.claimed && (
                    <button 
                      className="btn-modal-claim-primary"
                      onClick={(e) => handleClaimBadge(selectedAchievement, e)}
                    >
                      Claim {selectedAchievement.points} PTS Badge 🎁
                    </button>
                  )}

                  <button 
                    className="btn-modal-download-primary"
                    onClick={(e) => downloadBadgeImage(selectedAchievement, e)}
                  >
                    <FaDownload /> Download Badge Certificate (.PNG) 📥
                  </button>
                </div>
              ) : (
                <div className="ref-modal-locked-banner">
                  <FaLock />
                  <span>
                    Locked — Requires {selectedAchievement.target} Completed Level Builds to Unlock
                  </span>
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
