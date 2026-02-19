// src/components/ExamPaperPreview.jsx
import React from "react";
import "./ExamPaper.css";

const ExamPaperPreview = ({ paper, onPrint }) => {
  if (!paper) return null;

  const { meta, sections, stats } = paper;

  // Format subject name
  const formatSubject = (subject) => {
    if (!subject) return "";
    if (subject.includes("_")) {
      const parts = subject.split("_");
      return parts[1]?.charAt(0).toUpperCase() + parts[1]?.slice(1) || subject;
    }
    return subject;
  };

  // Get current date
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="exam-paper-container">
      {/* Header */}
      <div className="exam-header">
        <div className="school-name">Central Board of Secondary Education</div>
        <div className="exam-title">Sample Question Paper</div>
        <div className="subject-code">
          {formatSubject(meta.subject)} (Code: {meta.qpCode || "EG-001"})
        </div>
      </div>

      {/* Meta Information */}
      <div className="exam-meta">
        <div>Class: {meta.class}</div>
        <div>Time Allowed: {meta.timeAllowed || "3 Hours"}</div>
        <div>Maximum Marks: {meta.maximumMarks}</div>
        <div>Date: {formattedDate}</div>
      </div>

      {/* General Instructions */}
      <div className="instructions-section">
        <div className="instructions-title">General Instructions:</div>
        <ol className="instructions-list">
          <li>
            This question paper contains {meta.totalQuestions} questions. All
            questions are compulsory.
          </li>
          <li>
            Question paper is divided into FIVE sections - Section A, B, C, D
            and E.
          </li>
          <li>
            Section A consists of multiple choice questions of 1 mark each.
          </li>
          <li>
            Section B consists of very short answer questions of 2 marks each.
          </li>
          <li>Section C consists of short answer questions of 3 marks each.</li>
          <li>
            Section D consists of case study based questions of 4 marks each.
          </li>
          <li>Section E consists of long answer questions of 5 marks each.</li>
          <li>Internal choice is available in some sections.</li>
          <li>
            There is no overall choice. However, internal choice has been
            provided.
          </li>
          <li>Use of calculators is not permitted.</li>
        </ol>
      </div>

      {/* Sections */}
      {sections.map((section, sectionIdx) => (
        <div key={sectionIdx} className="section">
          <div className="section-header">
            Section {section.section}: {section.type}
          </div>
          <div className="section-subheader">
            ({section.questions.length} questions of {section.marksPerQuestion}{" "}
            mark{section.marksPerQuestion > 1 ? "s" : ""} each)
          </div>

          {/* Questions */}
          {section.questions.map((q, qIdx) => (
            <div key={qIdx} className="question-item">
              <div>
                <span className="question-number">{qIdx + 1}.</span>
                <span className="question-text">{q.questionText}</span>
              </div>

              {/* Question Metadata */}
              <div className="question-meta">
                <span className="marks-badge">
                  {q.marks} Mark{q.marks > 1 ? "s" : ""}
                </span>
                {q.chapter && q.chapter !== "General" && (
                  <span className="source-badge">Chapter: {q.chapter}</span>
                )}
                {q.sourceYear && (
                  <span className="source-badge">Source: {q.sourceYear}</span>
                )}
                {q.probability && (
                  <span className="source-badge">
                    Probability: {q.probability}%
                  </span>
                )}
              </div>

              {/* Internal Choice (randomly add for variety) */}
              {qIdx % 3 === 1 && section.marksPerQuestion >= 3 && (
                <>
                  <div className="or-separator">OR</div>
                  <div className="internal-choice">
                    <span className="question-number">{qIdx + 1}.</span>
                    <span className="question-text">
                      {q.questionText.includes("?")
                        ? q.questionText.replace("?", " (Alternative Version)?")
                        : `${q.questionText} (Alternative)`}
                    </span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ))}

      {/* Case Study Section (if not already included) */}
      {!sections.some((s) => s.type.includes("Case Study")) && (
        <div className="section">
          <div className="section-header">
            Section D: Case Study Based Questions
          </div>
          <div className="case-study">
            <div className="case-study-title">
              Case Study: Real Life Application
            </div>
            <div className="case-study-questions">
              <div className="question-item">
                <span className="question-number">36.</span>
                <span className="question-text">
                  Read the following passage and answer the questions that
                  follow:
                </span>
                <div style={{ margin: "15px 0", fontStyle: "italic" }}>
                  "A mathematics teacher of class 10 planned a case study based
                  on real-life applications..."
                </div>
                <div style={{ marginLeft: "20px" }}>
                  <div>
                    <strong>(i)</strong> Based on the given information, answer
                    part (i)
                  </div>
                  <div>
                    <strong>(ii)</strong> Based on the given information, answer
                    part (ii)
                  </div>
                  <div>
                    <strong>(iii)</strong> Based on the given information,
                    answer part (iii)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="exam-footer">
        <div className="footer-note">✽✽✽✽✽ All the Best ✽✽✽✽✽</div>
        <div style={{ marginTop: "15px" }}>
          Generated by ExamGod AI - Based on 10 Years Analysis
        </div>
        {stats && (
          <div
            style={{ fontSize: "12px", marginTop: "10px", color: "#9ca3af" }}
          >
            Coverage: {stats.coverage} | Questions:{" "}
            {sections.reduce((sum, s) => sum + s.questions.length, 0)}/
            {meta.totalQuestions}
          </div>
        )}
      </div>

      {/* Print Button */}
      <div
        style={{ textAlign: "center", marginTop: "30px" }}
        className="no-print"
      >
        <button
          onClick={onPrint}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "12px 30px",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          🖨️ Print / Download PDF
        </button>
      </div>
    </div>
  );
};

export default ExamPaperPreview;
