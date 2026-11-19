import { NextResponse } from "next/server";
import crypto from "crypto";
import { adminToken } from "@/lib/store";

export async function POST(req) {
  const { password } = await req.json().catch(() => ({}));
  const real = process.env.ADMIN_PASSWORD || "";
  const ok =
    real &&
    typeof password === "string" &&
    password.length === real.length &&
    crypto.timingSafeEqual(Buffer.from(password), Buffer.from(real));
  if (!ok) return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set("sc_admin", adminToken(), { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("sc_admin");
  return res;
}
