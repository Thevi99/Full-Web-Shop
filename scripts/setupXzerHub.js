require("dotenv").config();
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI || "mongodb+srv://DynamicTracker:2fHmALv9637JmfrR@cluster0.dozhq.mongodb.net/";
if (!uri) {
  console.error("Error: MONGODB_URI is not defined in .env.local");
  process.exit(1);
}

const client = new MongoClient(uri);

async function createXzerHubCollections() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    const db = client.db("XzerHub");
    const collections = ["Auth", "Licenses", "User"];

    for (const collection of collections) {
      const existingCollection = await db.listCollections({ name: collection }).toArray();
      if (existingCollection.length === 0) {
        await db.createCollection(collection);
        console.log(`Collection '${collection}' created.`);
      } else {
        console.log(`Collection '${collection}' already exists.`);
      }
    }

    console.log("Structure for Xzer Hub created successfully!");
  } catch (error) {
    console.error("Error creating collections:", error);
  } finally {
    await client.close();
  }
}

createXzerHubCollections();
