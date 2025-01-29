import multer from "multer";
import path from "path";
import fs from "fs";
import connectDB from "../../../src/lib/mongo";
import Item from "../../../src/models/itemModel";
import { motion } from "framer-motion";
import { Calendar, DollarSign, Clock, Package } from "lucide-react";
import mongoose from "mongoose";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, {
        recursive: true,
      });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
});

export const config = {
  api: {
    bodyParser: false, // ปิดการใช้งาน bodyParser ของ Next.js เพื่อให้ multer จัดการ
  },
};
const handler = async (req, res) => {
  await connectDB();

  if (req.method === "POST") {
    // ใช้ multer เพื่อจัดการการอัพโหลดไฟล์
    upload.single("file")(req, res, async (err) => {
      if (err) {
        console.error("Error during file upload:", err);
        return res.status(500).json({
          message: "เกิดข้อผิดพลาดในการอัพโหลดไฟล์",
        });
      }

      // ดึงข้อมูลที่ไม่ใช่ไฟล์จาก form
      const { title, description, datas, price, discount, categoryId } =
        req.body;

      if (
        !title ||
        !description ||
        !datas ||
        !price ||
        !discount ||
        !categoryId
      ) {
        return res.status(400).json({
          message: "กรุณากรอกข้อมูลทั้งหมด",
        });
      }

      // ตรวจสอบว่าอัพโหลดไฟล์สำเร็จหรือไม่
      const uploadedFile = req.file;
      if (uploadedFile) {
        const filePath = `/uploads/${uploadedFile.filename}`;

        // สร้างฟีเจอร์ใหม่และบันทึกข้อมูลลง MongoDB
        const newItem = new Item({
          title,
          description,
          datas,
          price,
          discount: discount || 0,
          categoryId,
          image: filePath,
        });
        await newItem.save();
        return res.status(201).json({
          message: "Item added successfully",
        });
      } else {
        return res.status(400).json({
          message: "ไม่พบไฟล์ที่อัพโหลด",
        });
      }
    });
  } else if (req.method === "PUT") {
    upload.single("file")(req, res, async (err) => {
      if (err) {
        console.error("Error during file upload:", err);
        return res.status(500).json({
          message: "เกิดข้อผิดพลาดในการอัพโหลดไฟล์",
        });
      }

      const { id } = req.query; // รับ ID ของหมวดหมู่ที่ต้องการอัพเดต
      const { title, description, price, discount, categoryId } =
        req.body;
      if (!title || !description || !price || !discount || !categoryId) {
        return res.status(400).json({
          message: "กรุณากรอกข้อมูลทั้งหมด",
        });
      }

      try {
        // ค้นหาหมวดหมู่ที่ต้องการอัพเดต
        const data = await Item.findById(id);
        if (!data) {
          return res.status(404).json({
            message: "ไม่พบหมวดหมู่ที่ต้องการอัพเดต",
          });
        }

        // อัปเดตข้อมูลที่ไม่ใช่ไฟล์
        data.title = title;
        data.description = description;
        data.price = price;
        data.discount = discount;
        data.categoryId = categoryId;


        // ถ้ามีการอัพโหลดไฟล์ใหม่
        if (req.file) {
          const filePath = `/uploads/${req.file.filename}`;
          data.image = filePath;
        }

        // บันทึกการเปลี่ยนแปลงใน MongoDB
        await data.save();

        return res.status(200).json({
          message: "อัพเดตสำเร็จ",
          data,
        });
      } catch (error) {
        console.error("Error updating category:", error);
        return res.status(500).json({
          message: "เกิดข้อผิดพลาดในการอัพเดตหมวดหมู่",
        });
      }
    });
  } else if (req.method === "GET") {
    const { categoryId } = req.query;
    if(categoryId) {
      try {
        // const filter = categoryId
        //   ? { categoryId: new mongoose.Types.ObjectId(categoryId) }
        //   : {}; // แก้ไข filter
        const items = await Item.find({
          categoryId: new mongoose.Types.ObjectId(categoryId)
        });
        res.status(200).json({ items });
      } catch (error) {
        console.error("Error fetching items:", error.message);
        res
          .status(500)
          .json({ message: "Failed to fetch items", error: error.message });
      }
    } else {
      try {
        // const filter = categoryId
        //   ? { categoryId: new mongoose.Types.ObjectId(categoryId) }
        //   : {}; // แก้ไข filter
        const items = await Item.find({});
        res.status(200).json({ items });
      } catch (error) {
        console.error("Error fetching items:", error.message);
        res
          .status(500)
          .json({ message: "Failed to fetch items", error: error.message });
      }
    }
  } else if (req.method === "DELETE") {
    const { id } = req.query;
    await Item.findByIdAndDelete(id);
    res.status(200).json({ message: "ลบสินค้าสำเร็จ" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
// export default async function handler(req, res) {
//   await connectDB(); // เชื่อมต่อกับ MongoDB

//   if (req.method === "POST") {
//     try {
//       const { title, description, datas, price, discount, categoryId, image, note } = req.body;

//       // ตรวจสอบฟิลด์ที่จำเป็น
//       if (!title || !price || !categoryId || !image || !Array.isArray(datas)) {
//         return res
//           .status(400)
//           .json({ message: "All required fields must be provided and datas must be an array" });
//       }

//       const newItem = new Item({
//         title,
//         description,
//         datas,
//         price,
//         discount: discount || 0, // หากไม่มี discount ให้ใช้ค่าเริ่มต้นเป็น 0
//         categoryId,
//         image,
//         note,
//       });

//       await newItem.save();
//       res.status(201).json({ message: "Item added successfully", item: newItem });
//     } catch (error) {
//       console.error("Error adding item:", error); // Log ข้อผิดพลาดใน console
//       res
//         .status(500)
//         .json({ message: "Internal server error", error: error.message || "Unknown error" });
//     }
//   } else if (req.method === "GET") {
//     const { categoryId } = req.query;

//     try {
//       const filter = categoryId ? { categoryId: new mongoose.Types.ObjectId(categoryId) } : {}; // แก้ไข filter
//       const items = await Item.find(filter);
//       res.status(200).json({ items });
//     } catch (error) {
//       console.error("Error fetching items:", error.message);
//       res.status(500).json({ message: "Failed to fetch items", error: error.message });
//     }
//   } else {
//     res.status(405).json({ message: "Method not allowed" });
//   }
// }
