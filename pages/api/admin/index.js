import connectDB from "../../../src/lib/mongo";
import Item from "../../../src/model/itemModel";

export default async function handler(req, res) {
  if (req.method === "GET") {
    await connectDB();

    try {
      const items = await Item.find(); // ดึงข้อมูลสินค้าทั้งหมดจาก MongoDB
      res.status(200).json({ items });
    } catch (error) {
      console.error("Error fetching items:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
