import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dbConnect from '../../../../src/lib/mongo';
import Features from '../../../../src/models/featuresModel';

// กำหนดที่เก็บไฟล์ด้วย multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, {
        recursive: true
      });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage
});

export const config = {
  api: {
    bodyParser: false, // ปิดการใช้งาน bodyParser ของ Next.js เพื่อให้ multer จัดการ
  },
};

const handler = async (req, res) => {
  await dbConnect();

  if (req.method === "POST") {
    // ใช้ multer เพื่อจัดการการอัพโหลดไฟล์
    upload.single('file')(req, res, async (err) => {
      if (err) {
        console.error("Error during file upload:", err);
        return res.status(500).json({
          message: "เกิดข้อผิดพลาดในการอัพโหลดไฟล์"
        });
      }

      // ดึงข้อมูลที่ไม่ใช่ไฟล์จาก form
      const {
        featuresName,
        linkk
      } = req.body;

      if (!featuresName || !linkk) {
        return res.status(400).json({
          message: "กรุณากรอกข้อมูลทั้งหมด"
        });
      }

      // ตรวจสอบว่าอัพโหลดไฟล์สำเร็จหรือไม่
      const uploadedFile = req.file;
      if (uploadedFile) {
        const filePath = `/uploads/${uploadedFile.filename}`;

        // สร้างฟีเจอร์ใหม่และบันทึกข้อมูลลง MongoDB
        const newFeature = new Features({
          title: featuresName,
          image: filePath,
          link: linkk
        });
        await newFeature.save();

        return res.status(200).json({
          message: "อัพโหลดไฟล์สำเร็จ",
          filePath: filePath
        });
      } else {
        return res.status(400).json({
          message: "ไม่พบไฟล์ที่อัพโหลด"
        });
      }
    });
  } else if (req.method === "GET") {
    const DataTarget = await Features.find();
    return res.status(200).json({
      DataTarget
    });
  } else if (req.method === "DELETE") {
    const {
      id
    } = req.query;
    try {
      await Features.findByIdAndDelete(id);
      return res.status(200).json({
        message: "Deleted successfully"
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error"
      });
    }
  } else if (req.method === "PUT") {
    upload.single("file")(req, res, async (err) => {
      if (err) {
        console.error("Error during file upload:", err);
        return res.status(500).json({
          message: "เกิดข้อผิดพลาดในการอัพโหลดไฟล์",
        });

      }

      const {
        id
      } = req.query;
      const {
        title,
        link
      } = req.body;

      if (!id || !title || !link) {
        return res.status(400).json({
          message: "กรุณากรอกข้อมูลทั้งหมด",
        });
      }

      try {
        // ค้นหาหมวดหมู่ที่ต้องการอัพเดต
        const newdata = await Features.findById(id);
        if (!newdata) {
          return res.status(404).json({
            message: "ไม่พบหมวดหมู่ที่ต้องการอัพเดต",
          });
        }

        // อัปเดตข้อมูลที่ไม่ใช่ไฟล์
        newdata.title = title;
        newdata.link = link;

        // ถ้ามีการอัพโหลดไฟล์ใหม่
        if (req.file) {
          const filePath = `/uploads/${req.file.filename}`;
          newdata.image = filePath;
        }

        await newdata.save();

        return res.status(200).json({
          message: "อัพเดตหมวดหมู่สำเร็จ",
          newdata,
        });
      } catch (error) {
        console.error("Error updating category:", error);
        return res.status(500).json({
          message: "เกิดข้อผิดพลาดในการอัพเดตหมวดหมู่",
        });
      }
    });
  } else {
    return res.status(405).json({
      message: "Method Not Allowed"
    });
  }
};

export default handler;