import React from 'react';
import { Link } from 'react-router-dom';
import { FaSun, FaMoon, FaUserCircle } from 'react-icons/fa';
import './Navbar.css';

const Navbar = ({ theme, toggleTheme }) => {
  return (
    <header className="abtalks-top-nav">
      <div className="nav-wrapper">
        <Link to="/" className="nav-logo">
          <span className="logo-spark">🎙️</span>
          <span className="logo-text">ABTALKS <span className="logo-v2">2.0</span></span>
        </Link>

        <div className="nav-right-actions">
          <Link to="/dashboard" className="nav-profile-pill" title="Profile">
            <FaUserCircle className="user-icon" />
            <span className="profile-text">Joel</span>
          </Link>

          {toggleTheme && (
            <button className="theme-toggle-nav-btn" onClick={toggleTheme} title="Toggle Theme">
              {theme === 'dark' ? <FaSun className="icon-sun" /> : <FaMoon className="icon-moon" />}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
