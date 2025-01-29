import connectDB from "../../../src/lib/mongo";
import FAQ from "../../../src/models/faqModel";

export default async function handler(req, res) {
  if (req.method === "POST") {
    await connectDB();
    const { question, answer } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ message: "กรุณากรอกคำถามและคำตอบ" });
    }
    try {
      const newFAQ = new FAQ({
        question: question,
        answer: answer,
      });
      await newFAQ.save();
      return res.status(201).json({
        message: "successfully",
      });
    } catch (error) {
      console.error("Error fetching items:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else if (req.method === "GET") {
    try {
      const DataTarget = await FAQ.find();
      return res.status(200).json({ DataTarget });
    } catch (error) {
      console.error("Error fetching faq:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else if (req.method === "PUT") {
    const { id } = req.query;
    const { question, answer } = req.body;
    try {
      if (!question || !answer) {
        return res.status(400).json({ message: "Both question and answer are required." });
      }      
      const faq = await FAQ.findById(id);
      if (!faq) {
        return res.status(404).json({ message: "FAQ not found" });
      }
      faq.question = question;
      faq.answer = answer;
      await faq.save();
      return res.status(200).json({ message: "FAQ updated successfully" });
    } catch (error) {
      console.error("Error updating faq:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.query;
    try {
      await FAQ.findByIdAndDelete(id);
      return res.status(200).json({ message: "FAQ deleted successfully" });
    } catch (error) {
      console.error("Error deleting faq:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
