"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDb = connectDb;
exports.getDb = getDb;
exports.closeDb = closeDb;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load parent .env if exists (or root .env)
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../../.env") });
const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error("⚠️ MONGODB_URI is not defined in environment variables!");
}
let client = null;
let dbInstance = null;
async function connectDb() {
    if (dbInstance)
        return dbInstance;
    if (!uri) {
        throw new Error("MONGODB_URI is not defined in environment variables");
    }
    client = new mongodb_1.MongoClient(uri);
    await client.connect();
    dbInstance = client.db("portfolio");
    console.log("MongoDB connection established.");
    return dbInstance;
}
async function getDb() {
    if (!dbInstance) {
        return await connectDb();
    }
    return dbInstance;
}
async function closeDb() {
    if (client) {
        await client.close();
        dbInstance = null;
        client = null;
        console.log("MongoDB connection closed.");
    }
}
