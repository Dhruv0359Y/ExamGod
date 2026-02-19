// backend/routes/questions.routes.js
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { calculateProbability } = require("../services/probability.service");

router.post("/", (req, res) => {
  try {
    const { subject, limit = 50, chapter, marks } = req.body;

    if (!subject) {
      return res.status(400).json({ error: "Subject is required" });
    }

    // Read question bank
    const questionBankPath = path.join(
      __dirname,
      "..",
      "data",
      "questionBank",
      `${subject.toLowerCase()}.json`,
    );

    if (!fs.existsSync(questionBankPath)) {
      return res.status(404).json({ error: "Question bank not found" });
    }

    let questions = JSON.parse(fs.readFileSync(questionBankPath, "utf8"));

    // Apply filters
    if (chapter && chapter !== "all") {
      questions = questions.filter((q) => q.chapter === chapter);
    }

    if (marks && marks !== "all") {
      questions = questions.filter((q) => q.marks === parseInt(marks));
    }

    // Calculate importance score based on frequency
    questions = questions.map((q) => {
      // Group by topic to calculate frequency
      const topicQuestions = questions.filter(
        (tq) => tq.chapter === q.chapter && tq.topic === q.topic,
      );

      return {
        ...q,
        importance: topicQuestions.length * 10 + (2025 - q.year) * 2,
        frequency: topicQuestions.length,
      };
    });

    // Sort by importance and take limit
    questions = questions
      .sort((a, b) => b.importance - a.importance)
      .slice(0, limit);

    res.json({
      subject,
      total: questions.length,
      questions,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
