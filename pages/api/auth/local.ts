import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import dbConnect from "../../../src/lib/mongo";
import User from "../../../src/models/userModel"; // Your User model

interface UserDocument {
  username: string;
  email: string;
  password: string;
  provider: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect(); // Ensure MongoDB is connected

  const { method } = req;

  if (method === "POST") {
    const { action, username, email, password } = req.body;

    if (!action || !username || !password) {
      return res.status(400).json({ message: "Please provide all required fields." });
    }

    try {
      if (action === "register") {
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          return res.status(400).json({ message: "Username already taken." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const newUser = await User.create({
          username,
          email: email || "", // Optional email
          password: hashedPassword,
          provider: "local",
        });

        return res.status(201).json({ message: "User registered successfully.", user: newUser });
      }

      if (action === "login") {
        // Find the user
        const user = await User.findOne({ username });
        if (!user) {
          return res.status(400).json({ message: "Invalid username or password." });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: "Invalid username or password." });
        }

        // User authenticated
        return res.status(200).json({ message: "Login successful.", user });
      }

      return res.status(400).json({ message: "Invalid action. Use 'register' or 'login'." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error." });
    }
  }

  res.setHeader("Allow", ["POST"]);
  res.status(405).json({ message: `Method ${method} not allowed.` });
}
