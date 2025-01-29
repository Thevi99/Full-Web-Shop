import { generateLicenseKey_NoDowlaod } from "../../../src/lib/licenseController";

export default async function handler(req, res) {
  if (req.method === "POST") {
    await generateLicenseKey_NoDowlaod(req, res);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
