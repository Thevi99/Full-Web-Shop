const mongoose = require("mongoose");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb+srv://XzerHub:LUVSP.G0510-FV@xzerhub.dkcca.mongodb.net/";

if (!MONGODB_URI) {
  throw new Error("❌ Please define the MONGODB_URI environment variable inside .env.local");
}

// ใช้ global cache เพื่อหลีกเลี่ยงการเชื่อมต่อซ้ำเมื่อใช้ Hot Reloading
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    if (process.env.NODE_ENV === "development") {
      console.log("ℹ️ Using cached MongoDB connection.");
    }
    return cached.conn;
  }

  if (!cached.promise) {
    if (process.env.NODE_ENV === "development") {
      console.log("ℹ️ Creating new MongoDB connection...");
    }
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000, // เพิ่ม timeout สำหรับการเชื่อมต่อ
        socketTimeoutMS: 45000, // เพิ่ม timeout สำหรับ socket
      })
      .then((mongoose) => {
        console.log("✅ MongoDB connected successfully.");
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        throw new Error("Failed to connect to MongoDB. Check your connection string or database.");
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error("❌ Error in dbConnect:", error.message);
    throw error;
  }
}

module.exports = dbConnect;
