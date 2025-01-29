import dbConnect from "../../../src/lib/mongo";
import License from "../../../src/models/licenseModel";
import { getScriptLicense } from "../../../src/lib/userControlller";


export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
      await getScriptLicense(req, res);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}









// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method not allowed" });
//   }

//   try {
//     await dbConnect(); // เชื่อมต่อ MongoDB
//     const { userid } = req.body; // รับ User ID จาก Frontend

//     if (!userid) {
//       return res.status(400).json({ message: "User ID is required" });
//     }

//     // ค้นหา License ที่มี Owner ตรงกับ User ID และมี Status เท่ากับ 1
//     const licenses = await License.find({ Owner: userid, Status: 1 });

//     console.log("User ID:", userid);
//     console.log("Found Licenses:", licenses);

//     // ตรวจสอบว่าพบ License หรือไม่
//     if (!licenses || licenses.length === 0) {
//       return res.status(404).json({ message: "No valid licenses found for this user" });
//     }

//     // ส่งกลับ License Keys
//     const keys = licenses.map((license) => license.License);
//     return res.status(200).json({ keys });
//   } catch (error) {
//     console.error("Error fetching licenses:", error);

//     // ระบุข้อผิดพลาดอย่างละเอียด
//     if (error.name === "MongoNetworkError") {
//       return res.status(503).json({ message: "Database connection error" });
//     }

//     res.status(500).json({ message: "Internal server error" });
//   }
// }
