"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load parent .env if exists (or root .env)
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../../.env") });
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const EXPECTED_TOKEN = Buffer.from(ADMIN_PASSWORD).toString("base64");
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            error: "Unauthorized",
            message: "Authorization header is missing.",
        });
    }
    const token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
    if (token !== EXPECTED_TOKEN) {
        return res.status(401).json({
            success: false,
            error: "Unauthorized",
            message: "Invalid admin token.",
        });
    }
    next();
}
