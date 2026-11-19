import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { getProducts, saveProducts, isAdmin, UPLOADS } from "@/lib/store";
import { CATEGORIES } from "@/lib/site";

const TYPES = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" };
const MAX = 8 * 1024 * 1024;
const deny = () => NextResponse.json({ error: "Not allowed" }, { status: 401 });

async function saveImages(files) {
  await fs.mkdir(UPLOADS, { recursive: true });
  const urls = [];
  for (const f of files) {
    if (!f || typeof f === "string" || !f.size) continue;
    const ext = TYPES[f.type];
    if (!ext || f.size > MAX) throw new Error("Photos must be JPG, PNG or WEBP under 8 MB");
    const name = crypto.randomBytes(8).toString("hex") + ext;
    await fs.writeFile(path.join(UPLOADS, name), Buffer.from(await f.arrayBuffer()));
    urls.push("/api/img/" + name);
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
  const list = await getProducts();
  const id = s("id");
  const keep = fd.getAll("keep").map(String);
  const data = {
    name: s("name"),
    model: s("model"),
    brand: s("brand"),
    category: s("category"),
    price: s("price"),
    description: s("description"),
    specs: s("specs").split("\n").map((x) => x.trim()).filter(Boolean),
    featured: s("featured") === "on",
  };
  if (id) {
    const i = list.findIndex((p) => p.id === id);
    if (i < 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    list[i] = { ...list[i], ...data, images: [...keep, ...newImgs] };
  } else {
    list.unshift({ id: crypto.randomBytes(4).toString("hex"), ...data, images: newImgs });
  }
  await saveProducts(list);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req) {
  if (!(await isAdmin())) return deny();
  const id = new URL(req.url).searchParams.get("id");
  const list = await getProducts();
  await saveProducts(list.filter((p) => p.id !== id));
  return NextResponse.json({ ok: true });
}
