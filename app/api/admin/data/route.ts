import { NextRequest, NextResponse } from "next/server";
import { getSiteData, writeSiteData, type SiteData } from "@/app/data/siteDataManager";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return false;
  const token = authHeader.replace("Bearer ", "");
  return token === Buffer.from(ADMIN_PASSWORD).toString("base64");
}

// GET — read entire siteData or a specific section
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const section = searchParams.get("section") as keyof SiteData | null;

  try {
    const data = getSiteData();
    if (section && section in data) {
      return NextResponse.json({ [section]: data[section] });
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to read data" }, { status: 500 });
  }
}

// PUT — update a section
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

    const data = getSiteData();
    if (!(section in data)) {
      return NextResponse.json(
        { error: `Unknown section: ${section}` },
        { status: 400 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data as any)[section] = value;
    writeSiteData(data);

    return NextResponse.json({ success: true, section });
  } catch {
    return NextResponse.json({ error: "Failed to update data" }, { status: 500 });
  }
}
