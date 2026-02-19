const CURRENT_YEAR = 2025;

function calculateProbability(topic) {
  const appearances = topic.appearances || [];

  if (appearances.length === 0) return 0;

  // Base score from frequency (max 40 points)
  const frequencyScore = Math.min(appearances.length * 10, 40);

  // Score from total marks (max 30 points)
  const markScore = Math.min(
    appearances.reduce((sum, item) => sum + item.marks, 0),
    30,
  );

  // Recency boost (max 30 points)
  const recencyBoost = appearances.reduce((boost, item) => {
    const yearsAgo = CURRENT_YEAR - item.year;
    if (yearsAgo <= 1) return boost + 15; // Last year: +15
    if (yearsAgo <= 2) return boost + 10; // 2 years ago: +10
    if (yearsAgo <= 3) return boost + 5; // 3 years ago: +5
    return boost;
  }, 0);

  // Calculate total probability (max 100)
  let probability = frequencyScore + markScore + recencyBoost;

  // Cap at 100
  probability = Math.min(probability, 100);

  return probability;
}

module.exports = { calculateProbability };
