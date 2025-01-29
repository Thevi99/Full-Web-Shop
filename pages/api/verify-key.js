import connectDB from "../../src/lib/mongo";
import Auth from "../../src/models/authModel";
import config from "../../src/config.json";
import { createCipheriv, createDecipheriv } from "crypto";

const key = Buffer.from("648d9439a3b189fb8d4c5fa784d67f18f5e514c097faac15e7c1f6b2cc9e17e0", "hex");
const iv = Buffer.from("a592e47ab84ad06369c9d929", "hex");

// ฟังก์ชันเข้ารหัส AES-256-GCM
function encrypt(data) {
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  let encryptedData = cipher.update(data, "utf8", "hex");
  encryptedData += cipher.final("hex");
  const tag = cipher.getAuthTag().toString("hex");
  return { encryptedData, tag };
}

// ฟังก์ชันถอดรหัส AES-256-GCM
function decrypt(encryptedData, tag) {
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(Buffer.from(tag, "hex"));
  let decryptedData = decipher.update(encryptedData, "hex", "utf8");
  decryptedData += decipher.final("utf8");
  return decryptedData;
}

// ฟังก์ชันดึง HWID จาก headers
function getHWID(requestHeaders) {
  console.log("Received Headers:", requestHeaders); // เพิ่ม Log Headers ที่ได้รับทั้งหมด

  const hwidHeaders = [
    "valyse-fingerprint", "sirhurt-fingerprint", "sw-fingerprint", "bark-fingerprint",
    "delta-fingerprint", "comet-fingerprint", "evon-fingerprint", "trigon-fingerprint",
    "oxy-fingerprint", "wrd-fingerprint", "flux-fingerprint", "syn-fingerprint",
    "krnl-hwid", "sentinel-fingerprint", "electronid", "seriality-identifier",
    "hydrogen-fingerprint", "codex-fingerprint", "krampus-fingerprint",
    "vegax-fingerprint", "arceus-fingerprint", "wave-fingerprint"
  ];

  // ตรวจสอบ header ทั้งหมด และ log ว่าพบ HWID ใดบ้าง
  for (const header of hwidHeaders) {
    if (requestHeaders[header]) {
      console.log(`Found HWID in header: ${header}, Value: ${requestHeaders[header]}`);
      return { success: true, hwid: requestHeaders[header], executor: header };
    }
  }

  console.log("No HWID found in the provided headers."); // เพิ่ม Log กรณีไม่พบ HWID
  return { success: false, hwid: null, executor: null };
}


// ฟังก์ชัน xorStrings สำหรับการแปลงข้อมูล
function xorStrings(str1) {
  const secretKey = 'secretlilbro';
  let result = '';
  for (let i = 0; i < str1.length; i++) {
    const charCode1 = str1.charCodeAt(i);
    const charCode2 = secretKey.charCodeAt(i % secretKey.length);
    const xoredCharCode = charCode1 ^ charCode2;
    result += String.fromCharCode(xoredCharCode);
  }
  return result;
}

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    try {
      const { scriptName, License } = req.body;

      if (!scriptName || !License) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Log รายการ script ทั้งหมดใน config.json
      console.log("Available scripts:", config.games.map((game) => game.name));

      // Log ค่าที่รับจาก client
      console.log("Received scriptName:", scriptName);

      const hwidResult = getHWID(req.headers);
      if (!hwidResult.success) {
        return res.status(400).json({ message: "No HWID found" });
      }

      // แยก License และ Tag
      const newLicense = {
        License: License.split(":")[0],
        Tag: License.split(":")[1],
      };

      // ถอดรหัส License
      const decryptedLicense = decrypt(newLicense.License, newLicense.Tag);
      console.log("Decrypted License:", decryptedLicense);

      const user = await Auth.findOne({ Client_ID: decryptedLicense });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      console.log("User Assets:", user.Assets); // Log รายการ Assets ของ user

      // ตรวจสอบ HWID
      if (user.Identifier !== hwidResult.hwid && user.Identifier !== null) {
        return res.status(400).json({ message: "Invalid HWID" });
      }

      // อัปเดต HWID หากยังไม่มีการบันทึก
      if (user.Identifier === null) {
        user.Identifier = hwidResult.hwid;
        await user.save();
      }

        // ค้นหา scriptValue จาก config.json โดยใช้ scriptName จาก client เทียบกับ value
        const gameConfig = config.games.find((game) => game.value === scriptName);
        if (!gameConfig) {
        return res.status(404).json({ message: "Invalid script name" });
        }

      const scriptValue = gameConfig.value;

      // ตรวจสอบว่า user มีสิทธิ์เข้าถึง script หรือไม่
      if (!user.Assets.includes(scriptValue)) {
        return res.status(400).json({ message: "User does not have access to this script" });
      }

      // ส่งข้อความกลับไปยัง client พร้อม tag
      return res.status(201).json({ message: xorStrings(newLicense.Tag) });
    } catch (error) {
      console.error("Error verifying License:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
