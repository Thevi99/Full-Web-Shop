const dbConnect = require("../lib/mongo"); // เชื่อมต่อ MongoDB
const License = require("../models/licenseModel");
const Auth = require("../models/authModel");
const axios = require("axios");
const fs = require('fs');
const path = require('path');


// ฟังก์ชันสำหรับสร้าง string แบบสุ่ม
const randomString = function (length) {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () => possible.charAt(Math.floor(Math.random() * possible.length))).join("");
};

const randomString_Nodownload = function(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

// ฟังก์ชันสำหรับสร้าง License Key
const generateLicenseKey = async (req, res) => {
  try {
    await dbConnect();
    const { licenseCount, licenseName } = req.body;

    if (!licenseCount || !licenseName) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // สร้าง License Keys
    const licenseKeys = Array.from({ length: licenseCount }, () => `${licenseName}_${randomString(25)}`);

    const licenses = licenseKeys.map((key) => ({
      License: key,
      Script_Name: licenseName,
    }));

    await License.insertMany(licenses);

    // ส่ง License Keys กลับไปให้กับผู้ใช้
    return { licenseKeys };
  } catch (err) {
    console.error("Error in generateLicenseKey:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const generateLicenseKey_NoDowlaod = async (req, res) => {
  try {
      const { licenseCount , licenseName } = req.body;

      console.log(licenseCount, licenseName);

      if (!licenseCount || !licenseName) {
          return res.status(400).json({ message: 'Please fill all fields' });
      }

      const licenseKeys = [];

      for (let i = 0; i < licenseCount; i++) {
          const key = licenseName + '_' + randomString_Nodownload(25);
          licenseKeys.push(key);
      };

      for (let i = 0; i < licenseCount; i++) {
          const license = License.create({
              License: licenseKeys[i],
              Script_Name: licenseName,
          });
      }

      res.status(201).json({ message: 'License Keys Generated Successfully', licenseKeys });
  } catch(err) {
      console.log(err);
      res.status(500).json({ message: 'Internal Server Error' });
  }
}



// ฟังก์ชันสำหรับ Redeem License Key
const redeemLicenseKey = async (req, res) => {
  try {
    // Step 1: Connect to MongoDB
    await dbConnect();

    // Step 2: Extract and validate request body
    const { licenseKey, userid } = req.body;
    if (!licenseKey || !userid) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // Step 3: Find the license in the database
    const license = await License.findOne({ License: licenseKey });
    if (!license) {
      return res.status(400).json({ message: "Invalid License Key" });
    }

    // Step 4: Check if the license is already used
    if (license.Status !== 0) {
      return res.status(400).json({ message: "License Key already used" });
    }

    // Step 5: Find the user in the database by Client_ID
    let user = await Auth.findOne({ Client_ID: userid });

    // Step 6: Update the license's status and owner
    license.Status = 1;
    license.Owner = userid; // Use Discord ID or user ID as the owner
    await license.save();

    // Step 7: Handle the user account
    if (!user) {
      // If the user does not exist, create a new user with the license details
      user = await Auth.create({
        Client_ID: userid,
        Licenses: [licenseKey],
        Assets: [license.Script_Name],
      });

      return res.status(201).json({
        message: "New User Created and License Key Redeemed Successfully",
      });
    } else {
      // If the user already exists, update their licenses and assets
      if (!user.Licenses.includes(licenseKey)) {
        user.Licenses.push(licenseKey);
      }
      if (!user.Assets.includes(license.Script_Name)) {
        user.Assets.push(license.Script_Name);
      }
      await user.save();

      return res.status(200).json({
        message: "License Key Redeemed Successfully",
      });
    }
  } catch (err) {
    // Step 8: Handle unexpected errors
    console.error("Error in redeemLicenseKey:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};





// ฟังก์ชันสำหรับซื้อ License Key
const LicenseBuy = async (req, res) => {
  try {
    await dbConnect(); // เชื่อมต่อ MongoDB
    const { licenseName, VoucherCode } = req.body;

    if (!licenseName || !VoucherCode) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const urlPattern = /^https:\/\/gift\.truemoney\.com\/campaign\/\?v=([\w-]+)$/;
    const match = VoucherCode.match(urlPattern);

    if (!match) {
      return res.status(400).json({ message: "Invalid Voucher Code" });
    }

    const voucherCode = match[1];

    const response = await axios.post("https://voucher.meowcdn.xyz/api", {
      mobile: process.env.MOBILE,
      voucher: voucherCode,
    });

    const amount = response.data?.voucher?.amount_baht?.toString().replace(",", "");
    if (amount !== "90.00") {
      return res.status(400).json({ message: "Invalid gift voucher amount" });
    }

    const licenseKey = `${licenseName}_${randomString(25)}`;

    await License.create({
      License: licenseKey,
      Script_Name: licenseName,
    });

    res.status(201).json({ message: "License Key Generated Successfully", licenseKey });
  } catch (err) {
    console.error("Error in LicenseBuy:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  generateLicenseKey,
  redeemLicenseKey,
  LicenseBuy,
  generateLicenseKey_NoDowlaod,
};
