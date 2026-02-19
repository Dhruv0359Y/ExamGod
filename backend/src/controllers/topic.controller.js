const fs = require("fs");
const path = require("path");
const { filterTopics } = require("../services/filter.service");

exports.getTopics = (req, res) => {
  try {
    const { subject, mode } = req.body;

    console.log(`📥 Received topics request:`, { subject, mode });

    if (!subject || !mode) {
      return res.status(400).json({
        error: "Subject and mode are required",
      });
    }

    // Convert mode to uppercase
    const normalizedMode = mode.toUpperCase();
    
    // Validate mode
    if (!['PASS', 'AVG'].includes(normalizedMode)) {
      return res.status(400).json({
        error: "Mode must be either 'PASS' or 'AVG'",
        receivedMode: mode
      });
    }

    const fileName = `${subject.toLowerCase()}.json`;
    
    const filePath = path.join(
      __dirname,
      '..',
      'data',
      'frequency',
      fileName
    );

    console.log(`🔍 Looking for frequency file: ${filePath}`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: `Frequency data not found for subject: ${subject}`,
        path: filePath
      });
    }

    const rawData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(rawData);
    
    console.log(`📊 Processing topics with mode: ${normalizedMode}`);
    console.log(`📚 Total chapters in file: ${data.chapters.length}`);
    
    // Count total topics before filtering
    let totalTopics = 0;
    data.chapters.forEach(chapter => {
      totalTopics += chapter.topics.length;
    });
    console.log(`📝 Total topics in file: ${totalTopics}`);
    
    const topics = filterTopics(data, normalizedMode);

    console.log(`✅ Found ${topics.length} high-probability topics out of ${totalTopics} total`);

    // Return with metadata
    res.json({ 
      highProbabilityTopics: topics,
      subject: data.subject,
      class: data.class,
      mode: normalizedMode,
      threshold: normalizedMode === 'PASS' ? 75 : 55,
      totalTopics: totalTopics,
      filteredCount: topics.length
    });
    
  } catch (error) {
    console.error("❌ Topic Controller Error:", error);
    res.status(500).json({ 
      error: "Failed to fetch topics",
      details: error.message 
    });
  }
};