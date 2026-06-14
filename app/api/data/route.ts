import { NextRequest, NextResponse } from "next/server";
import { getSiteData, type SiteData } from "@/app/data/siteDataManager";
import { getDb } from "@/app/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const collection = db.collection<any>("site_data");
    let data = await collection.findOne({ _id: "site_data_main" });

    if (!data) {
      // Seed/fallback to local siteData.json
      data = getSiteData() as any;
    } else {
      delete data._id;
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Public GET site data error:", err);
    // Fallback to local siteData.json on database error
    try {
      const localData = getSiteData();
      return NextResponse.json(localData);
    } catch {
      return NextResponse.json({ error: "Failed to read data" }, { status: 500 });
    }
  }
}
