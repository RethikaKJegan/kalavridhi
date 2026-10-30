import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "workshops.json");

function readWorkshops() {
  try { return JSON.parse(readFileSync(FILE, "utf-8")); }
  catch { return []; }
}
function writeWorkshops(data: unknown[]) {
  writeFileSync(FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  return NextResponse.json(readWorkshops());
}

export async function POST(request: Request) {
  const body = await request.json();
  const workshops = readWorkshops();
  const slug = (body.title || "workshop").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const newItem = {
    id: `ws-${Date.now()}`,
    slug: `${slug}-${Date.now()}`,
    status: "draft",
    registrationOpen: false,
    featured: false,
    ...body,
  };
  workshops.push(newItem);
  writeWorkshops(workshops);
  return NextResponse.json(newItem, { status: 201 });
}
