import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return false;
  const token = authHeader.replace("Bearer ", "");
  return token === Buffer.from(ADMIN_PASSWORD).toString("base64");
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "uploads";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert buffer to base64 Data URI
    const fileBase64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary with custom folder mapping
    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: `portfolio/${folder}`,
    });

    return NextResponse.json({ 
      success: true, 
      url: result.secure_url, 
      fileName: result.original_filename 
    });
  } catch (err: any) {
    console.error("Cloudinary upload error:", err);
    return NextResponse.json({ error: "Upload to Cloudinary failed" }, { status: 500 });
  }
}
