import multer from "multer";
import path from "path";
import fs from "fs";
import connectDB from "../../../src/lib/mongo";
import Category from "../../../src/models/categoryModel";

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
      const {
        categoryName,
        description
      } = req.body;

      if (!categoryName || !description) {
        return res.status(400).json({
          message: "กรุณากรอกข้อมูลทั้งหมด",
        });
      }

      // ตรวจสอบว่าอัพโหลดไฟล์สำเร็จหรือไม่
      const uploadedFile = req.file;
      if (uploadedFile) {
        const filePath = `/uploads/${uploadedFile.filename}`;

        // สร้างฟีเจอร์ใหม่และบันทึกข้อมูลลง MongoDB
        const newCategory = new Category({
          categoryName,
          description,
          imageUrl: filePath,
        });
        await newCategory.save();
        return res.status(201).json({
          message: "Category added successfully",
        });
      } else {
        return res.status(400).json({
          message: "ไม่พบไฟล์ที่อัพโหลด",
        });
      }
    });
  }
  if (req.method === "GET") {
    try {
      const categories = await Category.find();
      return res.status(200).json({
        categories,
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
  if (req.method === "PUT") {
    upload.single("file")(req, res, async (err) => {
      if (err) {
        console.error("Error during file upload:", err);
        return res.status(500).json({
          message: "เกิดข้อผิดพลาดในการอัพโหลดไฟล์",
        });
      }

      const {
        id
      } = req.query; // รับ ID ของหมวดหมู่ที่ต้องการอัพเดต
      const {
        categoryName,
        description
      } = req.body;

      if (!id || !categoryName || !description) {
        return res.status(400).json({
          message: "กรุณากรอกข้อมูลทั้งหมด",
        });
      }

      try {
        // ค้นหาหมวดหมู่ที่ต้องการอัพเดต
        const category = await Category.findById(id);
        if (!category) {
          return res.status(404).json({
            message: "ไม่พบหมวดหมู่ที่ต้องการอัพเดต",
          });
        }

        // อัปเดตข้อมูลที่ไม่ใช่ไฟล์
        category.categoryName = categoryName;
        category.description = description;

        // ถ้ามีการอัพโหลดไฟล์ใหม่
        if (req.file) {
          const filePath = `/uploads/${req.file.filename}`;
          category.imageUrl = filePath;
        }

        // บันทึกการเปลี่ยนแปลงใน MongoDB
        await category.save();

        return res.status(200).json({
          message: "อัพเดตหมวดหมู่สำเร็จ",
          category,
        });
      } catch (error) {
        console.error("Error updating category:", error);
        return res.status(500).json({
          message: "เกิดข้อผิดพลาดในการอัพเดตหมวดหมู่",
        });
      }
    });
  }
  if (req.method === "DELETE") {
    const {
      id
    } = req.query;
    await Category.findByIdAndDelete(id);
    return res.status(200).json({
      message: "Category deleted successfully"
    });
  }
};

export default handler;
// export default async function handler(req, res) {
//   await connectDB();

//   if (req.method === "POST") {
//     const { categoryName, description, imageUrl } = req.body;

//     if (!categoryName) {
//       return res.status(400).json({ message: "Category name is required" });
//     }

//     try {
//       const newCategory = new Category({ categoryName, description, imageUrl });
//       await newCategory.save();
//       return res.status(201).json({ message: "Category added successfully" });
//     } catch (error) {
//       console.error("Error creating category:", error);
//       return res.status(500).json({ message: "Internal Server Error" });
//     }
//   }

//   if (req.method === "GET") {
//     try {
//       const categories = await Category.find();
//       return res.status(200).json({ categories });
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//       return res.status(500).json({ message: "Internal Server Error" });
//     }
//   }

//   res.status(405).json({ message: "Method not allowed" });
// }