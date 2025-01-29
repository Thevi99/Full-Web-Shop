import connectDB from "../../src/lib/mongo";
import Payment from "../../src/models/transactionModel";
import User from "../../src/models/userModel";
import PhoneSetting from "../../src/models/phoneSettingModel"; // Import phone setting model
import axios from "axios";
import FormData from "form-data";
import Message from "../../../src/models/MessageModel";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    const { userId, voucherCode } = req.body;

    if (!userId || !voucherCode) {
      return res.status(400).json({ message: "Missing user ID or voucher code" });
    }

    try {
      // ค้นหา _id ของ User จาก username
      const user = await User.findOne({ username: userId });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // ตรวจสอบและกำหนดค่าเริ่มต้นให้ credit ถ้ามีค่าเป็น null
      user.credit = user.credit || 0;

      // แยกเอาโค้ดจากลิงก์ TrueMoney
      const detailMatch = voucherCode.match(/v=([A-Za-z0-9]+)/);
      if (!detailMatch) {
        return res.status(400).json({ message: "Invalid TrueMoney voucher link" });
      }
      const detail = detailMatch[1];

      // ดึงเบอร์โทรศัพท์จากฐานข้อมูล
      const setting = await PhoneSetting.findOne();
      const receiverPhone = setting ? setting.phone : "0886044010"; // ถ้าไม่มีเบอร์ในฐานข้อมูล ให้ใช้ค่าเริ่มต้น

      // สร้าง form-data สำหรับส่งค่าไปยัง API
      const formData = new FormData();
      formData.append("phone", receiverPhone);
      formData.append("gift_link", `https://gift.truemoney.com/campaign/?v=${detail}`);

      const truemoneyResponse = await axios.post(
        "https://byshop.me/api/truewallet",
        formData,
        {
          headers: formData.getHeaders(),
        }
      );

      console.log("TrueMoney API Response:", truemoneyResponse.data);
      const { amount, status, message } = truemoneyResponse.data;

      if (status !== "success") {
        return res.status(400).json({ message: message || "Top up failed, please try again" });
      }

      // อัปเดตเครดิตรวมของ User
      user.credit += parseFloat(amount); // ใช้ฟิลด์ credit แทน credits
      await user.save();
      const msgCreate = await Message.create({
        title: "เติมเงินสำเร็จด้วย True Wallet!",
        link: "/history/topup",
        description: `เติมเงินจำนวน ${parseFloat(amount)} สำเร็จผ่านระบบTrue Wallet คลิ๊กที่นี่เพื่อดูประวัติการทำรายการ!`,
        click: false,
        user: user._id,
      });
      const newPayment = new Payment({
        type: "True Wallet",
        user: user._id, // ใช้ _id ของ User ที่ค้นเจอ
        ref: detail,
        amount: parseFloat(amount),
      });

      await newPayment.save();
      res.status(201).json({ message: "Top up successful", totalCredits: user.credit });
    } catch (error) {
      console.error("Error during top up:", error);
      if (error.response && error.response.data) {
        return res.status(400).json({ message: error.response.data.message || "Top up failed" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
