const express = require("express");
const router = express.Router();
const { getExplanation } = require("../controllers/explanation.controller");

router.post("/", getExplanation);

module.exports = router;
