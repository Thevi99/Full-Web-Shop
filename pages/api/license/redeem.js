import connectDB from "../../../src/lib/mongo";
import { redeemLicenseKey } from "../../../src/lib/licenseController";
import authMiddleware from "../../../src/middleware/authMiddleware";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
      await redeemLicenseKey(req, res);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}



