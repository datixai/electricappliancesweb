import { readImage } from "@/lib/store";

export async function GET(_req, { params }) {
  const { name } = await params;
  if (!/^[a-f0-9]{16}$/.test(name)) return new Response("Not found", { status: 404 });
  const img = await readImage(name);
  if (!img) return new Response("Not found", { status: 404 });
  return new Response(img.buf, { headers: { "Content-Type": img.type, "Cache-Control": "public, max-age=31536000, immutable" } });
}
