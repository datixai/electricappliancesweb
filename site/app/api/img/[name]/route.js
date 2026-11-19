import fs from "fs/promises";
import path from "path";
import { UPLOADS } from "@/lib/store";

const MIME = { ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };

export async function GET(_req, { params }) {
  const { name } = await params;
  if (!/^[a-f0-9]{16}\.(jpg|png|webp)$/.test(name)) return new Response("Not found", { status: 404 });
  try {
    const buf = await fs.readFile(path.join(UPLOADS, name));
    return new Response(buf, { headers: { "Content-Type": MIME[path.extname(name)], "Cache-Control": "public, max-age=31536000, immutable" } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
