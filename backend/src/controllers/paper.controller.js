const {
  generatePredictedPaper,
} = require("../services/paperGenerator.service");
const PaperCache = require("../models/PaperCache.model");

// Helper function to extract className from subject
const getClassNameFromSubject = (subject) => {
  if (subject.startsWith("class10")) return "class10";
  if (subject.startsWith("class12")) return "class12";
  // Default fallback - you can adjust this based on your needs
  return "class10";
};

exports.getPredictedPaper = async (req, res) => {
  try {
    const { subject } = req.body; // Frontend only sends subject, not className

    if (!subject) {
      return res.status(400).json({
        error: "Subject is required",
      });
    }

    // Derive className from the subject string
    const className = getClassNameFromSubject(subject);

    console.log(
      `📝 Generating paper for subject: ${subject}, class: ${className}`,
    );

    // Check cache using both subject and className
    const cached = await PaperCache.findOne({
      subject,
      className,
    });

    if (cached) {
      console.log("⚡ Serving paper from cache");
      return res.json(cached.paper);
    }

    // Generate new paper
    const paper = generatePredictedPaper(subject, className);

    // Cache the generated paper
    await PaperCache.create({
      subject,
      className,
      paper,
    });

    console.log("✅ New paper generated and cached");
    res.json(paper);
  } catch (error) {
    console.error("❌ Paper Generation Error:", error.message);
    res.status(500).json({
      error: "Failed to generate paper",
      details: error.message,
    });
  }
};
