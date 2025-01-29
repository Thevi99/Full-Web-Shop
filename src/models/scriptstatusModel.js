import mongoose from "mongoose";

const ScriptStatusSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    status: { type: String, required: true },
    detail: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.ScriptStatus || mongoose.model("ScriptStatus", ScriptStatusSchema);
