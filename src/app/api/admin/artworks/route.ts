import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "artworks.json");

function readArtworks() {
  try { return JSON.parse(readFileSync(FILE, "utf-8")); }
  catch { return []; }
}
function writeArtworks(data: unknown[]) {
  writeFileSync(FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  return NextResponse.json(readArtworks());
}

export async function POST(request: Request) {
  const body = await request.json();
  const artworks = readArtworks();
  const newItem = {
    id: `art-${Date.now()}`,
    sortOrder: artworks.length + 1,
    published: false,
    featured: false,
    consentStatus: "confirmed",
    ...body,
  };
  artworks.push(newItem);
  writeArtworks(artworks);
  return NextResponse.json(newItem, { status: 201 });
}
