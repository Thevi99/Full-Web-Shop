import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  nickname: { type: String },
  email: { type: String },
  provider: { type: String },
  avatar: { type: String },
  role: { type: String, default: "User" },
  credit: { type: Number, default: 0 },
  reward: { type: Number, default: 0 },
  banned: { type: Boolean, default: false },
  private: { type: Boolean, default: true },
  ip: { type: String, default: "unknown" },
});

export default mongoose.models.User || mongoose.model("User", userSchema);
