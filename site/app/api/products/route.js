import { NextResponse } from "next/server";
import crypto from "crypto";
import { isAdmin, upsertProduct, deleteProduct, saveImage, deleteImages, getProducts } from "@/lib/store";
import { CATEGORIES } from "@/lib/site";
import { sameOrigin, sniffImage, SAFE_IMAGE, SAFE_ID } from "@/lib/security";

const MAX = 900 * 1024; // photos are resized in the browser first; Firestore allows 1 MB per document
const MAX_PHOTOS = 8;
const deny = () => NextResponse.json({ error: "Not allowed" }, { status: 401 });
const bad = (error, status = 400) => NextResponse.json({ error }, { status });

async function saveImages(files) {
  const urls = [];
  for (const f of files) {
    if (!f || typeof f === "string" || !f.size) continue;
    if (f.size > MAX) throw new Error("A photo is too large. Please use a smaller photo.");
    const buf = Buffer.from(await f.arrayBuffer());
    const type = sniffImage(buf); // trust the file's real content, not the name or declared type
    if (!type) throw new Error("Photos must be JPG, PNG or WEBP.");
    urls.push(await saveImage(buf, type));
  }
  return urls;
}

// Create or update (when "id" is sent)
export async function POST(req) {
  if (!sameOrigin(req)) return bad("Not allowed", 403);
  if (!(await isAdmin())) return deny();
  const fd = await req.formData();
  const s = (k, max) => (fd.get(k) || "").toString().trim().slice(0, max);
  const name = s("name", 150);
  if (!name) return bad("Name is required");
  const category = s("category", 40);
  if (!CATEGORIES.some((c) => c.slug === category)) return bad("Choose a category");
  const id = s("id", 40);
  if (id && !SAFE_ID.test(id)) return bad("Bad product id");
  const price = s("price", 20);
  if (price && !/^[0-9][0-9,.\s]*$/.test(price)) return bad("Price can only contain numbers");

  const existing = id ? (await getProducts()).find((p) => p.id === id) : null;
  if (id && !existing) return bad("Product not found", 404);

  // Only photos this product already has (or bundled seed photos) may be kept.
  const keep = fd.getAll("keep").map(String).filter((u) => SAFE_IMAGE.test(u) && (!existing || (existing.images || []).includes(u)));
  const files = fd.getAll("images").filter((f) => f && typeof f !== "string" && f.size);
  if (keep.length + files.length > MAX_PHOTOS) return bad(`A product can have up to ${MAX_PHOTOS} photos.`);
  let newImgs;
  try {
    newImgs = await saveImages(files);
  } catch (e) {
    return bad(e.message);
  }

  const data = {
    name,
    model: s("model", 80),
    brand: s("brand", 80),
    category,
    price,
    description: s("description", 2000),
    specs: s("specs", 4000).split("\n").map((x) => x.trim().slice(0, 200)).filter(Boolean).slice(0, 30),
    featured: s("featured", 5) === "on",
    images: [...keep, ...newImgs],
  };
  await upsertProduct(id || crypto.randomBytes(4).toString("hex"), data);
  // Photos the admin removed are deleted so they do not pile up.
  if (existing) await deleteImages((existing.images || []).filter((u) => !data.images.includes(u)));
  return NextResponse.json({ ok: true });
}

export async function DELETE(req) {
  if (!sameOrigin(req)) return bad("Not allowed", 403);
  if (!(await isAdmin())) return deny();
  const id = new URL(req.url).searchParams.get("id") || "";
  if (!SAFE_ID.test(id)) return bad("Bad product id");
  await deleteProduct(id);
  return NextResponse.json({ ok: true });
}
