// pages/api/auth/login.js
import jwt from "jsonwebtoken";
import dbConnect from "../../../src/lib/mongo";
import User from "../../../src/models/userModel";

const fetchDiscordUser = async (code) => {
    const tokenResponse = await axios.post(
      "https://discord.com/api/oauth2/token",
      new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI,
      }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
  
    const { access_token } = tokenResponse.data;
  
    const userResponse = await axios.get("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
  
    return userResponse.data; // Return Discord user data
  };

  
export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }
  
    const { code } = req.body;
  
    if (!code) {
      return res.status(400).json({ message: "Authorization code is required" });
    }
  
    try {
      await dbConnect();
  
      const discordUser = await fetchDiscordUser(code);
      const { id: discordId, username } = discordUser;
  
      let user = await User.findOne({ username: `dc_${discordId}` });
  
      if (!user) {
        user = new User({
          username: `dc_${discordId}`,
          nickname: username,
          provider: "discord",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
  
        await user.save();
      }
  
      const token = jwt.sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      res.status(200).json({ token, user });
    } catch (err) {
      console.error("Error during login:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  
