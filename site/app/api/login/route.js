import { NextResponse } from "next/server";
import crypto from "crypto";
import { fb, ADMIN_EMAIL } from "@/lib/firebase";
import { COOKIE, localToken } from "@/lib/store";

const DAYS = 5;
const fail = (msg = "Wrong email or password.", status = 401) => NextResponse.json({ error: msg }, { status });
const same = (a, b) => a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));

export async function POST(req) {
  const { email = "", password = "", reset } = await req.json().catch(() => ({}));
  const mail = String(email).trim().toLowerCase();
  if (mail !== ADMIN_EMAIL()) return fail();
  const f = await fb();
  const key = process.env.FIREBASE_API_KEY;

  // "Forgot password": Firebase emails a reset link to the admin email.
  if (reset) {
    if (!f || !key) return fail("Password reset needs Firebase.", 400);
    await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestType: "PASSWORD_RESET", email: mail }),
    });
    return NextResponse.json({ ok: true });
  }

  let cookie;
  if (f && key) {
    const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: mail, password: String(password), returnSecureToken: true }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.idToken) return fail();
    cookie = await f.auth.createSessionCookie(j.idToken, { expiresIn: DAYS * 864e5 });
  } else {
    const real = process.env.ADMIN_PASSWORD || "";
    if (!real || !same(String(password), real)) return fail();
    cookie = localToken();
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, cookie, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: DAYS * 86400 });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(COOKIE);
  return res;
}
