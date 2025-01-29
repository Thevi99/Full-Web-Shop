const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true, unique: true },
  description: { type: String },
  imageUrl: { type: String },
});

module.exports = mongoose.models.Category || mongoose.model("Category", categorySchema);
