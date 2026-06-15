import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

if (uri) {
  if (process.env.NODE_ENV === "development") {
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
} else {
  console.warn("⚠️ MONGODB_URI is not defined in the environment variables. The application will fall back to local JSON data.");
}

export default clientPromise;

export async function getDb(): Promise<Db> {
  if (!uri || !clientPromise) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }
  const connection = await clientPromise;
  return connection.db("portfolio");
}
