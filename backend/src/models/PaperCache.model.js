const mongoose = require("mongoose");

const PaperCacheSchema = new mongoose.Schema({
  subject: String,
  paper: Object,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("PaperCache", PaperCacheSchema);
