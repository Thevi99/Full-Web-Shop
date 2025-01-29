import mongoose from "mongoose";

const QRCODESchema = new mongoose.Schema(
  {
    qrcode: { type: String, required: true },
    qrimg: { type: String, required: true },
    ref: { type: String, required: true },
    amount: { type: Number, required: true },
    user: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.qrcode_bank || mongoose.model("qrcode_bank", QRCODESchema);
