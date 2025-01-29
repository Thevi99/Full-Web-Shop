import connectDB from "../../src/lib/mongo";
import PhoneSetting from "../../src/models/phoneSettingModel"; // สร้าง model ใหม่สำหรับเก็บเบอร์โทรศัพท์

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Missing phone number" });
    }

    try {
      // ค้นหาและอัปเดตเบอร์โทรศัพท์
      let setting = await PhoneSetting.findOne();
      if (!setting) {
        setting = new PhoneSetting({ phone });
      } else {
        setting.phone = phone;
      }
      await setting.save();

      res.status(200).json({ message: "Phone number updated successfully", phone });
    } catch (error) {
      console.error("Error updating phone number:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
