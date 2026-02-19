// backend/app.js
const express = require("express");
const cors = require("cors");
const app = express();
const topicRoutes = require("./routes/topic.routes");
const paperRoutes = require("./routes/paper.routes");
const explanationRoutes = require("./routes/explanation.routes");
const questionsRoutes = require("./routes/questions.routes"); // Add this

app.use(
  cors({
    origin: "https://examgod-frontend.onrender.com",
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/topics", topicRoutes);
app.use("/api/paper", paperRoutes);
app.use("/api/explanation", explanationRoutes);
app.use("/api/questions", questionsRoutes); // Add this

app.get("/", (req, res) => {
  res.send("Welcome to Exam Probability Engine API");
});

module.exports = app;
