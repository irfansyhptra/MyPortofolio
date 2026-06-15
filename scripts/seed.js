const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

// Manually parse .env file
const envPath = path.join(__dirname, "..", ".env");
let uri = "";
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  const match = envContent.match(/^MONGODB_URI=["']?([^"'\r\n]+)["']?/m);
  if (match) {
    uri = match[1];
  }
}

if (!uri) {
  console.error("❌ MONGODB_URI not found in .env file");
  process.exit(1);
}

// Path to siteData.json
const siteDataPath = path.join(__dirname, "..", "app", "data", "siteData.json");

if (!fs.existsSync(siteDataPath)) {
  console.error(`❌ siteData.json not found at expected path: ${siteDataPath}`);
  process.exit(1);
}

async function seed() {
  console.log("Reading siteData.json...");
  let siteData;
  try {
    const rawData = fs.readFileSync(siteDataPath, "utf8");
    siteData = JSON.parse(rawData);
  } catch (err) {
    console.error("❌ Failed to parse siteData.json:", err);
    process.exit(1);
  }

  const client = new MongoClient(uri);
  try {
    console.log("Connecting to MongoDB...");
    await client.connect();
    console.log("Connected successfully!");

    const db = client.db();
    const collection = db.collection("site_data");

    console.log("Seeding site data to MongoDB...");
    
    // We replace the main site data document or insert if it doesn't exist
    const result = await collection.replaceOne(
      { _id: "site_data_main" },
      { _id: "site_data_main", ...siteData },
      { upsert: true }
    );

    console.log("✅ Database successfully seeded with local siteData.json!");
    console.log(`Matched: ${result.matchedCount}, Upserted: ${result.upsertedCount ? 1 : 0}, Modified: ${result.modifiedCount}`);
  } catch (err) {
    console.error("❌ Seeding database error:", err);
  } finally {
    await client.close();
    console.log("MongoDB connection closed.");
  }
}

seed();
