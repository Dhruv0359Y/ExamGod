import React, { useState } from "react";
import Navbar from "./components/Navbar";
import StepIndicator from "./components/StepIndicator";
import SelectionCard from "./components/SelectionCard";
import ExamPaperPreview from "./components/ExamPaperPreview";
import AIModal from "./components/AIModal";
import QuestionSelector from "./components/QuestionSelector";
import { SUBJECTS } from "./constants";
import "./App.css";

// Backend API URL
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function App() {
  const [step, setStep] = useState(1);
  const [classLevel, setClassLevel] = useState(null);
  const [stream, setStream] = useState(null);
  const [subject, setSubject] = useState(null);
  const [level, setLevel] = useState(null);
  const [showPaper, setShowPaper] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPaper, setGeneratedPaper] = useState(null);
  const [showQuestionSelector, setShowQuestionSelector] = useState(false);

  const [aiModal, setAiModal] = useState({
    isOpen: false,
    title: "",
    content: "",
    isLoading: false,
  });

  const handleBack = () => {
    if (showPaper) {
      setShowPaper(false);
      return;
    }
    if (step === 3 && classLevel === "10") {
      setStep(1);
      return;
    }
    if (step > 1) setStep(step - 1);
  };

  const handleClassSelect = (val) => {
    setClassLevel(val);
    setStream(null);
    setSubject(null);
    setLevel(null);
    val === "10" ? setStep(3) : setStep(2);
  };

  const handleStreamSelect = (val) => {
    setStream(val);
    setSubject(null);
    setStep(3);
  };

  const handleSubjectSelect = (val) => {
    setSubject(val);
    setStep(4);
  };

  const fetchImportantTopics = async () => {
    if (!subject) {
      alert("Please select a subject first");
      return;
    }

    setAiModal({
      isOpen: true,
      title: `Important Topics: ${subject.name}`,
      isLoading: true,
      content: "",
    });

    try {
      const mode = level === "Pass" ? "PASS" : "AVG";

      const response = await fetch(`${API_BASE_URL}/topics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: subject.id,
          mode: mode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch topics");
      }

      const data = await response.json();

      let formattedContent =
        "📊 **High-Probability Topics Based on 10-Year Analysis:**\n\n";

      if (data.highProbabilityTopics && data.highProbabilityTopics.length > 0) {
        data.highProbabilityTopics.forEach((topic, index) => {
          formattedContent += `**${index + 1}. ${topic.name}**\n`;
          formattedContent += `   📍 Chapter: ${topic.chapter}\n`;
          formattedContent += `   🎯 Probability: ${topic.probability}%\n`;
          formattedContent += `   📊 Appeared: ${topic.appearedCount} times\n`;
          if (topic.recentYears && topic.recentYears.length > 0) {
            formattedContent += `   📅 Recent years: ${topic.recentYears.join(", ")}\n`;
          }
          formattedContent += `\n`;
        });
      } else {
        formattedContent =
          "No high-probability topics found for this subject and level.";
      }

      setAiModal((prev) => ({
        ...prev,
        content: formattedContent,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error fetching topics:", error);
      setAiModal((prev) => ({
        ...prev,
        content: `❌ Error: ${error.message}`,
        isLoading: false,
      }));
    }
  };

  const fetchAIExplanation = () => {
    if (!subject) {
      alert("Please select a subject first");
      return;
    }
    setShowQuestionSelector(true);
  };

  const getExplanationForQuestion = async (questionText, marks) => {
    setShowQuestionSelector(false);

    setAiModal({
      isOpen: true,
      title: `AI Explanation: ${subject.name}`,
      isLoading: true,
      content: "",
    });

    try {
      const response = await fetch(`${API_BASE_URL}/explanation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: subject.id,
          questionText: questionText,
          marks: marks,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch explanation");
      }

      const data = await response.json();

      const formattedContent = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 **FAMILIAR EXPLANATION:**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.familiarExplanation}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 **EXAM STANDARD ANSWER:**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.examStandardExplanation}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Question: ${data.questionText}
