const { model, Schema, models } = require("mongoose");

const schema = new Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  description: { type: String, required: true },
  click: { type: Boolean, required: true },
  user: { type: String, required: true },
}, { timestamps: true });

module.exports = models.message || model("message", schema);
