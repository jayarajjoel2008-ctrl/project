import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaChartLine, FaCode } from 'react-icons/fa';

import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import BuildBuddy from '../components/BuildBuddy';
import ProofVault from '../components/ProofVault';
import StreakRescue from '../components/StreakRescue';
import BuilderStory from '../components/BuilderStory';
import FAQ from '../components/FAQ';
import { CHALLENGES, INITIAL_USER_PROFILE } from '../data/mockData';

import './LandingPage.css';

const LandingPage = ({ theme, toggleTheme }) => {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="abtalks-v2-landing app-container">
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <main className="landing-main-content">
        {/* ── SECTION 1: HERO ── */}
        <section className="landing-hero-section">
          <div className="hero-container-390">
            <motion.div 
              className="hero-trust-badge"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              🚀 60-DAY CODING CHALLENGE FOR COLLEGE STUDENTS
            </motion.div>

            <motion.h1 
              className="hero-title-v2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              60 Days. 60 Builds.<br />
              <span className="hero-gradient-text">One Better You.</span>
            </motion.h1>

            <motion.p 
              className="hero-supporting-text"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Build consistently. Prove your work publicly. Turn 60 days of coding into a portfolio recruiters can see.
            </motion.p>

            <motion.div 
              className="hero-cta-group"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <button className="btn-hero-primary-v2" onClick={() => navigate('/dashboard')}>
                Start My 60-Day Journey →
              </button>

              <button className="btn-hero-secondary-v2" onClick={() => scrollToSection('how-it-works')}>
                See How It Works
              </button>
            </motion.div>

            {/* TRUST INDICATORS */}
            <div className="trust-indicators-row">
              <span className="trust-pill">⏱️ 10–30 min/day</span>
              <span className="trust-pill">💻 GitHub + LinkedIn proof</span>
              <span className="trust-pill">🎓 Built for college students</span>
            </div>

            {/* ANIMATED 60-DAY PROGRESS VISUALIZATION */}
            <div className="hero-progress-visualizer">
              <div className="vis-header">
                <span>PUBLIC BUILDER JOURNEY</span>
                <span className="vis-count">47 / 60 BUILDS COMPLETE</span>
              </div>
              <div className="vis-bar-container">
                <motion.div 
                  className="vis-bar-fill"
                  initial={{ width: '0%' }}
                  animate={{ width: '78%' }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: WHAT IS ABTALKS 2.0? ── */}
        <section className="landing-section" id="about">
          <div className="section-header-390">
            <span className="eyebrow">WHAT IS ABTALKS 2.0?</span>
            <h2>Turn Daily Practice Into Visible Proof</h2>
            <p>ABTalks 2.0 turns daily coding practice into visible proof of your growth.</p>
          </div>

          <div className="grid-3-cards">
            <motion.div 
              className="v2-card"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="v2-card-icon violet"><FaCode /></div>
              <h3>BUILD</h3>
              <p>Build something real every day with curated 15-30 minute challenges.</p>
            </motion.div>

            <motion.div 
              className="v2-card"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="v2-card-icon green"><FaShieldAlt /></div>
              <h3>PROVE</h3>
              <p>Submit your GitHub repository commit and LinkedIn proof daily.</p>
            </motion.div>

            <motion.div 
              className="v2-card"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="v2-card-icon cyan"><FaChartLine /></div>
              <h3>GROW</h3>
              <p>Track your skills, consistency score, and public builder profile.</p>
            </motion.div>
          </div>
        </section>

        {/* ── SECTION 3: WHY 60 DAYS? ── */}
        <section className="landing-section" id="why-60">
          <div className="section-header-390">
            <span className="eyebrow">THE TIMELINE</span>
            <h2>Why 60 Days?</h2>
            <p>A structured transformation from student to portfolio-ready builder.</p>
          </div>

          <div className="timeline-v2-container">
            <div className="timeline-node">
              <span className="node-day">DAY 01</span>
              <h4>Start</h4>
              <p>Set up your environment & make your first commit.</p>
            </div>

            <div className="timeline-node">
              <span className="node-day">DAY 15</span>
              <h4>Build Consistency</h4>
              <p>The daily habit takes root. Code feels natural.</p>
            </div>

            <div className="timeline-node">
              <span className="node-day">DAY 30</span>
              <h4>Build Confidence</h4>
              <p>Solve intermediate problems and handle real APIs.</p>
            </div>

            <div className="timeline-node">
              <span className="node-day">DAY 45</span>
              <h4>Build Visibility</h4>
              <p>Recruiters take notice of your public streak.</p>
            </div>

            <div className="timeline-node final">
              <span className="node-day">DAY 60</span>
              <h4>Build Your Story</h4>
              <p>Graduate with a portfolio of 60 public projects.</p>
            </div>
          </div>
        </section>

        {/* ── SECTION 4: HOW IT WORKS ── */}
        <section className="landing-section" id="how-it-works">
          <div className="section-header-390">
            <span className="eyebrow">PROCESS</span>
            <h2>How It Works</h2>
          </div>

          <div className="grid-4-steps">
            <div className="step-v2-box">
              <span className="step-v2-num">01</span>
              <h4>Choose Your Track</h4>
              <p>Select Full Stack, Data Science, DevOps, or Mobile.</p>
            </div>

            <div className="step-v2-box">
              <span className="step-v2-num">02</span>
              <h4>Build Today's Challenge</h4>
              <p>Solve today's 15-30 minute real-world problem.</p>
            </div>

            <div className="step-v2-box">
              <span className="step-v2-num">03</span>
              <h4>Submit Proof</h4>
              <p>Paste your GitHub commit & LinkedIn post link.</p>
            </div>

            <div className="step-v2-box">
              <span className="step-v2-num">04</span>
              <h4>Grow Builder Profile</h4>
              <p>Watch your public score and streak flourish.</p>
            </div>
          </div>
        </section>

        {/* ── SECTION 5: AI-POWERED BUILDING (BUILD BUDDY PREVIEW) ── */}
        <section className="landing-section" id="build-buddy-section">
          <div className="section-header-390">
            <span className="eyebrow">AI MENTORSHIP</span>
            <h2>AI-Powered Building with Build Buddy</h2>
            <p>Get instant hints, requirement breakdowns, and code reviews without getting stuck.</p>
          </div>

          <div className="buddy-preview-wrapper">
            <BuildBuddy isEmbedded={true} />
          </div>
        </section>

        {/* ── SECTION 6: PROOF OF WORK VAULT ── */}
        <section className="landing-section" id="vault-section">
          <div className="section-header-390">
            <span className="eyebrow">SIGNATURE FEATURE</span>
            <h2>Proof of Work Vault</h2>
            <p>Your 60 days don't disappear after the challenge. They become your public builder story.</p>
          </div>

          <ProofVault challenges={CHALLENGES} limit={12} showHeader={false} />

          <div className="center-cta-box">
            <button className="btn-vault-action" onClick={() => navigate('/dashboard')}>
              See My Builder Story →
            </button>
          </div>
        </section>

        {/* ── SECTION 7: STREAK RESCUE ── */}
        <section className="landing-section" id="streak-rescue-section">
          <div className="section-header-390">
            <span className="eyebrow">RECOVERY PATH</span>
            <h2>Missed a day? Don't lose your journey.</h2>
            <p>College gets busy. ABTALKS 2.0 gives you a recovery path instead of simply resetting your motivation.</p>
          </div>

          <StreakRescue missedDay={11} isRescued={false} onRescue={() => alert("Streak rescued!")} />
        </section>

        {/* ── SECTION 8: BUILDER STORY ── */}
        <section className="landing-section" id="builder-story-section">
          <div className="section-header-390">
            <span className="eyebrow">PROFILE PREVIEW</span>
            <h2>Your Public Builder Story</h2>
          </div>

          <BuilderStory profile={INITIAL_USER_PROFILE} onActionClick={() => navigate('/dashboard')} />
        </section>

        {/* ── SECTION 9: FAQ ── */}
        <section className="landing-section" id="faq-section">
          <div className="section-header-390">
            <span className="eyebrow">QUESTIONS?</span>
            <h2>Frequently Asked Questions</h2>
          </div>

          <FAQ />
        </section>

        {/* ── SECTION 10: FINAL CTA ── */}
        <section className="final-cta-section">
          <div className="final-cta-box">
            <h2>Your first build starts today.</h2>
            <p>60 days from now, you'll have more than completed challenges. You'll have proof of what you can build.</p>
            
            <button className="btn-hero-primary-v2" onClick={() => navigate('/dashboard')}>
              Start My 60-Day Journey →
            </button>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default LandingPage;
