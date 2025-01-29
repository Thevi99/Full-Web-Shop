// pages/api/store/buy.js
import connectDB from "../../../../src/lib/mongo";
import Script from "../../../../src/models/scriptstatusModel";
import Exploitor from "../../../../src/models/exploitorstatusModel";


export default async function handler(req, res) {
  await connectDB();
  const { type } = req.query;
  if (req.method === "GET") {
    if(type == "script") {
        const script = await Script.find({});
        return res.status(200).json({ script });
    } else {
        const exploitor = await Exploitor.find({});
        return res.status(200).json({ exploitor });
    }

  } else {
    return res.status(405).json({ 
      message: "Method not allowed" 
    });
  }
}