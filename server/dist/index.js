"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const testimonial_routes_1 = __importDefault(require("./routes/testimonial.routes"));
const db_1 = require("./config/db");
// Load parent .env if exists (or root .env)
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../.env") });
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Enable CORS
app.use((0, cors_1.default)());
// Parse JSON request body with custom size limit to allow base64 images
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ limit: "10mb", extended: true }));
// Register API Routes
app.use("/api", testimonial_routes_1.default);
// Health check endpoint
app.get("/health", async (req, res) => {
    try {
        // Check database connection
        await (0, db_1.connectDb)();
        return res.status(200).json({ status: "healthy", db: "connected" });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Database error";
        return res.status(500).json({ status: "unhealthy", db: "disconnected", error: message });
    }
});
// Start Express server
const server = app.listen(PORT, async () => {
    console.log(`Express server is running on http://localhost:${PORT}`);
    try {
        await (0, db_1.connectDb)();
        console.log("MongoDB is ready.");
    }
    catch (error) {
        console.error("Failed to connect to MongoDB on startup:", error);
    }
});
// Graceful shutdown
process.on("SIGTERM", () => {
    console.log("SIGTERM signal received. Shutting down gracefully...");
    server.close(async () => {
        await (0, db_1.closeDb)();
        console.log("Express server stopped.");
        process.exit(0);
    });
});
