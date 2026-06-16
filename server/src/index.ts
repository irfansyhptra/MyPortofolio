import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import testimonialRouter from "./routes/testimonial.routes";
import { connectDb, closeDb } from "./config/db";

// Load parent .env if exists (or root .env)
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Parse JSON request body with custom size limit to allow base64 images
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Register API Routes
app.use("/api", testimonialRouter);

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    // Check database connection
    await connectDb();
    return res.status(200).json({ status: "healthy", db: "connected" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database error";
    return res.status(500).json({ status: "unhealthy", db: "disconnected", error: message });
  }
});

// Start Express server
const server = app.listen(PORT, async () => {
  console.log(`Express server is running on http://localhost:${PORT}`);
  try {
    await connectDb();
    console.log("MongoDB is ready.");
  } catch (error) {
    console.error("Failed to connect to MongoDB on startup:", error);
  }
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received. Shutting down gracefully...");
  server.close(async () => {
    await closeDb();
    console.log("Express server stopped.");
    process.exit(0);
  });
});
