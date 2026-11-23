import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { cookies } from "next/headers";
import { fb, ADMIN_EMAIL } from "./firebase";

const DATA = path.join(process.cwd(), "data");
const FILE = path.join(DATA, "products.json");
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

export async function getProducts() {
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
  const imgs = (snap.data()?.images || []).filter((u) => u.startsWith("/api/img/"));
  await ref.delete();
  await Promise.all(imgs.map((u) => f.db.collection("images").doc(u.split("/").pop()).delete().catch(() => {})));
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
