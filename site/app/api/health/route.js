import { NextResponse } from "next/server";
import { fb } from "@/lib/firebase";

export const dynamic = "force-dynamic";

// Shows whether Firebase is connected. Never prints any secret value.
export async function GET() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT || "";
  const out = {
    keySet: Boolean(raw),
    keyLength: raw.length,
    keyStartsWith: raw.trim().charAt(0) || null,
    apiKeySet: Boolean(process.env.FIREBASE_API_KEY),
    adminEmailSet: Boolean(process.env.ADMIN_EMAIL),
    firebaseConnected: false,
    firestoreRead: false,
  };
  const f = await fb();
  out.firebaseConnected = Boolean(f);
  if (f) {
    try {
      await f.db.collection("products").limit(1).get();
      out.firestoreRead = true;
    } catch (e) {
      out.firestoreError = e.code || e.name;
    }
  }
  return NextResponse.json(out, { headers: { "Cache-Control": "no-store" } });
}
