import { NextRequest, NextResponse } from "next/server";
import { getSiteData, writeSiteData, type SiteData } from "@/app/data/siteDataManager";
import { getDb } from "@/app/lib/mongodb";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return false;
  const token = authHeader.replace("Bearer ", "");
  return token === Buffer.from(ADMIN_PASSWORD).toString("base64");
}

// GET — read site data from MongoDB, falling back / seeding from siteData.json
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const section = searchParams.get("section") as keyof SiteData | null;

  try {
    const db = await getDb();
    const collection = db.collection<any>("site_data");
    let data = await collection.findOne({ _id: "site_data_main" });

    if (!data) {
      // Seed database with local siteData.json
      const localData = getSiteData();
      await collection.insertOne({ _id: "site_data_main", ...localData });
      data = { _id: "site_data_main", ...localData };
    }

    // Remove internal _id for frontend consistency
    delete data._id;

    if (section && section in data) {
      return NextResponse.json({ [section]: data[section] });
    }
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("GET site data database error:", err);
    return NextResponse.json({ error: "Failed to read data from database" }, { status: 500 });
  }
}

// PUT — update a section in MongoDB and sync it locally
export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { section, value } = body as { section: keyof SiteData; value: unknown };

    if (!section || value === undefined) {
      return NextResponse.json(
        { error: "Missing 'section' or 'value'" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collection = db.collection<any>("site_data");
    let currentData = await collection.findOne({ _id: "site_data_main" });

    if (!currentData) {
      const localData = getSiteData();
      await collection.insertOne({ _id: "site_data_main", ...localData });
      currentData = { _id: "site_data_main", ...localData };
    }

    if (!(section in currentData)) {
      return NextResponse.json(
        { error: `Unknown section: ${section}` },
        { status: 400 }
      );
    }

    // Update in MongoDB
    await collection.updateOne(
      { _id: "site_data_main" },
      { $set: { [section]: value } }
    );

    // Sync changes back to local JSON for next static builds
    const updatedData = await collection.findOne({ _id: "site_data_main" });
    if (updatedData) {
      delete updatedData._id;
      writeSiteData(updatedData as SiteData);
    }

    return NextResponse.json({ success: true, section });
  } catch (err: any) {
    console.error("PUT site data database error:", err);
    return NextResponse.json({ error: "Failed to update data in database" }, { status: 500 });
  }
}
