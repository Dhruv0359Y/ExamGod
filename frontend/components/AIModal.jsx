// src/components/AIModal.jsx
import React from "react";

const AIModal = ({ isOpen, title, content, isLoading, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>
        <div
          className="modal-body"
          style={{
            whiteSpace: "pre-wrap",
            lineHeight: "1.8",
            fontSize: "15px",
          }}
        >
          {isLoading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <div
                className="loader"
                style={{
                  border: "4px solid #f3f3f3",
                  borderTop: "4px solid #2563eb",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  animation: "spin 1s linear infinite",
                  margin: "0 auto 20px",
                }}
              />
              <p>Analyzing with AI...</p>
            </div>
          ) : (
            <div
              dangerouslySetInnerHTML={{
                __html: content
                  .replace(/\n/g, "<br/>")
                  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AIModal;
