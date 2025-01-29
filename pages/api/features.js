
import Features from "../../src/models/featuresModel";
import dbConnect from "../../src/lib/mongo";


const handler = async (req, res) => {
  await dbConnect();
  if (req.method === "GET") {
    try {
      const DataFeatures = await Features.find();
      return res.status(200).json({
        DataFeatures
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
      return res.status(500).json({
        message: "Internal Server Error"
      });
    }
  }
};

export default handler;
// export default async function handler(req, res) {
//   await connectDB();

//   if (req.method === "POST") {
//     const { categoryName, description, imageUrl } = req.body;

//     if (!categoryName) {
//       return res.status(400).json({ message: "Category name is required" });
//     }

//     try {
//       const newCategory = new Category({ categoryName, description, imageUrl });
//       await newCategory.save();
//       return res.status(201).json({ message: "Category added successfully" });
//     } catch (error) {
//       console.error("Error creating category:", error);
//       return res.status(500).json({ message: "Internal Server Error" });
//     }
//   }

//   if (req.method === "GET") {
//     try {
//       const categories = await Category.find();
//       return res.status(200).json({ categories });
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//       return res.status(500).json({ message: "Internal Server Error" });
//     }
//   }

//   res.status(405).json({ message: "Method not allowed" });
// }