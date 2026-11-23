import { NextResponse } from "next/server";
import crypto from "crypto";
import { isAdmin, upsertProduct, deleteProduct, saveImage, getProducts } from "@/lib/store";
import { CATEGORIES } from "@/lib/site";

const TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX = 900 * 1024; // photos are resized in the browser first; Firestore allows 1 MB per document
const deny = () => NextResponse.json({ error: "Not allowed" }, { status: 401 });

async function saveImages(files) {
  const urls = [];
  for (const f of files) {
    if (!f || typeof f === "string" || !f.size) continue;
    if (!TYPES.includes(f.type) || f.size > MAX) throw new Error("A photo is too large or not JPG, PNG or WEBP.");
    urls.push(await saveImage(Buffer.from(await f.arrayBuffer()), f.type));
  }
  return urls;
}

// Create or update (when "id" is sent)
export async function POST(req) {
  if (!(await isAdmin())) return deny();
  const fd = await req.formData();
  const s = (k) => (fd.get(k) || "").toString().trim();
  if (!s("name")) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  if (!CATEGORIES.some((c) => c.slug === s("category"))) return NextResponse.json({ error: "Choose a category" }, { status: 400 });
  let newImgs;
  try {
    newImgs = await saveImages(fd.getAll("images"));
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
  const id = s("id");
  if (id && !(await getProducts()).some((p) => p.id === id)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const data = {
    name: s("name"),
    model: s("model"),
    brand: s("brand"),
    category: s("category"),
    price: s("price"),
    description: s("description"),
    specs: s("specs").split("\n").map((x) => x.trim()).filter(Boolean),
    featured: s("featured") === "on",
    images: [...fd.getAll("keep").map(String), ...newImgs],
  };
  await upsertProduct(id || crypto.randomBytes(4).toString("hex"), data);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req) {
  if (!(await isAdmin())) return deny();
  const id = new URL(req.url).searchParams.get("id");
  if (id) await deleteProduct(id);
  return NextResponse.json({ ok: true });
}
