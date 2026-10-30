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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const workshops = readWorkshops();
  const idx = workshops.findIndex((w: { id: string }) => w.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  workshops[idx] = { ...workshops[idx], ...body };
  writeWorkshops(workshops);
  return NextResponse.json(workshops[idx]);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workshops = readWorkshops();
  const filtered = workshops.filter((w: { id: string }) => w.id !== id);
  writeWorkshops(filtered);
  return NextResponse.json({ ok: true });
}
