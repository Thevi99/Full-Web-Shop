


import mongoose from "mongoose";

const FeaturesSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true }, 
    link: { type: String }, 
  }
);

export default mongoose.models.features || mongoose.model("features", FeaturesSchema);
