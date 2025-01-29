import connectDB from "../../src/lib/mongo";
import Item from "../../src/models/itemModel";
import User from "../../src/models/userModel";
import History from "../../src/models/historyModel";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { itemId, quantity } = req.body;

    try {
      await connectDB();

      // ดึงข้อมูลสินค้า
      const item = await Item.findById(itemId);
      if (!item || item.datas.length < quantity) {
        return res
          .status(400)
          .json({ message: "จำนวนสินค้าไม่เพียงพอ" });
      }

      // ดึงข้อมูลผู้ใช้
      const user = await User.findById(req.userId); 
      const totalPrice = item.price * quantity;

      if (user.credits < totalPrice) {
        return res
          .status(400)
          .json({ message: "เครดิตไม่เพียงพอ" });
      }

      // ตัดเครดิตของผู้ใช้
      user.credits -= totalPrice;

      // ตัด key ออกจากสินค้า
      const purchasedKeys = item.datas.splice(0, quantity);
      await item.save();

      // บันทึกประวัติการซื้อ
      const newHistory = new History({
        userId: user._id,
        name: item.title,
        data: purchasedKeys.join(", "), // รวม key ที่ซื้อเป็น string
        price: totalPrice,
        currency: "THB", // สกุลเงิน THB
        status: "สำเร็จ",
        paymentMethod: "wallet", // ชำระผ่าน wallet
        transactionId: `TXN${Date.now()}`, // สร้าง transactionId
        metadata: {
          categoryId: item.categoryId.toString(), // เก็บ categoryId ใน metadata
        },
      });
      await newHistory.save();

      // บันทึกเครดิตใหม่ของผู้ใช้
      await user.save();

      res.status(200).json({ message: "Purchase successful" });
    } catch (error) {
      console.error("Error processing purchase:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
