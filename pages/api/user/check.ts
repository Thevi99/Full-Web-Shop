import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

// ตรวจสอบว่า URI ของ MongoDB ถูกตั้งค่าใน .env หรือไม่
const uri = process.env.MONGODB_URI as string;
if (!uri) {
  throw new Error("❌ Please define the MONGODB_URI environment variable inside .env.local");
}

// สร้างตัวแปร client แบบ global เพื่อใช้ cache การเชื่อมต่อ
let client: MongoClient | null = null;

async function getClient() {
  if (client && client.topology && client.topology.isConnected()) {
    return client; // คืนค่า client ที่เชื่อมต่ออยู่แล้ว
  }

  console.log("🔄 Connecting to MongoDB...");
  client = new MongoClient(uri);
  await client.connect();
  console.log("✅ Connected to MongoDB");
  return client;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { discordId } = req.body;
  console.log("Received discordId in API:", discordId); // Debug log

  if (!discordId || typeof discordId !== "string") {
    return res.status(400).json({ error: "Discord ID is required" });
  }

  try {
    const client = await getClient(); // ใช้ฟังก์ชัน getClient ในการเชื่อมต่อ
    const db = client.db("test"); // ใช้ database "test"
    const user = await db.collection("users").findOne({ username: discordId });

    if (user) {
      console.log("User found:", user); // Debug log
      res.status(200).json({
        credits: user.credit || 0,
        rewards: user.reward || 0,
        role: user.role || "User", // ส่ง role กลับไปด้วย
      });
    } else {
      console.log("User not found");
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
