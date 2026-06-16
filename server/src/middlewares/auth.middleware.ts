import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import path from "path";

// Load parent .env if exists (or root .env)
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const EXPECTED_TOKEN = Buffer.from(ADMIN_PASSWORD).toString("base64");

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || (req.headers.Authorization as string);
  
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
