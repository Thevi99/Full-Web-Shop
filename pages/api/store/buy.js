// pages/api/store/buy.js
import connectDB from "../../../src/lib/mongo";
import User from "../../../src/models/userModel";
import Item from "../../../src/models/itemModel";
import History from "../../../src/models/historyModel";
import Message from "../../../src/models/MessageModel";
export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    try {
      const { itemId, quantity, userId } = req.body;

      // Debug: แสดงข้อมูลที่ได้รับจาก request
      console.log("Request body:", {
        itemId,
        quantity,
        userId,
      });

      // Validate required fields
      if (!userId || !itemId || !quantity) {
        console.log("Missing required fields:", { userId, itemId, quantity });
        return res.status(400).json({ 
          message: "กรุณาระบุ userId, itemId และ quantity"
        });
      }

      // Debug: แสดง query ที่ใช้ค้นหา user
      console.log("Searching for user with username:", userId);
      
      // Find user by username
      const user = await User.findOne({ username: userId });
      
      // Debug: แสดงผลลัพธ์การค้นหา user
      console.log("User search result:", {
        found: !!user,
        userData: user ? {
          id: user._id,
          username: user.username,
          credits: user.credit
        } : null
      });

      if (!user) {
        // ตรวจสอบว่ามี users ในระบบหรือไม่
        const allUsers = await User.find({}).select('username');
        console.log("All available usernames:", allUsers.map(u => u.username));
        
        return res.status(404).json({ 
          message: "User not found",
          debug: {
            searchedUsername: userId,
            availableUsernames: allUsers.map(u => u.username)
          }
        });
      }

      // Find item to purchase
      const item = await Item.findById(itemId);
      
      // Debug: แสดงข้อมูล item
      console.log("Item search result:", {
        found: !!item,
        itemData: item ? {
          id: item._id,
          title: item.title,
          price: item.price,
          datasLength: item.datas?.length
        } : null
      });

      if (!item) {
        return res.status(404).json({ 
          message: "Item not found" 
        });
      }

      // Check if enough stock
      if (item.datas.length < quantity) {
        console.log("Insufficient stock:", {
          requested: quantity,
          available: item.datas.length
        });
        return res.status(400).json({ 
          message: "สินค้าไม่เพียงพอ" 
        });
      }

      // Check if enough credits
      const totalPrice = item.price * quantity;
      if (user.credit < totalPrice) {
        console.log("Insufficient credits:", {
          required: totalPrice,
          available: user.credit
        });
        return res.status(400).json({ 
          message: "เครดิตไม่เพียงพอ",
          debug: {
            requiredCredits: totalPrice,
            availableCredits: user.credit
          }
        });
      }

      // Store original credits for potential rollback
      const originalCredits = user.credit;

      try {
        // Deduct credits from user
        user.credit -= totalPrice;
        await user.save();
        console.log("Credits updated:", {
          originalCredits,
          newCredits: user.credit
        });

        // Remove purchased keys from item
        const purchasedKeys = item.datas.splice(0, quantity);
        await item.save();
        console.log("Keys purchased:", purchasedKeys);

        // Create purchase history
        const currentDate = new Date();
        const message = await Message.create({
          title: "สั่งซื้อสินค้าสำเร็จ!",
          link: "/history/buy",
          description: `ซื้อ ${item.title} สำเร็จ! คลิ๊กที่นี่เพื่อดูของที่คุณได้รับ`,
          click: false,
          user: user._id,

        })
        const history = await History.create({
          userId: user._id,
          name: item.title,
          data: purchasedKeys.join(", "),
          price: totalPrice,
          currency: "THB",
          status: "สำเร็จ",
          transactionId: `TXN${currentDate.getTime()}`,
          paymentMethod: "wallet",
          createdAt: currentDate,
          updatedAt: currentDate
        });
        console.log("History created:", history._id);

        // Return successful response
        return res.status(200).json({
          message: "ซื้อสำเร็จ",
          remainingCredits: user.credit,
          purchasedKeys
        });
      } catch (saveError) {
        console.error("Error during save operations:", saveError);
        // If there's an error during save operations, try to rollback
        if (user.credit !== originalCredits) {
          console.log("Attempting to rollback credits");
          user.credit = originalCredits;
          await user.save();
        }
        throw saveError;
      }

    } catch (error) {
      console.error("Error processing purchase:", error);
      return res.status(500).json({ 
        message: "Internal server error", 
        error: error.message || 'Unknown error occurred'
      });
    }
  } else {
    return res.status(405).json({ 
      message: "Method not allowed" 
    });
  }
}