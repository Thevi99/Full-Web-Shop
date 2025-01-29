import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

// const uri = "mongodb+srv://DynamicTracker:2fHmALv9637JmfrR@cluster0.dozhq.mongodb.net/"; // ใช้ URI ของ MongoDB 
const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username } = req.query;

  if (!username || typeof username !== "string") {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    await client.connect();
    const db = client.db("test"); // ชื่อ database ของคุณ
    const user = await db.collection("users").findOne({ username });

    if (user) {
      res.status(200).json({ exists: true });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await client.close();
  }
}
