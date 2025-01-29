import connectDB from "../../../src/lib/mongo";
import Auth from "../../../src/models/authModel"; // Import Auth model

const resetIdentifier = async (req, res) => {
  try {
    const { userid } = req.body;

    if (!userid) {
      return res.status(400).json({ message: "User ID is required" });
    }
    
    const user = await Auth.findOne({ Client_ID: userid });
    

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.Cooldown > Date.now()) {
      const timeLeft = user.Cooldown - Date.now();
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      if (hours < 1) {
        const minutes = Math.floor(timeLeft / (1000 * 60));
        return res.status(400).json({ message: `You need to wait ${minutes} minutes` });
      }
      return res.status(400).json({ message: `You need to wait ${hours} hours` });
    }

    const cooldownDuration = 1 * 60 * 60 * 1000; // 1 hour cooldown
    user.Cooldown = Date.now() + cooldownDuration;

    // Reset Identifier and update Last_Identifier
    user.Last_Identifier = user.Identifier;
    user.Identifier = null;

    await user.save();

    res.status(200).json({ message: "HWID reset successfully, Identifier set to null" });
  } catch (error) {
    console.error("Error resetting HWID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    await connectDB();
    await resetIdentifier(req, res);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
