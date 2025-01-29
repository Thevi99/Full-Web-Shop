import History from "../../../../src/models/transactionModel";
import connectDB from "../../../../src/lib/mongo";

export default async function handler(req, res) {
    if (req.method === "GET") {
      await connectDB();
      try {
        const data = await History.find()
        return res.status(201).json({
          DataTarget: data
        });
      } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  }
