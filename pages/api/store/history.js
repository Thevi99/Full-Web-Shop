import connectDB from "../../../src/lib/mongo";
import History from "../../../src/models/historyModel";
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
    // ใช้ฟังก์ชัน getClient เพื่อจัดการ connection pool
    const mongoClient = await getClient();

    if (req.method === "POST") {
      const { daataid } = req.body;

      if (!daataid) {
        return res.status(400).json({ error: "Missing 'daataid' in request body" });
      }

      const db = mongoClient.db("test");
      const user = await db.collection("users").findOne({ username: daataid });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const historyData = await History.find({ userId: new mongoose.Types.ObjectId(user._id) });

      return res.status(200).json({ historyData });
    } else if (req.method === "GET") {
      const { userId } = req.query; // ดึง `userId` จาก query parameter

      const db = mongoClient.db("test");

      if (userId) {
        // ดึงข้อมูล history ตาม userId
        const historyData = await History.find({
          userId: new mongoose.Types.ObjectId(userId),
        });

        if (!historyData || historyData.length === 0) {
          return res.status(404).json({ error: "No history found for this user" });
        }

        return res.status(200).json({ historyData });
      } else {
        // ดึงข้อมูล history ทั้งหมด (ระวังเรื่อง performance หากมีข้อมูลมาก)
        const allHistory = await History.find({});
        return res.status(200).json({ allHistory });
      }
    } else {
      return res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error in handler:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
