import { NextResponse } from "next/server";
import crypto from "crypto";
import { isAdmin, getCategories, getProducts, saveCategory, removeCategory, saveImage, deleteImages } from "@/lib/store";
import { sameOrigin, sniffImage, SAFE_IMAGE } from "@/lib/security";

const MAX = 900 * 1024;
const deny = () => NextResponse.json({ error: "Not allowed" }, { status: 401 });
const bad = (error, status = 400) => NextResponse.json({ error }, { status });

// "Air Fryers" -> "air-fryers". Names with no latin letters (for example Urdu) get a short code.
function slugify(name, taken) {
  const base = name.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "cat-" + crypto.randomBytes(3).toString("hex");
  let slug = base, n = 2;
  while (taken.has(slug)) slug = `${base}-${n++}`;
  return slug;
}

// Create (no "slug") or update (with "slug"). The web address of a category never changes after it is created.
export async function POST(req) {
  if (!sameOrigin(req)) return bad("Not allowed", 403);
  if (!(await isAdmin())) return deny();
  const fd = await req.formData();
  const s = (k, max) => (fd.get(k) || "").toString().trim().slice(0, max);
  const name = s("name", 60);
  if (!name) return bad("Category name is required");
  const blurb = s("blurb", 120);
  const slug = s("slug", 40);

  const cats = await getCategories();
  const existing = slug ? cats.find((c) => c.slug === slug) : null;
  if (slug && !existing) return bad("Category not found", 404);
  if (cats.some((c) => c.slug !== slug && c.name.toLowerCase() === name.toLowerCase())) return bad("A category with this name already exists");

  let img = existing?.img;
  const file = fd.get("image");
  if (file && typeof file !== "string" && file.size) {
    if (file.size > MAX) return bad("The photo is too large. Please use a smaller photo.");
    const buf = Buffer.from(await file.arrayBuffer());
    const type = sniffImage(buf);
    if (!type) return bad("Photo must be JPG, PNG or WEBP.");
    img = await saveImage(buf, type);
  }
  if (!img || !SAFE_IMAGE.test(img)) return bad("Please add a photo for the category.");

  await saveCategory(existing ? slug : slugify(name, new Set(cats.map((c) => c.slug))), { name, blurb, img });
  if (existing && existing.img !== img) await deleteImages([existing.img]);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req) {
  if (!sameOrigin(req)) return bad("Not allowed", 403);
  if (!(await isAdmin())) return deny();
  const slug = new URL(req.url).searchParams.get("slug") || "";
  const cats = await getCategories();
  const cat = cats.find((c) => c.slug === slug);
  if (!cat) return bad("Category not found", 404);
  if (cats.length <= 1) return bad("The shop needs at least one category.");
  const used = (await getProducts()).filter((p) => p.category === slug).length;
  if (used) return bad(`${used} product${used > 1 ? "s use" : " uses"} this category. Move or delete ${used > 1 ? "them" : "it"} first.`);
  await removeCategory(slug);
  await deleteImages([cat.img]);
  return NextResponse.json({ ok: true });
}
