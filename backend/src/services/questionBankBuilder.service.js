const fs = require("fs");
const path = require("path");

function buildQuestionBank(subject, className, stream) {
  const rawFolderPath = path.join(
    __dirname,
    `../data/raw/${className}/${stream}`,
  );

  if (!fs.existsSync(rawFolderPath)) {
    throw new Error("Raw folder not found");
  }

  const files = fs.readdirSync(rawFolderPath);

  const questionBank = [];

  files.forEach((file) => {
    const filePath = path.join(rawFolderPath, file);
    const rawData = JSON.parse(fs.readFileSync(filePath));

    const year = rawData.meta.year;

    rawData.sections.forEach((section) => {
      section.questions.forEach((question) => {
        if (!question.chapter || !question.topic) return;

        questionBank.push({
          year,
          section: section.section,
          type: section.type,
          chapter: question.chapter,
          topic: question.topic,
          marks: question.marks,
          questionText: question.questionText,
        });
      });
    });
  });

  // Yahan maine className add kar diya hai
  const classPrefix = className === "class12" ? "class12" : "class10";
  const outputPath = path.join(
    __dirname,
    `../data/questionBank/${classPrefix}_${subject.toLowerCase()}.json`,
  );

  fs.writeFileSync(outputPath, JSON.stringify(questionBank, null, 2));

  console.log(
    `✅ Question bank generated successfully: ${classPrefix}_${subject.toLowerCase()}.json`,
  );
}

module.exports = { buildQuestionBank };
