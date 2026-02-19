// src/components/QuestionSelector.jsx
import React, { useState, useEffect } from "react";

const QuestionSelector = ({ subject, onSelect, onClose }) => {
  const [questions, setQuestions] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState("all");
  const [selectedMarks, setSelectedMarks] = useState("all");
  const [loading, setLoading] = useState(true);
  const [customQuestion, setCustomQuestion] = useState("");
  const [chapters, setChapters] = useState([]);

  // Fetch questions from question bank
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        // API call to get questions for this subject
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/questions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              subject: subject.id,
              limit: 50, // Top 50 important questions
            }),
          },
        );

        if (response.ok) {
          const data = await response.json();
          setQuestions(data.questions || []);

          // Extract unique chapters for filter
          const uniqueChapters = [
            ...new Set(data.questions.map((q) => q.chapter)),
          ];
          setChapters(uniqueChapters);
        } else {
          // Fallback to mock data if API fails
          setQuestions(getMockQuestions());
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        setQuestions(getMockQuestions());
      } finally {
        setLoading(false);
      }
    };

    if (subject) {
      fetchQuestions();
    }
  }, [subject]);

  // Mock questions as fallback
  const getMockQuestions = () => {
    return [
      {
        id: 1,
        chapter: "Quadratic Equations",
        topic: "Nature of Roots",
        question: "Find the nature of roots of equation x² - 5x + 6 = 0",
        marks: 2,
      },
      {
        id: 2,
        chapter: "Quadratic Equations",
        topic: "Word Problems",
        question:
          "The sum of squares of two consecutive positive integers is 365. Find the integers.",
        marks: 3,
      },
      {
        id: 3,
        chapter: "Arithmetic Progressions",
        topic: "nth Term",
        question: "Find the 20th term of AP: 2, 7, 12, ...",
        marks: 2,
      },
      {
        id: 4,
        chapter: "Arithmetic Progressions",
        topic: "Sum of n terms",
        question: "Find the sum of first 20 terms of AP: 5, 8, 11, ...",
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
      {
        id: 6,
        chapter: "Circles",
        topic: "Tangent Properties",
        question:
          "Prove that the tangent at any point of a circle is perpendicular to the radius through the point of contact.",
        marks: 3,
      },
      {
        id: 7,
        chapter: "Some Applications of Trigonometry",
        topic: "Heights and Distances",
        question:
          "The angle of elevation of the top of a tower from a point on the ground is 30°. If the observer moves 20m towards the tower, the angle becomes 60°. Find the height of the tower.",
        marks: 4,
      },
      {
        id: 8,
        chapter: "Statistics",
        topic: "Mean",
        question:
          "Find the mean of the following frequency distribution: Classes: 0-10, 10-20, 20-30, 30-40, 40-50; Frequencies: 5, 8, 15, 10, 2",
        marks: 3,
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

  // Get unique marks values for filter
  const marksOptions = [
    "all",
    ...new Set(questions.map((q) => q.marks)),
  ].sort();

  const handleQuestionSelect = (question) => {
    onSelect(question.question || question.questionText, question.marks);
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
            🤖 AI Explanation
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
              <option value="all">⭐ All Marks</option>
              {marksOptions
                .filter((m) => m !== "all")
                .map((marks) => (
                  <option key={marks} value={marks}>
                    {marks} Marks
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
              <p style={{ color: "#64748b" }}>Loading important questions...</p>
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
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "15px",
                      color: "#0f172a",
                      fontWeight: "500",
                    }}
                  >
                    {q.question || q.questionText}
                  </p>
                  {q.topic && (
                    <p
                      style={{
                        margin: "8px 0 0",
                        fontSize: "13px",
                        color: "#64748b",
                      }}
                    >
                      📌 Topic: {q.topic}
                    </p>
                  )}
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
            }}
            placeholder="Type your question here..."
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
                onSelect(customQuestion, 3); // Default 3 marks for custom
              } else {
                alert("Please select or enter a question");
              }
            }}
            style={{
              padding: "12px 30px",
              border: "none",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
              color: "white",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px",
              opacity: customQuestion.trim() ? 1 : 0.5,
            }}
            disabled={!customQuestion.trim()}
          >
            Get Explanation
          </button>
        </div>
      </div>

      {/* Add spin animation */}
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
};

export default QuestionSelector;
