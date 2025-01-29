import connectDB from "../../../src/lib/mongo";
import ConfigSetting from "../../../src/models/configsettingModel";
import multer from "multer";
import path from "path";
import fs from "fs";

// กำหนดที่จัดเก็บไฟล์
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
        // อนุญาตให้อัพโหลดไฟล์สองฟิลด์คือ "logo" และ "video"
        upload.fields([
            { name: "logo", maxCount: 1 },
            { name: "video", maxCount: 1 },
        ])(req, res, async (err) => {
            if (err) {
                console.error("Error during file upload:", err);
                return res.status(500).json({
                    message: "เกิดข้อผิดพลาดในการอัพโหลดไฟล์",
                });
            }

            // ดึงข้อมูลที่ไม่ใช่ไฟล์จาก form
            const { title, description, faqyt, wallet, bank } = req.body;

            if (!title || !description || !faqyt || !wallet || !bank) {
                return res.status(400).json({
                    message: "Missing required fields",
                });
            }

            

            // เก็บข้อมูลลงในฐานข้อมูล (ตัวอย่าง ConfigSetting)
            try {
                const data = await ConfigSetting.findOne();
                data.title = title
                data.description = description
                data.faqyt = faqyt
                data.wallet = wallet
                data.bank = bank
                const files = req.files;
                if(files?.logo){
                    const logoPath = files?.logo ? `/uploads/${files.logo[0].filename}` : null;
                    if (logoPath) {
                        data.logo = logoPath
                    }
                } else if(files?.video){
                    const videoPath = files?.video ? `/uploads/${files.video[0].filename}` : null;
                    if (videoPath) {
                        data.video = videoPath
                    }
                }
                await data.save();
                return res.status(201).json({
                    message: "อัพโหลดไฟล์สำเร็จ",
                });
            } catch (dbError) {
                console.error("Database error:", dbError);
                return res.status(500).json({
                    message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
                });
            }
        });
    } else if (req.method === "GET") {
        const data = await ConfigSetting.findOne();
        return res.status(200).json({
            DataTarget: data,
        });
    } else {
        res.status(405).json({
            message: "Method not allowed",
        });
    }
};

export default handler;
