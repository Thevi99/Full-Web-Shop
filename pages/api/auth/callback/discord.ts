import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";
import axios from "axios";
import User from "../../../../src/models/userModel";

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "No authorization code provided" });
  }

  try {
    // แลกเปลี่ยน code กับ access token
    const tokenResponse = await axios.post(
      "https://discord.com/api/oauth2/token",
      new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        grant_type: "authorization_code",
        code: code as string,
        redirect_uri: process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI!,
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const { access_token } = tokenResponse.data;

    // ดึงข้อมูลผู้ใช้จาก Discord
    const userResponse = await axios.get("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const discordUser = userResponse.data;
    const discordId = discordUser.id;
    const username = discordUser.username;
    const avatarUrl = discordUser.avatar
      ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
      : "/default-avatar.png";

    // เชื่อมต่อกับ MongoDB
    await client.connect();
    const db = client.db("test");
    const usersCollection = db.collection("users");

    // ตรวจสอบว่าผู้ใช้มีอยู่ใน MongoDB หรือไม่
    const existingUser = await usersCollection.findOne({ username: `dc_${discordId}` });

    if (!existingUser) {
      // ถ้าไม่มีผู้ใช้ ให้สร้างเอกสารใหม่ใน MongoDB
      await usersCollection.insertOne({
        username: `dc_${discordId}`,
        nickname: username || "Unknown",
        email: discordUser.email || null, 
        provider: "discord",
        avatar: avatarUrl,
        role: "User", 
        credit: 0, 
        reward: 0, 
        banned: false, 
        private: true, 
        ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress || "unknown", 
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log("New user inserted:", `dc_${discordId}`);
    } else {
      // ถ้ามีผู้ใช้ ให้ทำการอัปเดตข้อมูลล่าสุด
      await usersCollection.updateOne(
        { username: `dc_${discordId}` },
        { $set: { nickname: username, avatar: avatarUrl } }
      );
      console.log("Existing user updated:", `dc_${discordId}`);
    }

    // Redirect กลับไปหน้าเว็บพร้อมส่งข้อมูลผ่าน Query String
  // หลังจากที่ redirect สำเร็จแล้ว เพิ่มการเก็บข้อมูล nickname
  res.redirect(
    `/?id=${discordId}&username=${encodeURIComponent(
      `dc_${discordId}`
    )}&avatar=${encodeURIComponent(avatarUrl)}&nickname=${encodeURIComponent(username)}`
  );  


  } catch (error) {
    console.error("Error during Discord OAuth:", error);
    res.status(500).json({ error: "Failed to authenticate with Discord" });
  }
}
