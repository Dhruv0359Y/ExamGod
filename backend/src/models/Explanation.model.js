const mongoose = require("mongoose");

const explanationSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    questionText: { type: String, required: true },
    familiarExplanation: { type: String, required: true },
    examStandardExplanation: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Explanation", explanationSchema);
