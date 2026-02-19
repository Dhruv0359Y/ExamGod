import React from "react";

export default function Navbar({ onBack, showBack }) {
  return (
    <nav className="navbar">
      <div className="nav-inner">
        <a href="/" className="logo-group">
          <div className="logo-box">E</div>
          <span className="logo-text">
            Exam<span className="logo-accent">God</span>
          </span>
        </a>

        <div className="nav-links">
          <a href="#" className="nav-link">
            Home
          </a>
          <a href="#" className="nav-link">
            Generate Paper
          </a>
          <a href="#" className="nav-link">
            AI Explain
          </a>
          <a href="#" className="nav-link">
            Analysis
          </a>
          {showBack && (
            <button onClick={onBack} className="btn-back">
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
