import React, { useState } from 'react';
import { FaGithub, FaLinkedin, FaExclamationCircle, FaSpinner, FaEdit } from 'react-icons/fa';
import './SubmissionForm.css';

const SubmissionForm = ({ onSubmitSuccess, initialRepo = '', initialCommit = '', initialLinkedin = '', initialDescription = '' }) => {
  const [githubRepo, setGithubRepo] = useState(initialRepo);
  const [githubCommit, setGithubCommit] = useState(initialCommit);
  const [linkedinUrl, setLinkedinUrl] = useState(initialLinkedin);
  const [projectDescription, setProjectDescription] = useState(initialDescription);

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
          linkedinUrl,
          projectDescription
        });
      }
    }, 1200);
  };

  return (
    <form className="abtalks-submission-form" onSubmit={handleSubmit}>
      <div className="form-section-title">
        <h3>Submit Proof of Work</h3>
        <p>Verify your build and describe what you created today</p>
      </div>

      {errorMsg && (
        <div className="form-error-banner">
          <FaExclamationCircle /> {errorMsg}
        </div>
      )}

      {/* ABOUT YOUR PROJECT DESCRIPTION SPACE */}
      <div className="form-group">
        <label>
          <FaEdit /> About Your Project (Project Description)
        </label>
        <textarea
          rows={4}
          className="form-project-textarea"
          placeholder="Describe your project, key features, tech stack used, challenges solved, and what you built today..."
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
        />
        <span className="form-input-help">
          Write a brief summary about your project to showcase in your Proof Vault.
        </span>
      </div>

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
