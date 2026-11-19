import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { cookies } from "next/headers";

const DATA = path.join(process.cwd(), "data");
const FILE = path.join(DATA, "products.json");
export const UPLOADS = path.join(DATA, "uploads");

export async function getProducts() {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch {
    return [];
  }
}

export async function saveProducts(list) {
  await fs.mkdir(DATA, { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(list, null, 2));
}

export const adminToken = () =>
  crypto.createHash("sha256").update("sc-admin:" + (process.env.ADMIN_PASSWORD || "")).digest("hex");

export async function isAdmin() {
  if (!process.env.ADMIN_PASSWORD) return false;
  const c = (await cookies()).get("sc_admin")?.value;
  return c === adminToken();
}
