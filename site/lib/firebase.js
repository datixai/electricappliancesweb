// Firebase (server side only). Products, photos and the admin login live in Firebase
// when the keys are set; without keys the site falls back to data/products.json (local dev).
import fs from "fs";
import path from "path";

let cached;
export let lastError = null;

// Accepts the JSON as pasted into Vercel: plain, wrapped in quotes, or base64.
function parseAccount(raw) {
  let t = String(raw).trim();
  if (/^(["'`]).*\1$/s.test(t)) t = t.slice(1, -1);
  if (!t.startsWith("{")) t = Buffer.from(t, "base64").toString("utf8");
  const sa = JSON.parse(t);
  if (sa.private_key) sa.private_key = sa.private_key.replace(/\\n/g, "\n");
  return sa;
}

function serviceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) return parseAccount(process.env.FIREBASE_SERVICE_ACCOUNT);
  const file = path.join(process.cwd(), "firebase-service-account.json");
  if (fs.existsSync(file)) return parseAccount(fs.readFileSync(file, "utf8"));
  return null;
}

export function firebaseReady() {
  return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT || fs.existsSync(path.join(process.cwd(), "firebase-service-account.json")));
}

export async function fb() {
  if (cached) return cached;
  try {
    const sa = serviceAccount();
    if (!sa) return null;
    const { initializeApp, getApps, cert } = await import("firebase-admin/app");
    const { getFirestore } = await import("firebase-admin/firestore");
    const { getAuth } = await import("firebase-admin/auth");
    const app = getApps()[0] || initializeApp({ credential: cert(sa) });
    cached = { db: getFirestore(app), auth: getAuth(app) };
    return cached;
  } catch (e) {
    // Do not take the whole site down for a bad key: public pages fall back to the bundled products.
    console.error("Firebase setup failed:", e.message);
    lastError = { name: e.name, code: e.code || null, step: e.step || null, message: e.name === "SyntaxError" ? "invalid JSON" : String(e.message).slice(0, 160) };
    return null;
  }
}

export const ADMIN_EMAIL = () => (process.env.ADMIN_EMAIL || "m.adnan.ali113@gmail.com").trim().toLowerCase();
