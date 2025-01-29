const { model, Schema, models } = require("mongoose");

const schema = new Schema({
  License: { type: String, required: true },
  Script_Name: { type: String, required: true },
  Status: { type: Number, default: 0 },
  Owner: { type: String, default: null },
});

module.exports = models.License || model("License", schema);
