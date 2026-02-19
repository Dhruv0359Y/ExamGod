const fs = require("fs");
const path = require("path");
const patterns = require("../config/paperPattern.config");
const { calculateProbability } = require("./probability.service");

function generatePredictedPaper(subject, className) {
  console.log(`📝 Starting paper generation for ${subject} (${className})`);

  try {
    // Validate input
    if (!subject || !className) {
      throw new Error("Subject and className are required");
    }

    // Get paper pattern for the class
    const pattern = patterns[className];
    if (!pattern) {
      throw new Error(`Invalid class pattern for ${className}`);
    }

    // FIX: Extract the clean subject name (remove className prefix if present)
    // If subject already starts with className (like "class10_maths_standard"),
    // use it as is, otherwise combine them
    let fileNameSubject;
    if (subject.startsWith(className)) {
      // Subject already has prefix (e.g., "class10_maths_standard")
      fileNameSubject = subject;
    } else {
      // Subject doesn't have prefix, add it
      fileNameSubject = `${className}_${subject}`;
    }

    console.log(`📁 Using filename subject: ${fileNameSubject}`);

    // Construct file paths - DON'T add className again since it's already in fileNameSubject
    const questionBankPath = path.join(
      __dirname,
      "..",
      "data",
      "questionBank",
      `${fileNameSubject}.json`, // Just use fileNameSubject directly
    );

    const frequencyPath = path.join(
      __dirname,
      "..",
      "data",
      "frequency",
      `${fileNameSubject}.json`, // Just use fileNameSubject directly
    );

    console.log(`🔍 Looking for question bank: ${questionBankPath}`);
    console.log(`🔍 Looking for frequency data: ${frequencyPath}`);

    // Check if files exist
    if (!fs.existsSync(questionBankPath)) {
      console.error(`❌ Question bank not found at: ${questionBankPath}`);
      // Try alternative path without the className prefix in subject
      const alternativeSubject = subject.replace(`${className}_`, "");
      const alternativePath = path.join(
        __dirname,
        "..",
        "data",
        "questionBank",
        `${className}_${alternativeSubject}.json`,
      );

      console.log(`🔄 Trying alternative path: ${alternativePath}`);

      if (fs.existsSync(alternativePath)) {
        console.log(`✅ Found at alternative path!`);
        // Use the alternative path for frequency too
        return generatePaperWithPath(
          alternativePath,
          path.join(
            __dirname,
            "..",
            "data",
            "frequency",
            `${className}_${alternativeSubject}.json`,
          ),
          pattern,
          subject,
          className,
        );
      } else {
        throw new Error(`Question bank not found for ${fileNameSubject}`);
      }
    }

    if (!fs.existsSync(frequencyPath)) {
      console.error(`❌ Frequency file not found at: ${frequencyPath}`);
      throw new Error(`Frequency file not found for ${fileNameSubject}`);
    }

    return generatePaperWithPath(
      questionBankPath,
      frequencyPath,
      pattern,
      subject,
      className,
    );
  } catch (error) {
    console.error("❌ Paper Generation Error:", error.message);
    throw error;
  }
}

function generatePaperWithPath(
  questionBankPath,
  frequencyPath,
  pattern,
  subject,
  className,
) {
  // Read and parse data files
  const questionBankRaw = fs.readFileSync(questionBankPath, "utf8");
  const frequencyRaw = fs.readFileSync(frequencyPath, "utf8");

  const questionBank = JSON.parse(questionBankRaw);
  const frequencyData = JSON.parse(frequencyRaw);

  console.log(`✅ Loaded ${questionBank.length} questions from question bank`);

  const usedQuestions = new Set();

  function getTopicProbability(chapter, topic) {
    const chapterData = frequencyData.chapters?.find(
      (c) => c.chapter?.toLowerCase() === chapter?.toLowerCase(),
    );

    if (!chapterData) return 0;

    const topicData = chapterData.topics?.find(
      (t) => t.name?.toLowerCase() === topic?.toLowerCase(),
    );

    if (!topicData) return 0;

    return calculateProbability(topicData);
  }

  function pickQuestions(markValue, count) {
    const currentYear = new Date().getFullYear();

    const candidates = questionBank
      .filter((q) => q.marks === markValue)
      .map((q) => {
        const topicProbability = getTopicProbability(q.chapter, q.topic);

        let recencyBonus = 0;
        if (currentYear - q.year <= 2) recencyBonus = 5;
        else if (currentYear - q.year <= 4) recencyBonus = 2;

        return {
          ...q,
          finalScore: topicProbability + recencyBonus,
        };
      })
      .sort((a, b) => b.finalScore - a.finalScore);

    const selected = [];

    for (let q of candidates) {
      if (selected.length < count && !usedQuestions.has(q.questionText)) {
        selected.push({
          chapter: q.chapter,
          topic: q.topic,
          marks: q.marks,
          questionText: q.questionText,
          sourceYear: q.year,
        });

        usedQuestions.add(q.questionText);
      }

      if (selected.length >= count) break;
    }

    return selected;
  }

  const sections = pattern.sections.map((sec) => ({
    section: sec.section,
    type: sec.type,
    marksPerQuestion: sec.marks,
    questions: pickQuestions(sec.marks, sec.count),
  }));

  return {
    meta: {
      series: "ExamGod",
      set: "Predicted-Set-1",
      qpCode: "Predicted-01",
      subject: subject.includes("_")
        ? subject.split("_")[1].charAt(0).toUpperCase() +
          subject.split("_")[1].slice(1)
        : subject,
      class: className === "class12" ? 12 : 10,
      timeAllowed: pattern.timeAllowed,
      maximumMarks: pattern.totalMarks,
      totalQuestions: pattern.totalQuestions,
    },
    sections,
  };
}

module.exports = { generatePredictedPaper };
