import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaChevronUp, FaChevronDown, FaLightbulb, FaBook, FaPuzzlePiece, FaCheckDouble } from 'react-icons/fa';
import { MOCK_BUILD_BUDDY_RESPONSES } from '../data/mockData';
import './BuildBuddy.css';

const BuildBuddy = ({ isEmbedded = false }) => {
  const [isOpen, setIsOpen] = useState(isEmbedded);
  const [activeResponse, setActiveResponse] = useState(
    "👋 **Hi Arvind!** I'm Build Buddy, your AI coding mentor for Day 12. Tap any button below to get hints or debug guidance!"
  );

  const handleOptionClick = (type) => {
    switch (type) {
      case 'hint':
        setActiveResponse(MOCK_BUILD_BUDDY_RESPONSES.hint);
        break;
      case 'explain':
        setActiveResponse(MOCK_BUILD_BUDDY_RESPONSES.explain);
        break;
      case 'breakdown':
        setActiveResponse(MOCK_BUILD_BUDDY_RESPONSES.breakdown);
        break;
      case 'review':
        setActiveResponse(MOCK_BUILD_BUDDY_RESPONSES.review);
        break;
      default:
        break;
    }
  };

  return (
    <div className={`build-buddy-container ${isEmbedded ? 'embedded' : 'floating'}`}>
      {!isEmbedded && (
        <button className="build-buddy-trigger-bar" onClick={() => setIsOpen(!isOpen)}>
          <div className="trigger-left">
            <span className="bot-avatar font-icon"><FaRobot /></span>
            <span className="trigger-text">🤖 Build Buddy AI</span>
          </div>
          {isOpen ? <FaChevronDown /> : <FaChevronUp />}
        </button>
      )}

      <AnimatePresence>
        {(isOpen || isEmbedded) && (
          <motion.div
            className="build-buddy-sheet"
            initial={isEmbedded ? {} : { y: 100, opacity: 0 }}
            animate={isEmbedded ? {} : { y: 0, opacity: 1 }}
            exit={isEmbedded ? {} : { y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 22 }}
          >
            <div className="sheet-header">
              <div className="bot-info">
                <span className="bot-avatar font-icon"><FaRobot /></span>
                <div>
                  <h4>BUILD BUDDY AI</h4>
                  <span className="bot-status">🟢 Active Assistant</span>
                </div>
              </div>
            </div>

            <div className="sheet-response-box">
              <p>{activeResponse}</p>
            </div>

            <div className="sheet-action-options">
              <button className="option-btn" onClick={() => handleOptionClick('hint')}>
                <FaLightbulb /> Give me a hint
              </button>
              <button className="option-btn" onClick={() => handleOptionClick('explain')}>
                <FaBook /> Explain requirement
              </button>
              <button className="option-btn" onClick={() => handleOptionClick('breakdown')}>
                <FaPuzzlePiece /> Help break this down
              </button>
              <button className="option-btn" onClick={() => handleOptionClick('review')}>
                <FaCheckDouble /> Review my approach
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BuildBuddy;