📊 Marks: ${data.marks}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `;

      setAiModal((prev) => ({
        ...prev,
        content: formattedContent,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error fetching explanation:", error);
      setAiModal((prev) => ({
        ...prev,
        content: `❌ Error: ${error.message}`,
        isLoading: false,
      }));
    }
  };

  const generatePaper = async () => {
    if (!subject) {
      alert("Please select a subject first");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch(`${API_BASE_URL}/paper`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: subject.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate paper");
      }

      const data = await response.json();
      setGeneratedPaper(data);
      setShowPaper(true);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Error generating paper:", error);
      alert(`Failed to generate paper: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderStepContent = () => {
    if (step === 1)
      return (
        <div className="selection-grid">
          <SelectionCard
            title="Class 10"
            subtitle="Secondary Exams"
            icon="🎓"
            selected={classLevel === "10"}
            onClick={() => handleClassSelect("10")}
          />
          <SelectionCard
            title="Class 12"
            subtitle="Senior Secondary"
            icon="🏛️"
            selected={classLevel === "12"}
            onClick={() => handleClassSelect("12")}
          />
        </div>
      );

    if (step === 2)
      return (
        <div className="selection-grid">
          <SelectionCard
            title="Science"
            icon="🔬"
            selected={stream === "Science"}
            onClick={() => handleStreamSelect("Science")}
          />
          <SelectionCard
            title="Commerce"
            icon="💰"
            selected={stream === "Commerce"}
            onClick={() => handleStreamSelect("Commerce")}
          />
          <SelectionCard
            title="Arts"
            icon="🎭"
            selected={stream === "Arts"}
            onClick={() => handleStreamSelect("Arts")}
          />
        </div>
      );

    if (step === 3) {
      const list =
        classLevel === "10" ? SUBJECTS["10"] : SUBJECTS[`12-${stream}`];
      return (
        <div className="selection-grid">
          {list?.map((s) => (
            <SelectionCard
              key={s.id}
              title={s.name}
              icon={s.icon}
              selected={subject?.id === s.id}
              onClick={() => handleSubjectSelect(s)}
            />
          ))}
        </div>
      );
    }

    if (step === 4)
      return (
        <div className="animate-in">
          <div
            className="selection-grid"
            style={{ maxWidth: "700px", margin: "0 auto" }}
          >
            <SelectionCard
              title="Pass Level"
              subtitle="Core Basics (75%+ probability)"
              icon="🎯"
              selected={level === "Pass"}
              onClick={() => setLevel("Pass")}
            />
            <SelectionCard
              title="Average Level"
              subtitle="Standard Prep (55%+ probability)"
              icon="📊"
              selected={level === "Average"}
              onClick={() => setLevel("Average")}
            />
          </div>
          <div className="action-group">
            <button
              disabled={!subject || !level}
              onClick={fetchImportantTopics}
              className="btn btn-outline"
            >
              📊 Important Topics
            </button>
            <button
              disabled={!subject || !level}
              onClick={fetchAIExplanation}
              className="btn btn-ai"
            >
              🤖 AI Explain Concepts
            </button>
          </div>
        </div>
      );
  };

  return (
    <div className="app-container">
      <Navbar onBack={handleBack} showBack={step > 1 || showPaper} />

      <main className="main-content">
        {!showPaper ? (
          <>
            <div className="tags-container">
              {classLevel && <span className="tag">Class {classLevel}</span>}
              {stream && <span className="tag">{stream}</span>}
              {subject && <span className="tag">{subject.name}</span>}
            </div>

            <header className="hero-section">
              <h1 className="hero-title font-outfit">
                Prepare Like a <span className="logo-accent">God.</span>
              </h1>
              <p className="hero-subtitle">
                Get data-driven analysis and AI insights for your board exams.
              </p>
            </header>

            <StepIndicator currentStep={step} totalSteps={4} />
            {renderStepContent()}

            {subject && (
              <div style={{ marginTop: "40px", textAlign: "center" }}>
                <button
                  onClick={generatePaper}
                  disabled={isGenerating}
                  className="btn btn-generate"
                  style={{
                    maxWidth: "600px",
                    margin: "0 auto",
                    background: !subject
                      ? "#ccc"
                      : "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
                  }}
                >
                  {isGenerating ? (
                    <>⏳ Analyzing 10-Year Trends...</>
                  ) : (
                    <>
                      📝 Generate 10-Year Analysis Paper{" "}
                      {level ? `(${level} Level)` : ""}
                    </>
                  )}
                </button>
                {!level && subject && (
                  <p
                    style={{
                      marginTop: "12px",
                      color: "#64748b",
                      fontSize: "14px",
                    }}
                  >
                    💡 Select a level above for topic analysis, or generate
                    paper directly
                  </p>
                )}
              </div>
            )}
          </>
        ) : (
          <ExamPaperPreview
            paper={generatedPaper}
            onPrint={() => window.print()}
          />
        )}

        {/* 🎯 STEVE JOBS QUOTE SECTION - Always visible */}
        <div
          style={{
            maxWidth: "800px",
            margin: "60px auto 40px",
            padding: "30px",
            background: "linear-gradient(135deg, #f8fafc 0%, #eef2f6 100%)",
            borderRadius: "20px",
            border: "1px solid #e2e8f0",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative quote marks */}
          <div
            style={{
              position: "absolute",
              top: "-20px",
              left: "20px",
              fontSize: "120px",
              color: "rgba(37, 99, 235, 0.1)",
              fontFamily: "Georgia, serif",
              fontWeight: "bold",
            }}
          >
            "
          </div>

          <div style={{ position: "relative", zIndex: 2 }}>
            <p
              style={{
                fontSize: "24px",
                fontWeight: "500",
                fontStyle: "italic",
                color: "#1e293b",
                lineHeight: "1.6",
                marginBottom: "15px",
                fontFamily: "Georgia, serif",
              }}
            >
              "The only way to do great work is to love what you do."
            </p>
            <p
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#475569",
                textAlign: "right",
                borderBottom: "2px solid #2563eb",
                paddingBottom: "10px",
                display: "inline-block",
                float: "right",
              }}
            >
              — Steve Jobs
            </p>
          </div>
        </div>

        {/* 🚀 CREATOR SECTION WITH SOCIAL LINKS */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "30px",
            marginTop: "40px",
            marginBottom: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            border: "1px solid #e2e8f0",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: "#0f172a",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <span>✨</span> Crafted with Precision by Dhruv
            <span style={{ color: "#2563eb" }}></span> <span>✨</span>
          </h3>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "25px",
              flexWrap: "wrap",
            }}
          >
            {/* Instagram Card */}
            <a
              href="https://instagram.com/dhruv_artist0356y"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 24px",
                background:
                  "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                borderRadius: "50px",
                color: "white",
                textDecoration: "none",
                fontWeight: "600",
                transition: "transform 0.3s, box-shadow 0.3s",
                boxShadow: "0 4px 15px rgba(225, 48, 108, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 25px rgba(225, 48, 108, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 15px rgba(225, 48, 108, 0.3)";
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" />
              </svg>
              <span>@dhruv_artist0356y</span>
            </a>

            {/* GitHub Card */}
            <a
              href="https://github.com/Dhruv0359Y"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 24px",
                background: "#24292e",
                borderRadius: "50px",
                color: "white",
                textDecoration: "none",
                fontWeight: "600",
                transition: "transform 0.3s, box-shadow 0.3s",
                boxShadow: "0 4px 15px rgba(36, 41, 46, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 25px rgba(36, 41, 46, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 15px rgba(36, 41, 46, 0.3)";
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.205 11.387.6.113.82-.26.82-.58 0-.287-.01-1.05-.015-2.06-3.338.726-4.042-1.61-4.042-1.61-.546-1.39-1.335-1.76-1.335-1.76-1.09-.746.082-.73.082-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.776.418-1.306.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.123-.3-.535-1.52.117-3.16 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.29-1.552 3.297-1.23 3.297-1.23.653 1.64.24 2.86.118 3.16.768.84 1.233 1.91 1.233 3.22 0 4.61-2.804 5.62-5.476 5.92.43.37.824 1.102.824 2.22 0 1.602-.015 2.894-.015 3.287 0 .322.216.698.83.578C20.565 21.795 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              <span>@Dhruv0359Y</span>
            </a>
          </div>

          {/* Additional sweet message */}
          <p
            style={{
              marginTop: "25px",
              fontSize: "14px",
              color: "#64748b",
              fontStyle: "italic",
              borderTop: "1px dashed #e2e8f0",
              paddingTop: "20px",
            }}
          >
            ⚡ Building tools to make education smarter, one line of code at a
            time ⚡
          </p>
        </div>

        {/* Floating Creator Badge */}
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(8px)",
            padding: "8px 16px",
            borderRadius: "50px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            border: "1px solid #e2e8f0",
            zIndex: 1000,
            fontSize: "13px",
            fontWeight: "500",
            color: "#334155",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>❤️</span>
          <span>
            Made by <strong style={{ color: "#2563eb" }}>Dhruv</strong>
          </span>
          <span>🚀</span>
        </div>
      </main>

      {showQuestionSelector && (
        <QuestionSelector
          subject={subject}
          onSelect={getExplanationForQuestion}
          onClose={() => setShowQuestionSelector(false)}
        />
      )}

      <AIModal
        {...aiModal}
        onClose={() => setAiModal((prev) => ({ ...prev, isOpen: false }))}
      />

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
