import { NextResponse } from "next/server";
import { fb } from "@/lib/firebase";

export const dynamic = "force-dynamic";

// Public status check. Only says whether Firebase is connected, nothing else.
export async function GET() {
  const f = await fb();
  let ok = false;
  if (f) {
    try {
      await f.db.collection("products").limit(1).get();
      ok = true;
    } catch {}
  }
  return NextResponse.json({ firebase: ok }, { status: ok ? 200 : 503, headers: { "Cache-Control": "no-store" } });
}
