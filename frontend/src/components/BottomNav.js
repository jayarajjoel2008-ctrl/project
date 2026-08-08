import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaTachometerAlt, FaRocket } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './BottomNav.css';

const BottomNav = () => {
  const location = useLocation();
  const path = location.pathname;

  const items = [
    { path: '/', label: 'Home', icon: <FaHome /> },
    { path: '/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/day/12', label: 'Challenge', icon: <FaRocket /> }
  ];

  return (
    <nav className="mobile-bottom-nav">
      <div className="bottom-nav-container">
        {items.map((item) => {
          const isActive = path === item.path || (item.path === '/day/12' && path.startsWith('/day'));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavGlow"
                  className="active-nav-glow"
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                />
              )}
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
