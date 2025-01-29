// pages/api/store/history.js
import connectDB from "../../../src/lib/mongo";
import History from "../../../src/models/transactionModel";
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

      const historyData = await History.find({ user: new mongoose.Types.ObjectId(user._id) });

      return res.status(200).json({ historyData });
    } else {
      return res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error in handler:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
