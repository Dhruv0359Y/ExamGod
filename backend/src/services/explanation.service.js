const { GoogleGenerativeAI } = require("@google/generative-ai");
const Explanation = require("../models/Explanation.model");

// Check if API key exists
if (!process.env.GEMINI_API_KEY) {
  console.warn("⚠️ GEMINI_API_KEY not found in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy-key");

async function generateExplanation(subject, questionText, marks) {
  try {
    console.log("🔎 Checking explanation cache...");

    // Check cache first
    const cached = await Explanation.findOne({
      subject,
      questionText,
    });

    if (cached) {
      console.log("⚡ Serving explanation from CACHE");
      return {
        familiarExplanation: cached.familiarExplanation,
        examStandardExplanation: cached.examStandardExplanation,
      };
    }

    // If no API key, return mock explanation
    if (!process.env.GEMINI_API_KEY) {
      console.log("⚠️ No Gemini API key, returning mock explanation");
      return getMockExplanation(questionText, marks);
    }

    console.log("🤖 Cache miss. Calling Gemini API...");

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite", // Use a more stable model
    });

    // Create prompt based on marks
    const prompt = createExplanationPrompt(subject, questionText, marks);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the response
    const parsed = parseExplanationResponse(text);

    if (!parsed.familiarExplanation || !parsed.examStandardExplanation) {
      console.log("❌ Gemini response parsing failed, using mock");
      return getMockExplanation(questionText, marks);
    }

    console.log("💾 Saving explanation to database...");

    // Save to cache
    await Explanation.create({
      subject,
      questionText,
      familiarExplanation: parsed.familiarExplanation,
      examStandardExplanation: parsed.examStandardExplanation,
    });

    console.log("✅ Explanation generated and stored");

    return parsed;
  } catch (error) {
    console.error("🔥 Explanation Service Error:", error.message);
    // Return mock explanation on error
    return getMockExplanation(questionText, marks);
  }
}

function createExplanationPrompt(subject, questionText, marks) {
  const basePrompt = `You are a CBSE Class 12 expert teacher. Explain this question in two ways:

Question: "${questionText}"
Marks: ${marks}

Format your response exactly like this:

FAMILIAR_EXPLANATION:
[Simple, easy-to-understand explanation in Hinglish mix - max ${marks * 20} words]

EXAM_STANDARD_ANSWER:
[Perfect board-exam style answer with proper formatting, key points, and formulas if needed]`;

  return basePrompt;
}

function parseExplanationResponse(text) {
  const familiarMatch = text.match(
    /FAMILIAR_EXPLANATION:\s*(.*?)(?=EXAM_STANDARD_ANSWER:|$)/s,
  );
  const examMatch = text.match(/EXAM_STANDARD_ANSWER:\s*(.*)/s);

  return {
    familiarExplanation: familiarMatch ? familiarMatch[1].trim() : "",
    examStandardExplanation: examMatch ? examMatch[1].trim() : "",
  };
}

function getMockExplanation(questionText, marks) {
  return {
    familiarExplanation: `Yeh question ${marks} marks ka hai. Isko samajhne ke liye basic concepts clear hone chahiye. Chapter ke main points yaad rakho aur diagrams banakar practice karo.`,
    examStandardExplanation: `This is a ${marks}-mark question. Key points to remember:\n• Understand the core concept\n• Write step-by-step solution\n• Include relevant formulas\n• Draw diagrams where applicable\n• Practice similar questions from previous years`,
  };
}

module.exports = { generateExplanation };
