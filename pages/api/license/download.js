import { downloadFile } from "../../../src/lib/licenseController"; // ตรวจสอบ path ให้ถูกต้อง

export default async function handler(req, res) {
  if (req.method === "GET") {
    await downloadFile(req, res); // เรียกใช้ฟังก์ชันดาวน์โหลดไฟล์
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
