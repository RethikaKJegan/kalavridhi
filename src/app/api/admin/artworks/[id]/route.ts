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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const artworks = readArtworks();
  const idx = artworks.findIndex((a: { id: string }) => a.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  artworks[idx] = { ...artworks[idx], ...body };
  writeArtworks(artworks);
  return NextResponse.json(artworks[idx]);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const artworks = readArtworks();
  const filtered = artworks.filter((a: { id: string }) => a.id !== id);
  writeArtworks(filtered);
  return NextResponse.json({ ok: true });
}
