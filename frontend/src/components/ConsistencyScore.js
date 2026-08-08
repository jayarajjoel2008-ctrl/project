import React from 'react';
import ProgressRing from './ProgressRing';
import './ConsistencyScore.css';

const ConsistencyScore = ({ score = 86, breakdown }) => {
  const metrics = [
    { label: 'Daily builds', value: breakdown?.dailyBuilds || 92, color: '#6c5ce7' },
    { label: 'GitHub proof', value: breakdown?.githubProof || 88, color: '#10b981' },
    { label: 'LinkedIn proof', value: breakdown?.linkedinProof || 79, color: '#06b6d4' },
    { label: 'Challenge completion', value: breakdown?.challengeCompletion || 90, color: '#f59e0b' }
  ];

  return (
    <div className="abtalks-consistency-card">
      <div className="consistency-header">
        <div>
          <span className="consistency-tag">METRIC ANALYSIS</span>
          <h3>Consistency Score</h3>
        </div>

        <div className="score-ring-wrapper">
          <ProgressRing progress={score} size={68} strokeWidth={6} color="#6c5ce7" />
          <div className="ring-center-text">
            <span className="score-big">{score}</span>
            <span className="score-denom">/100</span>
          </div>
        </div>
      </div>

      <div className="breakdown-list">
        {metrics.map((m, idx) => (
          <div key={idx} className="metric-row">
            <div className="metric-label-row">
              <span className="m-label">{m.label}</span>
              <span className="m-val">{m.value}%</span>
            </div>
            <div className="metric-bar-bg">
              <div 
                className="metric-bar-fill" 
                style={{ width: `${m.value}%`, backgroundColor: m.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConsistencyScore;
