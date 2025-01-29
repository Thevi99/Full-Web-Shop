import mongoose from "mongoose";

const ConfigSettingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    logo: { type: String, required: true },
    video: { type: String, required: true },
    faqyt: { type: String, required: true },
    wallet: { type: String, required: true },
    bank: { type: Boolean, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.ConfigSetting || mongoose.model("ConfigSetting", ConfigSettingSchema);
