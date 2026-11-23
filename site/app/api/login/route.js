import { NextResponse } from "next/server";
import crypto from "crypto";
import { fb, ADMIN_EMAIL } from "@/lib/firebase";
import { COOKIE, localToken } from "@/lib/store";
import { sameOrigin, tooMany } from "@/lib/security";

const DAYS = 5;
const fail = (msg = "Wrong email or password.", status = 401) => NextResponse.json({ error: msg }, { status });
const same = (a, b) => a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));

export async function POST(req) {
  if (!sameOrigin(req)) return fail("Not allowed", 403);
  const body = await req.json().catch(() => ({}));
  const mail = String(body.email || "").trim().toLowerCase().slice(0, 200);
  const password = String(body.password || "").slice(0, 200);
  const f = await fb();
  const key = process.env.FIREBASE_API_KEY;

  // "Forgot password": Firebase emails a reset link, only if this is the admin email.
  // The answer is always the same, so nobody can use it to find out which email is the admin.
  if (body.reset) {
    if (tooMany(req, "reset", 3, 60 * 60 * 1000)) return fail("Too many requests. Please try again later.", 429);
    if (f && key && mail === ADMIN_EMAIL()) {
      await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${key}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestType: "PASSWORD_RESET", email: mail }),
      });
    }
    return NextResponse.json({ ok: true });
  }

  // Slow down password guessing: 8 tries per 15 minutes from one address.
  if (tooMany(req, "login", 8, 15 * 60 * 1000)) return fail("Too many attempts. Please wait 15 minutes and try again.", 429);
  if (mail !== ADMIN_EMAIL()) return fail();

  let cookie;
  if (f && key) {
    const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: mail, password, returnSecureToken: true }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.idToken) return fail();
    cookie = await f.auth.createSessionCookie(j.idToken, { expiresIn: DAYS * 864e5 });
  } else {
    const real = process.env.ADMIN_PASSWORD || "";
    if (!real || !same(password, real)) return fail();
    cookie = localToken();
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, cookie, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: DAYS * 86400 });
  return res;
}

export async function DELETE(req) {
  if (!sameOrigin(req)) return fail("Not allowed", 403);
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(COOKIE);
  return res;
}
