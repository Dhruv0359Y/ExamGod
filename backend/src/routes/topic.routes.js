const express = require("express");
const router = express.Router();
const { getTopics } = require("../controllers/topic.controller");

router.post("/", getTopics);

module.exports = router;
