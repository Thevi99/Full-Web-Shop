import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
