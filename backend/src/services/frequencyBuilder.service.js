const fs = require("fs");
const path = require("path");

function buildFrequency(subject, className, stream) {
  const rawFolderPath = path.join(
    __dirname,
    `../data/raw/${className}/${stream}`,
  );

  if (!fs.existsSync(rawFolderPath)) {
    throw new Error("Raw folder not found");
  }

  const files = fs
    .readdirSync(rawFolderPath)
    .filter((file) => file.toLowerCase().startsWith(subject.toLowerCase()));

  if (files.length === 0) {
    throw new Error("No raw files found for subject");
  }

  const frequencyMap = {};

  files.forEach((file) => {
    const filePath = path.join(rawFolderPath, file);
    const rawData = JSON.parse(fs.readFileSync(filePath));

    const year = rawData.meta.year;

    rawData.sections.forEach((section) => {
      section.questions.forEach((question) => {
        const { chapter, topic, marks } = question;
        if (!chapter || !topic) return;

        if (!frequencyMap[chapter]) {
          frequencyMap[chapter] = {};
        }

        if (!frequencyMap[chapter][topic]) {
          frequencyMap[chapter][topic] = {};
        }

        if (frequencyMap[chapter][topic][year]) {
          frequencyMap[chapter][topic][year] = Math.max(
            frequencyMap[chapter][topic][year],
            marks,
          );
        } else {
          frequencyMap[chapter][topic][year] = marks;
        }
      });
    });
  });

  const finalData = {
    subject,
    class: className === "class12" ? 12 : 10,
    chapters: [],
  };

  Object.keys(frequencyMap).forEach((chapterName) => {
    const chapterObj = {
      chapter: chapterName,
      topics: [],
    };

    Object.keys(frequencyMap[chapterName]).forEach((topicName) => {
      const appearances = Object.keys(frequencyMap[chapterName][topicName]).map(
        (year) => ({
          year: Number(year),
          marks: frequencyMap[chapterName][topicName][year],
        }),
      );

      appearances.sort((a, b) => a.year - b.year);

      chapterObj.topics.push({
        name: topicName,
        appearances,
      });
    });

    finalData.chapters.push(chapterObj);
  });

  const outputPath = path.join(
    __dirname,
    `../data/frequency/class${finalData.class}_${subject.toLowerCase()}.json`,
  );

  fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2));

  console.log("✅ Frequency file generated successfully!");
}

module.exports = { buildFrequency };
