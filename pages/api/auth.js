import dbConnect from "../../lib/mongo";
import AuthModel from "../../models/authModel";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const { clientId } = req.query;
    try {
      const user = await AuthModel.findOne({ Client_ID: clientId });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user", error });
    }
  }

  if (req.method === "POST") {
    try {
      const newUser = await AuthModel.create(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: "Error creating user", error });
    }
  }
}
