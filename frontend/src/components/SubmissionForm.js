import React, { useState } from 'react';
import { FaGithub, FaLinkedin, FaExclamationCircle, FaSpinner } from 'react-icons/fa';
import './SubmissionForm.css';

const SubmissionForm = ({ onSubmitSuccess, initialRepo = '', initialCommit = '', initialLinkedin = '' }) => {
  const [githubRepo, setGithubRepo] = useState(initialRepo);
  const [githubCommit, setGithubCommit] = useState(initialCommit);
  const [linkedinUrl, setLinkedinUrl] = useState(initialLinkedin);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isGithubRepoValid = githubRepo.includes('github.com');
  const isLinkedinValid = linkedinUrl.includes('linkedin.com');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isGithubRepoValid) {
      setErrorMsg('Please enter a valid GitHub repository URL (e.g. https://github.com/user/repo)');
      return;
    }
    if (!isLinkedinValid) {
      setErrorMsg('Please enter a valid LinkedIn post URL (e.g. https://linkedin.com/posts/user-build)');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (onSubmitSuccess) {
        onSubmitSuccess({
          githubRepo,
          githubCommit: githubCommit || githubRepo,
          linkedinUrl
        });
      }
    }, 1500);
  };

  return (
    <form className="abtalks-submission-form" onSubmit={handleSubmit}>
      <div className="form-section-title">
        <h3>Submit Proof of Work</h3>
        <p>Your submissions verify your 60-day public builder journey</p>
      </div>

      {errorMsg && (
        <div className="form-error-banner">
          <FaExclamationCircle /> {errorMsg}
        </div>
      )}

      {/* GITHUB PROOF */}
      <div className="form-group">
        <label>
          <FaGithub /> GitHub Repository URL
        </label>
        <input
          type="text"
          placeholder="https://github.com/username/project-repo"
          value={githubRepo}
          onChange={(e) => setGithubRepo(e.target.value)}
        />
        {githubRepo && (
          <span className={`validation-hint ${isGithubRepoValid ? 'valid' : 'invalid'}`}>
            {isGithubRepoValid ? '✓ GitHub link looks good' : 'Please enter a valid GitHub URL'}
          </span>
        )}
      </div>

      <div className="form-group">
        <label>
          <FaGithub /> GitHub Commit URL (Optional)
        </label>
        <input
          type="text"
          placeholder="https://github.com/username/project-repo/commit/hash"
          value={githubCommit}
          onChange={(e) => setGithubCommit(e.target.value)}
        />
      </div>

      {/* LINKEDIN PROOF */}
      <div className="form-group">
        <label>
          <FaLinkedin /> LinkedIn Post URL
        </label>
        <input
          type="text"
          placeholder="https://linkedin.com/posts/username-day12-build"
          value={linkedinUrl}
          onChange={(e) => setLinkedinUrl(e.target.value)}
        />
        {linkedinUrl && (
          <span className={`validation-hint ${isLinkedinValid ? 'valid' : 'invalid'}`}>
            {isLinkedinValid ? '✓ LinkedIn post added' : 'Please enter a valid LinkedIn URL'}
          </span>
        )}
      </div>

      {/* SUBMIT BUTTON */}
      <button type="submit" className="btn-submit-proof" disabled={loading}>
        {loading ? (
          <>
            <FaSpinner className="spinner-icon" /> Verifying your proof...
          </>
        ) : (
          'Submit Today\'s Proof →'
        )}
      </button>
    </form>
  );
};

export default SubmissionForm;
