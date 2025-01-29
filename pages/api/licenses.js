import dbConnect from "../../lib/mongo";
import LicenseModel from "../../models/licenseModel";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const { licenseKey } = req.query;
    try {
      const license = await LicenseModel.findOne({ License: licenseKey });
      if (!license) {
        return res.status(404).json({ message: "License not found" });
      }
      res.json(license);
    } catch (error) {
      res.status(500).json({ message: "Error fetching license", error });
    }
  }

  if (req.method === "POST") {
    try {
      const newLicense = await LicenseModel.create(req.body);
      res.status(201).json(newLicense);
    } catch (error) {
      res.status(500).json({ message: "Error creating license", error });
    }
  }
}
