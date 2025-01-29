import { generateLicenseKey } from "../../../src/lib/licenseController";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const result = await generateLicenseKey(req, res);

      // ตรวจสอบว่ามี licenseKeys ถูกสร้าง
      if (result.licenseKeys && result.licenseKeys.length > 0) {
        // สร้างไฟล์ .txt
        const filePath = path.join(process.cwd(), "generated_license_keys.txt");
        const fileContent = result.licenseKeys.join("\n"); // รวม keys เป็นเนื้อหาของไฟล์

        // เขียนเนื้อหาลงในไฟล์
        fs.writeFileSync(filePath, fileContent, "utf8");

        // ส่งไฟล์ให้ client ดาวน์โหลด
        res.status(200).json({
          message: "License Keys Generated Successfully",
          licenseKeys: result.licenseKeys, // ส่งกลับข้อมูล licenseKeys
        });
      } else {
        res.status(400).json({ message: "Error generating keys" });
      }
    } catch (error) {
      console.error("Error in generateLicenseKey:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
