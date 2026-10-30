import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "site-settings.json");

function readSettings() {
  try { return JSON.parse(readFileSync(FILE, "utf-8")); }
  catch { return {}; }
}

export async function GET() {
  return NextResponse.json(readSettings());
}

export async function PUT(request: Request) {
  const body = await request.json();
  const current = readSettings();
  const updated = { ...current, ...body };
  writeFileSync(FILE, JSON.stringify(updated, null, 2), "utf-8");
  return NextResponse.json(updated);
}
