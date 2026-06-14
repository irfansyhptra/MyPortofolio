const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://irfan19ksp:user1234@cluster0.9xymjhb.mongodb.net/?appName=Cluster0";

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
