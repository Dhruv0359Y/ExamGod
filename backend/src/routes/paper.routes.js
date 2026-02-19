const express = require("express");
const router = express.Router();
const { getPredictedPaper } = require("../controllers/paper.controller");

router.post("/", getPredictedPaper);

module.exports = router;
