import connectDB from "../../../src/lib/mongo";
import User from "../../../src/models/userModel";

export default async function handler(req, res) {
if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
}

await connectDB();

const { discordId } = req.body; // รับ discordId จาก body

if (!discordId) {
    return res.status(400).json({ message: "Discord ID is required" });
}

const user = await User.findOne({ username: `dc_${discordId}` }); // ค้นหาจาก Discord ID ที่มี prefix "dc_"

if (!user) {
    return res.status(404).json({ message: "User not found" });
}

if (user.role !== "Admin") {
    return res.status(403).json({ message: `Access denied ${user.role}` });
}

res.status(200).json({ message: "Access granted", user });
}
