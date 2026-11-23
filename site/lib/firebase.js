// Firebase (server side only). Products, photos and the admin login live in Firebase
// when the keys are set; without keys the site falls back to data/products.json (local dev).
import fs from "fs";
import path from "path";

let cached;

function serviceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  const file = path.join(process.cwd(), "firebase-service-account.json");
  if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, "utf8"));
  return null;
}

export function firebaseReady() {
  return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT || fs.existsSync(path.join(process.cwd(), "firebase-service-account.json")));
}

export async function fb() {
  if (cached) return cached;
  const sa = serviceAccount();
  if (!sa) return null;
  const { initializeApp, getApps, cert } = await import("firebase-admin/app");
  const { getFirestore } = await import("firebase-admin/firestore");
  const { getAuth } = await import("firebase-admin/auth");
  const app = getApps()[0] || initializeApp({ credential: cert(sa) });
  cached = { db: getFirestore(app), auth: getAuth(app) };
  return cached;
}

export const ADMIN_EMAIL = () => (process.env.ADMIN_EMAIL || "m.adnan.ali113@gmail.com").trim().toLowerCase();
