import dbConnect from "../../src/lib/mongo";
import Item from "../../src/models/itemModel";

export default async function handler(req, res) {
  const { method } = req;
  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const subscriptions = await Item.find({});
        res.status(200).json({ subscriptions });
      } catch (error) {
        res.status(500).json({ message: "Internal server error" });
      }
      break;
    default:
      res.status(405).json({ message: "Method not allowed" });
  }
}
