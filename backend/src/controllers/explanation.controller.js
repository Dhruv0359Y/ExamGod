const { generateExplanation } = require("../services/explanation.service");

exports.getExplanation = async (req, res) => {
  try {
    const { subject, questionText, marks } = req.body;

    // 🔹 1️⃣ Basic Validation
    if (!subject || !questionText || !marks) {
      return res.status(400).json({
        error: "subject, questionText and marks are required",
      });
    }

    const normalizedSubject = subject.toLowerCase();

    console.log("Request received for explanation...");

    // 🔹 2️⃣ Generate / Fetch Explanation
    const explanation = await generateExplanation(
      normalizedSubject,
      questionText,
      Number(marks),
    );

    console.log("Explanation served successfully");

    // 🔹 3️⃣ Send Response
    return res.json({
      subject: normalizedSubject,
      questionText,
      marks,
      familiarExplanation: explanation.familiarExplanation,
      examStandardExplanation: explanation.examStandardExplanation,
    });
  } catch (error) {
    console.error("Explanation Error:", error.message);
    return res.status(500).json({
      error: "Failed to generate explanation",
    });
  }
};

