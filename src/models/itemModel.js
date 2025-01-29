import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String }, 
    datas: { type: [String], default: [] }, 
    price: { type: Number, required: true }, 
    discount: { type: Number, default: 0 }, 
    type: { type: Number, default: 0 }, 
    priority: { type: Number, default: 0 }, 
    status: { type: Number, default: 1 }, 
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }, 
    image: { type: String, required: true }, 
  },
  { timestamps: true } 
);

export default mongoose.models.Item || mongoose.model("Item", itemSchema);
