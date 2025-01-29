import connectDB from "../../../src/lib/mongo";
import Transaction from "../../../src/models/transactionModel";
import QRCODE from "../../../src/models/qrcodeModel";
import User from "../../../src/models/userModel";
import Message from "../../../src/models/MessageModel";
import axios from "axios";
const { format } = require("date-fns-tz");
export default async function handler(req, res) {
  await connectDB();
  if (req.method === "POST") {
    const { userId, ref } = req.body;
    if (!userId || !ref) {
      return res.status(400).json({
        message: "Missing user ID or Amount",
      });
    }
    try {
      // ค้นหา _id ของ User จาก username
      const user = await User.findOne({
        username: userId,
      });
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      user.credit = user.credit || 0;
      const timeZone = "Asia/Bangkok";
      const now = new Date();
      const formattedDate = format(now, "dd/MM/yyyy", {
        timeZone,
      });
      // Get Amount
      const amount = await QRCODE.findOne({
        ref: ref,
      });
      if (!amount) {
        return res.status(404).json({
          message: "ไม่พบข้อมูล!",
        });
      }
      const response = await axios.post(
        "http://localhost:1111/kbiz/v1/transaction",
        {
          amount: parseFloat(amount.amount),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status == true) {
        user.credit += parseFloat(amount.amount); // ใช้ฟิลด์ credit แทน credits
        await user.save();
        const newData = new Transaction({
          type: "Qrcode Bank",
          user: user._id,
          ref: ref,
          amount: parseFloat(amount.amount),
        });
        const msgCreate = await Message.create({
          title: "เติมเงินสำเร็จด้วยธนาคาร!",
          link: "/history/topup",
          description: `เติมเงินจำนวน ${parseFloat(amount.amount)} สำเร็จผ่านระบบธนาคาร คลิ๊กที่นี่เพื่อดูประวัติการทำรายการ!`,
          click: false,
          user: user._id,
        });
        await newData.save();
        return res.status(200).json({
          message: "เติมเงินจำนวน " + amount.amount + " สำเร็จ!",
          status: "success",
          totalCredits: user.credit,
        });
      } else {
        return res.status(200).json({
          message: "ไม่พบข้อมูล!",
          status: "error",
        });
      }
      //     const referenceCode = genRef(12);
      //     const results = response.data.data;
      //     const newData = new QRCODE({
      //       qrcode: results.qrcode,
      //       qrimg: results.img,
      //       ref: referenceCode,
      //       amount: parseFloat(newAmount),
      //       user: user._id,
      //     });
      //     await newData.save();
      //     res
      //       .status(201)
      //       .json({
      //         qrcode: results.img,
      //         ref: referenceCode,
      //         message: response.data.message,
      //       });
    } catch (error) {
      console.error("Error during top up:", error);
      if (error.response && error.response.data) {
        return res.status(400).json({
          message: error.response.data.message || "Top up failed",
        });
      }
      res.status(500).json({
        message: "Internal server error",
      });
    }
  } else {
    res.status(405).json({
      message: "Method not allowed",
    });
  }
}
