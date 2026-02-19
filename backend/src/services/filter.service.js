const { calculateProbability } = require("./probability.service");
const MODES = require("../config/modes.config");

function filterTopics(data, mode) {
  console.log(`🔍 Filtering topics with mode: ${mode}`);

  const threshold = MODES[mode]?.threshold;

  if (!threshold) {
    console.error(`❌ Invalid mode: ${mode}`);
    throw new Error(`Invalid mode: ${mode}`);
  }

  console.log(`🎯 Using threshold: ${threshold}%`);
  console.log(`📚 Total chapters: ${data.chapters.length}`);

  const results = [];

  // Loop through all chapters
  data.chapters.forEach((chapter) => {
    console.log(`\n📖 Chapter: ${chapter.chapter}`);
    console.log(`   Topics in this chapter: ${chapter.topics.length}`);

    chapter.topics.forEach((topic) => {
      const probability = calculateProbability(topic);

      console.log(
        `   📊 Topic: "${topic.name}" - Probability: ${probability}%`,
      );

      // Always include for debugging, but filter by threshold
      if (probability >= threshold) {
        console.log(`   ✅ INCLUDED (above ${threshold}%)`);

        // Get recent years (last 3 years)
        const currentYear = new Date().getFullYear();
        const recentYears = topic.appearances
          .filter((a) => currentYear - a.year <= 3)
          .map((a) => a.year)
          .sort((a, b) => b - a); // Sort descending (most recent first)

        results.push({
          chapter: chapter.chapter,
          name: topic.name,
          probability: Math.round(probability * 10) / 10, // Round to 1 decimal
          appearedCount: topic.appearances.length,
          recentYears:
            recentYears.length > 0 ? recentYears : ["No recent years"],
          // Add more details for debugging
          allYears: topic.appearances.map((a) => a.year).sort((a, b) => b - a),
          totalMarks: topic.appearances.reduce((sum, a) => sum + a.marks, 0),
        });
      } else {
        console.log(`   ❌ EXCLUDED (below ${threshold}%)`);
      }
    });
  });

  // Sort by probability descending
  const sortedResults = results.sort((a, b) => b.probability - a.probability);

  console.log(`\n📊 Final Results:`);
  console.log(`   Total topics above ${threshold}%: ${sortedResults.length}`);
  console.log(`   Highest probability: ${sortedResults[0]?.probability}%`);
  console.log(
    `   Lowest probability: ${sortedResults[sortedResults.length - 1]?.probability}%`,
  );

  // Log all included topics
  sortedResults.forEach((topic, index) => {
    console.log(
      `   ${index + 1}. ${topic.chapter} - ${topic.name}: ${topic.probability}%`,
    );
  });

  return sortedResults;
}

module.exports = { filterTopics };
