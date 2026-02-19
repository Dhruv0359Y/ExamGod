import React from "react";

export default function Me({ onBack, showBack }) {
  return (
    <nav className="navbar">
      <div className="nav-inner">
        <a href="/" className="logo-group">
          <div className="logo-box">Made With</div>
          <span className="logo-text">
            Exam<span className="logo-accent">Hearts</span>
          </span>
        </a>
      </div>
    </nav>
  );
}
