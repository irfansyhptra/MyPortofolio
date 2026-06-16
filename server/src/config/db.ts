import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";
import path from "path";

// Load parent .env if exists (or root .env)
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("⚠️ MONGODB_URI is not defined in environment variables!");
}

let client: MongoClient | null = null;
let dbInstance: Db | null = null;

export async function connectDb(): Promise<Db> {
  if (dbInstance) return dbInstance;
  
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  client = new MongoClient(uri);
  await client.connect();
  dbInstance = client.db("portfolio");
  console.log("MongoDB connection established.");
  return dbInstance;
}

export async function getDb(): Promise<Db> {
  if (!dbInstance) {
    return await connectDb();
  }
  return dbInstance;
}

export async function closeDb(): Promise<void> {
  if (client) {
    await client.close();
    dbInstance = null;
    client = null;
    console.log("MongoDB connection closed.");
  }
}
