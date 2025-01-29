import connectDB from "../../../src/lib/mongo";
import ScriptStatus from "../../../src/models/scriptstatusModel";

export default async function handler(req, res) {
  if (req.method === "POST") {
    await connectDB();
    const { name, status, detail } = req.body;
    if (!name || !status || !detail) {
      return res.status(400).json({ message: "กรุณากรอกคำถามและคำตอบ" });
    }
    try {
        const newData = new ScriptStatus({
            name,
            status,
            detail
        });
        await newData.save();
        return res.status(201).json({
          message: "successfully"
        });
    //   const items = await FAQ.find(); // ดึงข้อมูลสินค้าทั้งหมดจาก MongoDB
    //   res.status(200).json({ items });
    } catch (error) {
      console.error("Error fetching items:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else if (req.method === "GET") {
    try {
      const DataTarget = await ScriptStatus.find();
      return res.status(200).json({ DataTarget });
    } catch (error) {
      console.error("Error fetching scriptstatus:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else if(req.method === "PUT") {
    await connectDB();
    const { id } = req.query;
    const { name, status, detail } = req.body;
    try {
        const updateData = await ScriptStatus.findByIdAndUpdate(id, { name, status, detail }, { new: true });
        return res.status(200).json({ updateData });
    } catch (error) {
        console.error("Error updating scriptstatus:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
  } else if(req.method === "DELETE") {
    await connectDB();
    const { id } = req.query;
    try {
        await ScriptStatus.findByIdAndDelete(id);
        return res.status(200).json({ message: "Delete successfully" });
    } catch (error) {
        console.error("Error deleting scriptstatus:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
