import connectDB from "../../../src/lib/mongo";
import QRCODE from "../../../src/models/qrcodeModel";
import User from "../../../src/models/userModel";
import axios from "axios";
import FormData from "form-data";
const crypto = require("crypto");
function getRandomFraction(amount) {
  // สุ่มตัวเลขระหว่าง 1 ถึง 99
  const fraction = Math.random() * (99 - 1 + 1) + 1;
  // แปลงให้เป็นเศษโดยหารด้วย 100
  const randomFraction = fraction / 100;
  // รวมค่ากับจำนวนที่กำหนด
  const randomAmount = amount + randomFraction;
  // แปลงเป็นทศนิยม 2 ตำแหน่ง
  return randomAmount.toFixed(2);
}

function genRef(length = 10) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let ref = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, characters.length);
    ref += characters[randomIndex];
  }
  return ref;
}

export default async function handler(req, res) {
  await connectDB();
  if (req.method === "POST") {
    const { userId, amount } = req.body;
    if (!userId || !amount) {
      return res.status(400).json({ message: "Missing user ID or Amount" });
    }
    try {
      // ค้นหา _id ของ User จาก username
      const user = await User.findOne({ username: userId });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // สร้าง form-data สำหรับส่งค่าไปยัง API
      const newAmount = getRandomFraction(Number(amount));
      const formData = new FormData();
      console.log(parseFloat(newAmount));
      const response = await axios.post(
        "http://localhost:1111/kbiz/v0/qrgen",
        { amount: parseFloat(newAmount) },
        { headers: { "Content-Type": "application/json" } }
    );
    

      if (response.data) {
        const referenceCode = genRef(12);
        const results = response.data.data;
        const newData = new QRCODE({
          qrcode: results.qrcode,
          qrimg: results.img,
          ref: referenceCode,
          amount: parseFloat(newAmount),
          user: user._id,
        });
        await newData.save();
        res
          .status(201)
          .json({
            qrcode: results.img,
            ref: referenceCode,
            message: response.data.message,
          });
      } else {
        return res.status(404).json({ message: "ไม่พบข้อมูล!" });
      }
    } catch (error) {
      console.error("Error during top up:", error);
      if (error.response && error.response.data) {
        return res
          .status(400)
          .json({ message: error.response.data.message || "Top up failed" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
