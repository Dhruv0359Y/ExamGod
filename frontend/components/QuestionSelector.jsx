// src/components/QuestionSelector.jsx
import React, { useState, useEffect } from "react";

const QuestionSelector = ({ subject, onSelect, onClose }) => {
  const [questions, setQuestions] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState("all");
  const [selectedMarks, setSelectedMarks] = useState("all");
  const [loading, setLoading] = useState(true);
  const [customQuestion, setCustomQuestion] = useState("");
  const [chapters, setChapters] = useState([]);
  const [error, setError] = useState(null);

  // Fetch questions from backend based on subject
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!subject) return;

      setLoading(true);
      setError(null);

      try {
        console.log("📡 Fetching questions for subject:", subject.id);

        // Call backend API to get questions for this specific subject
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/questions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              subject: subject.id,
              limit: 50,
            }),
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Questions received:", data);

        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions);

          // Extract unique chapters
          const uniqueChapters = [
            ...new Set(data.questions.map((q) => q.chapter)),
          ];
          setChapters(uniqueChapters);
        } else {
          // Agar backend se questions nahi aaye toh subject-based mock questions do
          const mockQuestions = getSubjectSpecificMockQuestions(subject.id);
          setQuestions(mockQuestions);

          const uniqueChapters = [
            ...new Set(mockQuestions.map((q) => q.chapter)),
          ];
          setChapters(uniqueChapters);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError(error.message);

        // Fallback to subject-specific mock questions
        const mockQuestions = getSubjectSpecificMockQuestions(subject.id);
        setQuestions(mockQuestions);

        const uniqueChapters = [
          ...new Set(mockQuestions.map((q) => q.chapter)),
        ];
        setChapters(uniqueChapters);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [subject]);

  // Subject-specific mock questions
  const getSubjectSpecificMockQuestions = (subjectId) => {
    // Maths Basic questions
    if (subjectId.includes("maths_basic")) {
      return [
        {
          id: 1,
          chapter: "Real Numbers",
          topic: "HCF and LCM",
          question:
            "Find the HCF and LCM of 96 and 404 using prime factorisation method.",
          marks: 2,
        },
        {
          id: 2,
          chapter: "Polynomials",
          topic: "Zeroes of Polynomial",
          question: "Find the zeroes of the polynomial x² - 3x - 10.",
          marks: 2,
        },
        {
          id: 3,
          chapter: "Quadratic Equations",
          topic: "Nature of Roots",
          question: "Find the nature of roots of equation 2x² - 5x + 3 = 0.",
          marks: 3,
        },
        {
          id: 4,
          chapter: "Arithmetic Progressions",
          topic: "Sum of n terms",
          question: "Find the sum of first 20 terms of AP: 2, 5, 8, ...",
          marks: 3,
        },
        {
          id: 5,
          chapter: "Triangles",
          topic: "Similar Triangles",
          question:
            "Prove that if a line is drawn parallel to one side of a triangle, it divides the other two sides in the same ratio.",
          marks: 5,
        },
      ];
    }

    // Maths Standard questions
    else if (subjectId.includes("maths_standard")) {
      return [
        {
          id: 1,
          chapter: "Real Numbers",
          topic: "Irrational Numbers",
          question: "Prove that √3 is an irrational number.",
          marks: 3,
        },
        {
          id: 2,
          chapter: "Polynomials",
          topic: "Relationship between Zeroes",
          question: "Find a quadratic polynomial whose zeroes are 2 and -3.",
          marks: 2,
        },
        {
          id: 3,
          chapter: "Quadratic Equations",
          topic: "Word Problems",
          question:
            "The sum of squares of two consecutive positive integers is 365. Find the integers.",
          marks: 4,
        },
        {
          id: 4,
          chapter: "Arithmetic Progressions",
          topic: "AP Applications",
          question:
            "How many terms of AP: 24, 21, 18, ... must be taken so that their sum is 78?",
          marks: 3,
        },
        {
          id: 5,
          chapter: "Coordinate Geometry",
          topic: "Section Formula",
          question:
            "Find the coordinates of point which divides line joining (4,-3) and (8,5) in ratio 3:1 internally.",
          marks: 3,
        },
      ];
    }

    // Physics questions
    else if (subjectId.includes("physics")) {
      return [
        {
          id: 1,
          chapter: "Electrostatics",
          topic: "Coulomb's Law",
          question: "State and explain Coulomb's law in vector form.",
          marks: 3,
        },
        {
          id: 2,
          chapter: "Current Electricity",
          topic: "Kirchhoff's Laws",
          question: "State and explain Kirchhoff's laws with examples.",
          marks: 3,
        },
        {
          id: 3,
          chapter: "Ray Optics",
          topic: "Total Internal Reflection",
          question:
            "Explain total internal reflection with conditions and applications.",
          marks: 4,
        },
        {
          id: 4,
          chapter: "Dual Nature",
          topic: "Photoelectric Effect",
          question:
            "Explain photoelectric effect and Einstein's photoelectric equation.",
          marks: 5,
        },
        {
          id: 5,
          chapter: "Semiconductors",
          topic: "PN Junction Diode",
          question: "Explain the working of PN junction diode in forward bias.",
          marks: 3,
        },
      ];
    }

    // Default fallback
    return [
      {
        id: 1,
        chapter: "General",
        topic: "Topic",
        question: "Explain the concept with examples.",
        marks: 3,
      },
      {
        id: 2,
        chapter: "General",
        topic: "Topic",
        question: "Solve the given problem step by step.",
        marks: 4,
      },
    ];
  };

  // Filter questions based on chapter and marks
  const filteredQuestions = questions.filter((q) => {
    if (selectedChapter !== "all" && q.chapter !== selectedChapter)
      return false;
    if (selectedMarks !== "all" && q.marks !== parseInt(selectedMarks))
      return false;
    return true;
  });

  // Get unique marks values
  const marksOptions = ["all", ...new Set(questions.map((q) => q.marks))].sort(
    (a, b) => {
      if (a === "all") return -1;
      if (b === "all") return 1;
      return a - b;
    },
  );

  const handleQuestionSelect = (question) => {
    onSelect(question.question, question.marks);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(5px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "24px",
          maxWidth: "800px",
          width: "90%",
          maxHeight: "85vh",
          overflowY: "auto",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px",
            borderBottom: "2px solid #e2e8f0",
            paddingBottom: "15px",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "800",
              background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            🤖 AI Explanation - {subject?.name}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "28px",
              cursor: "pointer",
              color: "#64748b",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#f1f5f9")}
            onMouseLeave={(e) => (e.target.style.background = "none")}
          >
            ×
          </button>
        </div>

        {/* Subject Info */}
        <div
          style={{
            background: "#eff6ff",
            padding: "12px 18px",
            borderRadius: "12px",
            marginBottom: "20px",
            border: "1px solid #bfdbfe",
          }}
        >
          <span style={{ fontWeight: "600", color: "#1e40af" }}>
            📚 {subject?.name}
          </span>
          <span style={{ marginLeft: "10px", color: "#3b82f6" }}>
            ({subject?.id})
          </span>
        </div>

        {/* Error message if any */}
        {error && (
          <div
            style={{
              background: "#fee2e2",
              border: "1px solid #ef4444",
              color: "#b91c1c",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          ></div>
        )}

        {/* Filters */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
            marginBottom: "25px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "600",
                fontSize: "14px",
                color: "#475569",
              }}
            >
              Filter by Chapter:
            </label>
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                fontSize: "14px",
                background: "white",
              }}
            >
              <option value="all">📖 All Chapters</option>
              {chapters.map((chapter) => (
                <option key={chapter} value={chapter}>
                  {chapter}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "600",
                fontSize: "14px",
                color: "#475569",
              }}
            >
              Filter by Marks:
            </label>
            <select
              value={selectedMarks}
              onChange={(e) => setSelectedMarks(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                fontSize: "14px",
                background: "white",
              }}
            >
              {marksOptions.map((marks) => (
                <option key={marks} value={marks}>
                  {marks === "all" ? "⭐ All Marks" : `${marks} Marks`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Questions List */}
        <div style={{ marginBottom: "20px" }}>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "700",
              marginBottom: "15px",
              color: "#0f172a",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>📋 Select a Question ({filteredQuestions.length})</span>
            {loading && (
              <span style={{ color: "#64748b", fontSize: "14px" }}>
                Loading...
              </span>
            )}
          </h3>

          {loading ? (
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
              <p style={{ color: "#64748b" }}>
                Loading questions for {subject?.name}...
              </p>
            </div>
          ) : (
            <div
              style={{ maxHeight: "300px", overflowY: "auto", padding: "5px" }}
            >
              {filteredQuestions.map((q, index) => (
                <div
                  key={index}
                  onClick={() => handleQuestionSelect(q)}
                  style={{
                    padding: "16px",
                    marginBottom: "10px",
                    background: "#f8fafc",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f1f5f9";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#f8fafc";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginBottom: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        background: "#dbeafe",
                        color: "#1e40af",
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      {q.marks} Marks
                    </span>
                    <span
                      style={{
                        background: "#f1f5f9",
                        color: "#334155",
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                      }}
                    >
                      {q.chapter}
                    </span>
                    {q.topic && (
                      <span
                        style={{
                          background: "#e6f7ff",
                          color: "#0066cc",
                          padding: "4px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                        }}
                      >
                        {q.topic}
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "15px",
                      color: "#0f172a",
                      fontWeight: "500",
                    }}
                  >
                    {q.question}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* OR Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            margin: "20px 0",
            color: "#94a3b8",
          }}
        >
          <hr style={{ flex: 1, border: "1px dashed #e2e8f0" }} />
          <span style={{ fontSize: "14px", fontWeight: "600" }}>OR</span>
          <hr style={{ flex: 1, border: "1px dashed #e2e8f0" }} />
        </div>

        {/* Custom Question Input */}
        <div style={{ marginBottom: "25px" }}>
          <label
            style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}
          >
            ✍️ Ask Your Own Question:
          </label>
          <textarea
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              border: "2px solid #e2e8f0",
              minHeight: "80px",
              fontSize: "14px",
              resize: "vertical",
              fontFamily: "inherit",
            }}
            placeholder={`Type your ${subject?.name} question here...`}
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div
          style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "12px 24px",
              border: "1px solid #cbd5e1",
              borderRadius: "12px",
              background: "white",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (customQuestion.trim()) {
                onSelect(customQuestion, 3);
              } else {
                alert("Please select or enter a question");
              }
            }}
            style={{
              padding: "12px 30px",
              border: "none",
              borderRadius: "12px",
              background: customQuestion.trim()
                ? "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)"
                : "#cbd5e1",
              color: customQuestion.trim() ? "white" : "#64748b",
              cursor: customQuestion.trim() ? "pointer" : "not-allowed",
              fontWeight: "600",
              fontSize: "14px",
            }}
            disabled={!customQuestion.trim()}
          >
            Get Explanation
          </button>
        </div>
      </div>

      {/* Add spin animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default QuestionSelector;
