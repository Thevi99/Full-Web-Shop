import Message from "../../src/models/MessageModel";
import mongoose from "mongoose";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function getClient() {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
  }
  return client;
}

export default async function handler(req, res) {
  try {
    const mongoClient = await getClient();
    const db = mongoClient.db("test");

    if (req.method === "POST") {
      const { daataid } = req.body;

      // ตรวจสอบว่ามี `daataid` ใน request body
      if (!daataid) {
        return res
          .status(400)
          .json({ error: "Missing 'daataid' in request body" });
      }

      // ค้นหา User ที่มี username ตรงกับ `daataid`
      const user = await db.collection("users").findOne({ username: daataid });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // ดึงข้อความจาก Message collection ที่ตรงกับ user._id
      const Msgdata = await Message.find({
        user: new mongoose.Types.ObjectId(user._id),
      });

      return res.status(200).json({ Msgdata });
    } else if (req.method === "GET") {
      const { id } = req.query;

      // ตรวจสอบว่า id ถูกส่งมา
      if (!id) {
        return res.status(400).json({ error: "Missing 'id' in request query" });
      }

      // ค้นหา Message โดย `_id`
      const Msgdata = await Message.findById(id);

      if (!Msgdata) {
        return res.status(404).json({
          message: "ไม่พบ Inbox ที่ต้องการ",
        });
      }

      // อัปเดตสถานะ `click` และบันทึก
      Msgdata.click = true;
      await Msgdata.save();

      return res.status(200).json({
        status: true,
        message: "Inbox updated successfully",
      });
    } else {
      return res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error in handler:", error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}
