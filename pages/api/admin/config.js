import connectDB from "../../../src/lib/mongo";
import ConfigSetting from "../../../src/models/configsettingModel";

export default async function handler(req, res) {
  if (req.method === "POST") {
    await connectDB();
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "กรุณากรอกคำถามและคำตอบ" });
    }
    try {
        const newData = new ConfigSetting({
            name,
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
  } else if(req.method === "GET") {
    await connectDB();
    const DataTarget = await ConfigSetting.find();
    return res.status(200).json({ DataTarget });
  }else if(req.method === "GET") {
    await connectDB();
    const DataTarget = await ConfigSetting.find();
    return res.status(200).json({ DataTarget });
  }  else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
