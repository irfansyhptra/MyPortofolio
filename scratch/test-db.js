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
  console.error("MONGODB_URI not found in .env file");
  process.exit(1);
}

async function main() {
  const client = new MongoClient(uri);
  try {
    console.log("Connecting to MongoDB (Old Cluster)...");
    await client.connect();
    console.log("Connected successfully!");

    const adminDb = client.db().admin();
    const dbsList = await adminDb.listDatabases();
    console.log("\nDatabases on this cluster:");
    for (let db of dbsList.databases) {
      console.log(` - ${db.name} (size: ${db.sizeOnDisk} bytes)`);
    }

    const db = client.db();
    console.log(`\nUsing default database from URI: "${db.databaseName}"`);
    const collections = await db.listCollections().toArray();
    console.log("Collections in this database:");
    for (let col of collections) {
      console.log(` - ${col.name}`);
      const count = await db.collection(col.name).countDocuments();
      console.log(`   Documents count: ${count}`);
      
      if (count > 0) {
        const docs = await db.collection(col.name).find().toArray();
        console.log(`   Sample doc IDs:`, docs.map(d => d._id));
      }
    }
  } catch (err) {
    console.error("MongoDB Error:", err);
  } finally {
    await client.close();
  }
}

main();
