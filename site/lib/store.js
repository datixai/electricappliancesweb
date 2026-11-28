import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { cookies } from "next/headers";
import { cache } from "react";
import { fb, ADMIN_EMAIL } from "./firebase";
import { DEFAULT_CATEGORIES } from "./site";

const DATA = path.join(process.cwd(), "data");
const FILE = path.join(DATA, "products.json");
const CATS_FILE = path.join(DATA, "categories.json");
export const COOKIE = "sc_admin";

// ---------- Products ----------
// Firestore collection "products" (one document per product, sorted by "order", lowest first).

async function readJson() {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch {
    return [];
  }
}

export const getCategories = cache(async () => {
  const f = await fb();
  let list = null;
  if (!f) {
    try {
      list = JSON.parse(await fs.readFile(CATS_FILE, "utf8"));
    } catch {}
  } else {
    try {
      const snap = await f.db.collection("categories").orderBy("order").get();
      if (!snap.empty) list = snap.docs.map((d) => ({ slug: d.id, ...d.data() }));
    } catch (e) {
      console.error("Firestore categories read failed", e.message);
    }
  }
  return (list && list.length ? list : DEFAULT_CATEGORIES).map(({ slug, name, blurb, img }) => ({ slug, name, blurb: blurb || "", img }));
});

export async function getProducts() {
  const [list, cats] = await Promise.all([readProducts(), getCategories()]);
  const names = Object.fromEntries(cats.map((c) => [c.slug, c.name]));
  return list.map((p) => ({ ...p, categoryName: names[p.category] || p.category }));
}

async function readProducts() {
  const f = await fb();
  if (!f) return readJson();
  try {
    const snap = await f.db.collection("products").orderBy("order").get();
    return snap.docs.map((d) => {
      const { order, updatedAt, ...p } = d.data();
      return { ...p, id: d.id };
    });
  } catch (e) {
    console.error("Firestore read failed", e.message);
    return readJson();
  }
}

// ---------- Categories (admin) ----------
// The first change writes the starting categories into Firestore, so nothing is lost.
export async function saveCategory(slug, data) {
  const current = await getCategories();
  const f = await fb();
  if (!f) {
    const i = current.findIndex((c) => c.slug === slug);
    const next = i >= 0 ? current.map((c, k) => (k === i ? { ...c, ...data, slug } : c)) : [...current, { slug, ...data }];
    await fs.mkdir(DATA, { recursive: true });
    await fs.writeFile(CATS_FILE, JSON.stringify(next, null, 2));
    return;
  }
  const col = f.db.collection("categories");
  if ((await col.limit(1).get()).empty) {
    const batch = f.db.batch();
    current.forEach((c, i) => batch.set(col.doc(c.slug), { name: c.name, blurb: c.blurb, img: c.img, order: i }));
    await batch.commit();
  }
  const ref = col.doc(slug);
  if ((await ref.get()).exists) await ref.set({ ...data, updatedAt: Date.now() }, { merge: true });
  else await ref.set({ ...data, order: current.length + 1, updatedAt: Date.now() });
}

export async function removeCategory(slug) {
  const current = await getCategories();
  const f = await fb();
  if (!f) {
    await fs.mkdir(DATA, { recursive: true });
    await fs.writeFile(CATS_FILE, JSON.stringify(current.filter((c) => c.slug !== slug), null, 2));
    return;
  }
  const col = f.db.collection("categories");
  if ((await col.limit(1).get()).empty) {
    const batch = f.db.batch();
    current.forEach((c, i) => batch.set(col.doc(c.slug), { name: c.name, blurb: c.blurb, img: c.img, order: i }));
    await batch.commit();
  }
  await col.doc(slug).delete();
}

export async function upsertProduct(id, data) {
  const f = await fb();
  if (!f) {
    const list = await readJson();
    const i = list.findIndex((p) => p.id === id);
    if (i >= 0) list[i] = { ...list[i], ...data, id };
    else list.unshift({ id, ...data });
    await fs.writeFile(FILE, JSON.stringify(list, null, 2));
    return;
  }
  const ref = f.db.collection("products").doc(id);
  const exists = (await ref.get()).exists;
  // New products go to the top of the list.
  await ref.set({ ...data, ...(exists ? {} : { order: -Date.now() }), updatedAt: Date.now() }, { merge: true });
}

export async function deleteProduct(id) {
  const f = await fb();
  if (!f) {
    const list = await readJson();
    await fs.writeFile(FILE, JSON.stringify(list.filter((p) => p.id !== id), null, 2));
    return;
  }
  const ref = f.db.collection("products").doc(id);
  const snap = await ref.get();
  const imgs = snap.data()?.images || [];
  await ref.delete();
  await deleteImages(imgs);
}

// ---------- Photos ----------
// The free Firebase plan has no Cloud Storage, so photos are resized in the browser
// (about 150-300 KB) and kept in the Firestore collection "images" (limit 1 MB each).

export async function saveImage(buf, type) {
  const name = crypto.randomBytes(8).toString("hex");
  const f = await fb();
  if (!f) {
    const dir = path.join(DATA, "uploads");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, name), buf);
    await fs.writeFile(path.join(dir, name + ".type"), type);
  } else {
    await f.db.collection("images").doc(name).set({ type, data: buf, createdAt: Date.now() });
  }
  return "/api/img/" + name;
}

// Delete uploaded photos by url (bundled seed photos under /products are never touched).
export async function deleteImages(urls) {
  const names = (urls || []).filter((u) => /^\/api\/img\/[a-f0-9]{16}$/.test(u)).map((u) => u.split("/").pop());
  const f = await fb();
  if (!f) {
    const dir = path.join(DATA, "uploads");
    await Promise.all(names.flatMap((n) => [fs.rm(path.join(dir, n), { force: true }), fs.rm(path.join(dir, n + ".type"), { force: true })]));
    return;
  }
  await Promise.all(names.map((n) => f.db.collection("images").doc(n).delete().catch(() => {})));
}

export async function readImage(name) {
  const f = await fb();
  if (!f) {
    const dir = path.join(DATA, "uploads");
    try {
      return { buf: await fs.readFile(path.join(dir, name)), type: await fs.readFile(path.join(dir, name + ".type"), "utf8") };
    } catch {
      return null;
    }
  }
  const snap = await f.db.collection("images").doc(name).get();
  if (!snap.exists) return null;
  const d = snap.data();
  return { buf: Buffer.from(d.data), type: d.type };
}

// ---------- Admin session ----------
// With Firebase: a Firebase session cookie for the admin email only.
// Without Firebase (local dev): ADMIN_EMAIL + ADMIN_PASSWORD from .env.local.

export const localToken = () =>
  crypto.createHash("sha256").update("sc-admin:" + (process.env.ADMIN_PASSWORD || "")).digest("hex");

export async function isAdmin() {
  const c = (await cookies()).get(COOKIE)?.value;
  if (!c) return false;
  const f = await fb();
  if (!f) return Boolean(process.env.ADMIN_PASSWORD) && c === localToken();
  try {
    const user = await f.auth.verifySessionCookie(c, true);
    return (user.email || "").toLowerCase() === ADMIN_EMAIL();
  } catch {
    return false;
  }
}
