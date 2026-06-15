import { NextRequest, NextResponse } from "next/server";
import { getSiteData, type SiteData } from "@/app/data/siteDataManager";
import { getDb } from "@/app/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const collection = db.collection<any>("site_data");
    let data = await collection.findOne({ _id: "site_data_main" });

    if (!data) {
      // Seed/fallback to local siteData.json
      const localData = getSiteData();
      try {
        await collection.insertOne({ _id: "site_data_main", ...localData });
      } catch (dbErr) {
        console.error("Failed to seed site data main:", dbErr);
      }
      data = localData as any;
    } else {
      delete data._id;
      const localData = getSiteData();
      data = { ...localData, ...data };
    }

    // Ensure all items in array sections have the image field
    if (data.educations) {
      data.educations = data.educations.map((item: any) => ({ image: "", ...item }));
    }
    if (data.experiences) {
      data.experiences = data.experiences.map((item: any) => ({ image: "", ...item }));
    }
    if (data.organizations) {
      data.organizations = data.organizations.map((item: any) => ({ image: "", ...item }));
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Public GET site data error:", err);
    // Fallback to local siteData.json on database error
    try {
      const localData = getSiteData();
      if (localData.educations) {
        localData.educations = localData.educations.map((item: any) => ({ image: "", ...item }));
      }
      if (localData.experiences) {
        localData.experiences = localData.experiences.map((item: any) => ({ image: "", ...item }));
      }
      if (localData.organizations) {
        localData.organizations = localData.organizations.map((item: any) => ({ image: "", ...item }));
      }
      return NextResponse.json(localData);
    } catch {
      return NextResponse.json({ error: "Failed to read data" }, { status: 500 });
    }
  }
}
