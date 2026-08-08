import React, { useState, useEffect } from 'react';
import { fetchChallengeWithFallback, submitChallenge } from '../api/api';
import './ChallengeDay.css';

function ChallengeDay({ day, user, onBack }) {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const track = user?.track || 'Full Stack Development';
  const isAlreadySubmitted = user?.submissions?.includes(day);

  useEffect(() => {
    const loadChallenge = async () => {
      setLoading(true);
      try {
        const data = await fetchChallengeWithFallback(track, day);
        setChallenge(data);
      } catch (err) {
        console.error('Failed to load day challenge:', err);
      } finally {
        setLoading(false);
      }
    };

    loadChallenge();
  }, [track, day]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!githubUrl || !linkedinUrl) {
      setError('Please provide both GitHub and LinkedIn URLs');
      return;
    }

    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const response = await submitChallenge({
        userId: user?.id || 'user_1',
        day: day,
        githubUrl: githubUrl,
        linkedinUrl: linkedinUrl,
      });

      if (response.data?.success) {
        setMessage('🎉 Challenge submitted successfully! Streak updated.');
      } else {
        setError(response.data?.error || 'Submission failed.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.response?.data?.error || 'Failed to submit proof. Is the backend server running?');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="challenge-loading">
        <div className="loading-spinner"></div>
        <p>Loading Day {day} Challenge...</p>
      </div>
    );
  }

  return (
    <div className="challenge-page">
      <button className="back-btn" onClick={onBack}>
        ← Back to Dashboard
      </button>

      <div className="challenge-detail-card">
        <div className="challenge-header-meta">
          <span className="day-badge">Day {day}</span>
          <span className={`status-pill ${isAlreadySubmitted ? 'completed' : 'pending'}`}>
            {isAlreadySubmitted ? 'Completed ✓' : 'Pending'}
          </span>
        </div>

        <h1 className="challenge-main-title">{challenge?.title || `Day ${day} Challenge`}</h1>
        <p className="challenge-description">{challenge?.description}</p>

        {challenge?.requirements && challenge.requirements.length > 0 && (
          <div className="challenge-section">
            <h3>Requirements</h3>
            <ul className="requirements-list">
              {challenge.requirements.map((req, idx) => (
                <li key={idx}>✓ {req}</li>
              ))}
            </ul>
          </div>
        )}

        {challenge?.resources && challenge.resources.length > 0 && (
          <div className="challenge-section">
            <h3>Learning Resources</h3>
            <div className="resources-list">
              {challenge.resources.map((res, idx) => (
                <a 
                  key={idx} 
                  href={typeof res === 'string' ? res : res.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="resource-item"
                >
                  🔗 {typeof res === 'string' ? res : res.title || res.url}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="submission-box">
          <h3>Submit Proof of Work</h3>
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-error">{error}</div>}

          {isAlreadySubmitted ? (
            <div className="alert alert-info">
              ✅ You have already completed this day challenge!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="submission-form">
              <div className="form-group">
                <label>GitHub Commit / Repository URL *</label>
                <input 
                  type="url" 
                  required 
                  placeholder="https://github.com/username/repository"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>LinkedIn Post URL *</label>
                <input 
                  type="url" 
                  required 
                  placeholder="https://linkedin.com/posts/username_challenge"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                />
              </div>

              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? 'Submitting...' : '🚀 Submit & Keep Streak'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChallengeDay;
