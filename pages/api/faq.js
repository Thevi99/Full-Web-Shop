
import FAQ from "../../src/models/faqModel";
import dbConnect from "../../src/lib/mongo";


const handler = async (req, res) => {
  await dbConnect();
  if (req.method === "GET") {
    try {
      const DataTarget = await FAQ.find();
      return res.status(200).json({
        DataTarget
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
      return res.status(500).json({
        message: "Internal Server Error"
      });
    }
  }
};

export default handler;