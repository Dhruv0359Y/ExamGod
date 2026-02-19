
import React from 'react';

export default function SelectionCard({ title, subtitle, icon, selected, onClick }) {
  return (
    <div className={`card ${selected ? 'selected' : ''}`} onClick={onClick}>
      <div className="card-icon">{icon}</div>
      <div className="card-title">{title}</div>
      {subtitle && <div className="card-subtitle">{subtitle}</div>}
      {selected && (
        <div style={{ position: 'absolute', top: '16px', right: '16px', color: '#2563eb' }}>
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
}
