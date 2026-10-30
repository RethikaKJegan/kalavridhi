import { NextResponse } from "next/server";
import { writeFileSync, mkdirSync } from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "images", "uploads");

export async function POST(request: Request) {
  try {
    mkdirSync(UPLOAD_DIR, { recursive: true });

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Only image files are allowed (JPEG, PNG, WebP, GIF)" }, { status: 400 });
    }

    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "jpg";
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const filename = `${Date.now()}-${safeName}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    writeFileSync(filepath, buffer);

    return NextResponse.json({ url: `/images/uploads/${filename}` });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
