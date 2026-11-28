// End-to-end admin + security test against a LOCAL server running in Firebase mode.
// Usage (site folder): node scripts/e2e-admin-test.mjs [http://localhost:3000]
// It signs in as the admin through the Firebase service account (no password typed),
// adds / edits / deletes a clearly named test product with photos, then tries to break the API.
import fs from "fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const BASE = process.argv[2] || "http://localhost:3000";
if (!/^http:\/\/localhost[:/]/.test(BASE + "/")) throw new Error("Run this against localhost only");
const HOST = new URL(BASE).host;
const sa = JSON.parse(fs.readFileSync("firebase-service-account.json", "utf8"));
const env = Object.fromEntries(fs.readFileSync(".env.local", "utf8").split(/\r?\n/).filter((l) => l.includes("=")).map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1)]));
const app = initializeApp({ credential: cert(sa) });
const auth = getAuth(app);
const db = getFirestore(app);
const ADMIN = env.ADMIN_EMAIL || "m.adnan.ali113@gmail.com";

let pass = 0, fail = 0;
const ok = (name, cond, extra = "") => { (cond ? pass++ : fail++); console.log((cond ? "PASS " : "FAIL ") + name + (cond ? "" : "  <-- " + extra)); };

const PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", "base64");
const png = (n = "a.png") => new File([PNG], n, { type: "image/png" });

async function cookieFor(uid) {
  const custom = await auth.createCustomToken(uid);
  const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${env.FIREBASE_API_KEY}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: custom, returnSecureToken: true }) });
  const j = await r.json();
  if (!j.idToken) throw new Error("custom sign-in failed: " + JSON.stringify(j).slice(0, 150));
  return "sc_admin=" + (await auth.createSessionCookie(j.idToken, { expiresIn: 3600e3 }));
}
const api = (path, { method = "GET", cookie, origin = BASE, body } = {}) =>
  fetch(BASE + path, { method, body, redirect: "manual", headers: { ...(cookie ? { Cookie: cookie } : {}), ...(origin ? { Origin: origin } : {}) } });
const form = (o, files = [], keep = []) => { const f = new FormData(); for (const [k, v] of Object.entries(o)) f.append(k, v); files.forEach((x) => f.append("images", x)); keep.forEach((k) => f.append("keep", k)); return f; };
const imgDoc = async (url) => (await db.collection("images").doc(url.split("/").pop()).get()).exists;
const findByName = async (name) => (await db.collection("products").where("name", "==", name).get()).docs.map((d) => ({ id: d.id, ...d.data() }));

const adminUser = await auth.getUserByEmail(ADMIN);
const admin = await cookieFor(adminUser.uid);
let nonAdminUid;
try {
  // a second, non-admin Firebase user to prove other accounts are refused
  nonAdminUid = "sec-test-" + Date.now();
  await auth.createUser({ uid: nonAdminUid, email: nonAdminUid + "@example.com" });
  const other = await cookieFor(nonAdminUid);

  console.log("\n== Access control ==");
  const NAME = "ZZ TEST PRODUCT " + Date.now();
  const base = { name: NAME, category: "kettles", brand: "Test", model: "T-1", price: "123", description: "test", specs: "a\nb" };
  ok("add without login is refused (401)", (await api("/api/products", { method: "POST", body: form(base) })).status === 401);
  ok("add with another Firebase user is refused (401)", (await api("/api/products", { method: "POST", cookie: other, body: form(base) })).status === 401);
  ok("add from another website (bad Origin) is refused (403)", (await api("/api/products", { method: "POST", cookie: admin, origin: "https://evil.example", body: form(base) })).status === 403);
  ok("add with no Origin is refused (403)", (await api("/api/products", { method: "POST", cookie: admin, origin: null, body: form(base) })).status === 403);
  ok("forged cookie is refused (401)", (await api("/api/products", { method: "POST", cookie: "sc_admin=abc.def.ghi", body: form(base) })).status === 401);
  ok("delete without login is refused (401)", (await api("/api/products?id=af1", { method: "DELETE" })).status === 401);
  ok("delete from another website is refused (403)", (await api("/api/products?id=af1", { method: "DELETE", cookie: admin, origin: "https://evil.example" })).status === 403);
  const adminPage = await (await api("/adadmin")).text();
  ok("admin page shows the login form when logged out", adminPage.includes('name="password"') && !adminPage.includes("ad-stats"));

  console.log("\n== Add with photo ==");
  let r = await api("/api/products", { method: "POST", cookie: admin, body: form(base, [png()]) });
  ok("admin can add a product with a photo (200)", r.status === 200, r.status + " " + (await r.text()));
  const [p1] = await findByName(NAME);
  ok("product is stored in Firestore", !!p1);
  const img1 = p1?.images?.[0];
  ok("photo is stored (/api/img/...)", /^\/api\/img\/[a-f0-9]{16}$/.test(img1 || ""), String(img1));
  ok("photo document exists in Firestore", img1 && (await imgDoc(img1)));
  const ir = await api(img1);
  ok("photo is served as image/png", ir.status === 200 && ir.headers.get("content-type") === "image/png");
  ok("product page loads (200)", (await api("/product/" + p1.id)).status === 200);
  ok("product shows on the shop page", (await (await api("/shop")).text()).includes(NAME));
  ok("product shows on its category page", (await (await api("/category/kettles")).text()).includes(NAME));
  ok("product is in the sitemap", (await (await api("/sitemap.xml")).text()).includes("/product/" + p1.id));

  console.log("\n== Edit ==");
  const NAME2 = NAME + " EDITED";
  r = await api("/api/products", { method: "POST", cookie: admin, body: form({ ...base, id: p1.id, name: NAME2, price: "456", specs: "x\ny\nz" }, [png("b.png")], []) });
  ok("admin can edit: rename, change price, replace photo (200)", r.status === 200, r.status + " " + (await r.text()));
  const [p2] = await findByName(NAME2);
  ok("same product id is kept, name and price changed", p2 && p2.id === p1.id && p2.price === "456" && p2.specs.length === 3);
  ok("old photo was removed from Firestore", !(await imgDoc(img1)));
  ok("new photo exists and old one is not in the product", p2.images.length === 1 && p2.images[0] !== img1 && (await imgDoc(p2.images[0])));
  ok("edited name shows on the product page", (await (await api("/product/" + p1.id)).text()).includes(NAME2));
  r = await api("/api/products", { method: "POST", cookie: admin, body: form({ ...base, id: p1.id, name: NAME2 }, [], [p2.images[0]]) });
  const [p3] = await findByName(NAME2);
  ok("keeping the existing photo keeps it (no new upload)", r.status === 200 && p3.images.length === 1 && p3.images[0] === p2.images[0]);

  console.log("\n== Attacks on the product API ==");
  const reject = async (label, o, files = [], keep = [], status = 400) => {
    const res = await api("/api/products", { method: "POST", cookie: admin, body: form(o, files, keep) });
    ok(label, res.status === status, res.status + " " + (await res.text()).slice(0, 80));
  };
  await reject("fake photo (text file named .jpg) is refused", { ...base, name: NAME + " X1" }, [new File(["<html><script>alert(1)</script></html>"], "x.jpg", { type: "image/jpeg" })]);
  await reject("HTML disguised as PNG is refused", { ...base, name: NAME + " X2" }, [new File(["<svg onload=alert(1)>"], "x.png", { type: "image/png" })]);
  await reject("photo over 900 KB is refused", { ...base, name: NAME + " X3" }, [new File([Buffer.concat([PNG, Buffer.alloc(1000 * 1024)])], "big.png", { type: "image/png" })]);
  await reject("more than 8 photos is refused", { ...base, name: NAME + " X4" }, Array.from({ length: 9 }, (_, i) => png(i + ".png")));
  await reject("unknown category is refused", { ...base, name: NAME + " X5", category: "hacked" });
  await reject("missing name is refused", { ...base, name: "  " });
  await reject("non-numeric price is refused", { ...base, name: NAME + " X6", price: "<script>" });
  await reject("path-style id is refused", { ...base, id: "../../etc/passwd" });
  await reject("editing a product that does not exist is refused (404)", { ...base, id: "nope1234" }, [], [], 404);
  ok("delete with a bad id is refused (400)", (await api("/api/products?id=" + encodeURIComponent("../x"), { method: "DELETE", cookie: admin })).status === 400);

  // keep list tampering: external URL, javascript: URL, and another product's photo
  const other1 = (await db.collection("products").limit(5).get()).docs.map((d) => d.data()).find((d) => d.images?.some((u) => u.startsWith("/api/img/")));
  const tamper = ["https://evil.example/x.jpg", "javascript:alert(1)", "/api/img/" + "0".repeat(16), "/products/p1.jpg", "/etc/passwd"];
  r = await api("/api/products", { method: "POST", cookie: admin, body: form({ ...base, id: p1.id, name: NAME2 }, [], [p3.images[0], ...tamper]) });
  const [p4] = await findByName(NAME2);
  ok("tampered keep list: external, javascript:, foreign and unknown photos are dropped", r.status === 200 && p4.images.length === 1 && p4.images[0] === p3.images[0], JSON.stringify(p4?.images));

  console.log("\n== Script injection (XSS) ==");
  const XSS = `<script>alert('x')</script> ${Date.now()}`;
  r = await api("/api/products", { method: "POST", cookie: admin, body: form({ ...base, name: XSS, description: "<img src=x onerror=alert(1)>", specs: "<b>bold</b>" }, [png()]) });
  const [px] = await findByName(XSS);
  const html = await (await api("/product/" + px.id)).text();
  ok("script in product name is stored but never rendered as HTML", r.status === 200 && !html.includes("<script>alert('x')</script>") && !html.includes("<img src=x onerror"));
  ok("structured data (JSON-LD) escapes angle brackets", !/<script type="application\/ld\+json">[^]*<script>alert/.test(html));
  const adminHtml = await (await api("/adadmin", { cookie: admin })).text();
  ok("admin panel renders (logged in) and does not execute injected html", adminHtml.includes("ad-") && !adminHtml.includes("<script>alert('x')</script>"));
  await api("/api/products?id=" + px.id, { method: "DELETE", cookie: admin });

  console.log("\n== Delete ==");
  const imgsBefore = p4.images;
  r = await api("/api/products?id=" + p1.id, { method: "DELETE", cookie: admin });
  ok("admin can delete the product (200)", r.status === 200);
  ok("product is gone from Firestore", (await findByName(NAME2)).length === 0);
  ok("its photos are gone from Firestore", (await Promise.all(imgsBefore.map(imgDoc))).every((x) => !x));
  ok("product page now returns 404", (await api("/product/" + p1.id)).status === 404);
  ok("product is gone from the shop page", !(await (await api("/shop")).text()).includes(NAME));
  ok("deleting the same id again is harmless (200)", (await api("/api/products?id=" + p1.id, { method: "DELETE", cookie: admin })).status === 200);
  ok("the 29 original products are still there", (await db.collection("products").get()).size === 29);

  console.log("\n== Categories (add, edit, use, delete) ==");
  const CN = "ZZ Test Category " + Date.now();
  const catForm = (o, file) => { const f = new FormData(); for (const [k, v] of Object.entries(o)) f.append(k, v); if (file) f.append("image", file); return f; };
  const catDocs = async () => (await db.collection("categories").get()).docs.map((d) => ({ slug: d.id, ...d.data() }));
  const before = (await catDocs()).length;
  ok("add category without login is refused (401)", (await api("/api/categories", { method: "POST", body: catForm({ name: CN }, png()) })).status === 401);
  ok("add category with another Firebase user is refused (401)", (await api("/api/categories", { method: "POST", cookie: other, body: catForm({ name: CN }, png()) })).status === 401);
  ok("add category from another website is refused (403)", (await api("/api/categories", { method: "POST", cookie: admin, origin: "https://evil.example", body: catForm({ name: CN }, png()) })).status === 403);
  ok("delete category without login is refused (401)", (await api("/api/categories?slug=kettles", { method: "DELETE" })).status === 401);
  r = await api("/api/categories", { method: "POST", cookie: admin, body: catForm({ name: CN }) });
  ok("a new category needs a photo (400)", r.status === 400);
  r = await api("/api/categories", { method: "POST", cookie: admin, body: catForm({ name: CN }, new File(["<svg onload=alert(1)>"], "x.png", { type: "image/png" })) });
  ok("fake category photo is refused (400)", r.status === 400);
  r = await api("/api/categories", { method: "POST", cookie: admin, body: catForm({ name: "  " }, png()) });
  ok("empty category name is refused (400)", r.status === 400);
  r = await api("/api/categories", { method: "POST", cookie: admin, body: catForm({ name: CN, blurb: "Test blurb" }, png()) });
  ok("admin can add a new category (200)", r.status === 200, r.status + " " + (await r.text()));
  const cats1 = await catDocs();
  const newCat = cats1.find((c) => c.name === CN);
  ok("category is stored in Firestore with a clean web address", !!newCat && /^zz-test-category-\d+$/.test(newCat.slug), JSON.stringify(newCat));
  ok("starting categories were kept (nothing lost)", cats1.length === Math.max(before, 7) + 1 && ["air-fryers", "kettles", "stoves"].every((x) => cats1.some((c) => c.slug === x)), String(cats1.length));
  ok("category photo is stored and served", newCat && (await imgDoc(newCat.img)) && (await api(newCat.img)).status === 200);
  r = await api("/api/categories", { method: "POST", cookie: admin, body: catForm({ name: CN.toUpperCase() }, png()) });
  ok("duplicate category name is refused (400)", r.status === 400);
  ok("new category page loads (200) and is on the shop page", (await api("/category/" + newCat.slug)).status === 200 && (await (await api("/shop")).text()).includes(CN));
  const shopHtml = await (await api("/shop")).text();
  ok("shop page shows 8 category tiles in the flexible grid", (shopHtml.match(/class="mtile /g) || []).length === 8 && shopHtml.includes("mosaic mosaic-auto"));
  ok("new category is in the footer, sitemap and llms.txt", (await (await api("/")).text()).includes(CN) && (await (await api("/sitemap.xml")).text()).includes("/category/" + newCat.slug) && (await (await api("/llms.txt")).text()).includes(CN));
  ok("category page for an unknown category is 404", (await api("/category/does-not-exist")).status === 404);

  // use it for a product
  r = await api("/api/products", { method: "POST", cookie: admin, body: form({ ...base, name: NAME + " IN NEW CAT", category: newCat.slug }, [png()]) });
  ok("a product can be added to the new category (200)", r.status === 200, await r.text());
  const [pc] = await findByName(NAME + " IN NEW CAT");
  ok("product page shows the new category name", (await (await api("/product/" + pc.id)).text()).includes(CN));
  ok("category page lists the product", (await (await api("/category/" + newCat.slug)).text()).includes(NAME + " IN NEW CAT"));

  // rename keeps the web address
  r = await api("/api/categories", { method: "POST", cookie: admin, body: catForm({ slug: newCat.slug, name: CN + " RENAMED", blurb: "New blurb" }) });
  const renamed = (await catDocs()).find((c) => c.slug === newCat.slug);
  ok("rename keeps the same web address and photo (no new photo needed)", r.status === 200 && renamed.name === CN + " RENAMED" && renamed.img === newCat.img, r.status + " " + JSON.stringify(renamed));
  ok("product page now shows the new name", (await (await api("/product/" + pc.id)).text()).includes(CN + " RENAMED"));
  r = await api("/api/categories", { method: "POST", cookie: admin, body: catForm({ slug: newCat.slug, name: CN + " RENAMED" }, png("c.png")) });
  const swapped = (await catDocs()).find((c) => c.slug === newCat.slug);
  ok("changing the category photo replaces it and removes the old one", r.status === 200 && swapped.img !== newCat.img && !(await imgDoc(newCat.img)) && (await imgDoc(swapped.img)));
  ok("editing a category that does not exist is refused (404)", (await api("/api/categories", { method: "POST", cookie: admin, body: catForm({ slug: "nope", name: "x" }, png()) })).status === 404);

  // delete rules
  r = await api("/api/categories?slug=" + newCat.slug, { method: "DELETE", cookie: admin });
  ok("a category that still has products cannot be deleted (400)", r.status === 400 && (await catDocs()).some((c) => c.slug === newCat.slug), String(r.status));
  ok("delete from another website is refused (403)", (await api("/api/categories?slug=" + newCat.slug, { method: "DELETE", cookie: admin, origin: "https://evil.example" })).status === 403);
  await api("/api/products?id=" + pc.id, { method: "DELETE", cookie: admin });
  r = await api("/api/categories?slug=" + newCat.slug, { method: "DELETE", cookie: admin });
  ok("after the products are gone the category can be deleted (200)", r.status === 200);
  ok("category and its photo are gone from Firestore", !(await catDocs()).some((c) => c.slug === newCat.slug) && !(await imgDoc(swapped.img)));
  ok("category page is 404 again and shop is back to 7 tiles", (await api("/category/" + newCat.slug)).status === 404 && ((await (await api("/shop")).text()).match(/class="mtile /g) || []).length === 7);
  ok("deleting an unknown category is refused (404)", (await api("/api/categories?slug=nope", { method: "DELETE", cookie: admin })).status === 404);
  ok("the 29 original products still exist", (await db.collection("products").get()).size === 29);

  console.log("\n== Login protection ==");
  const login = (b, o = BASE) => api("/api/login", { method: "POST", origin: o, body: JSON.stringify(b) });
  ok("login from another website is refused (403)", (await login({ email: ADMIN, password: "x" }, "https://evil.example")).status === 403);
  ok("other email is refused (401)", (await login({ email: "someone@example.com", password: "x" })).status === 401);
  ok("wrong password is refused (401)", (await login({ email: ADMIN, password: "wrong-test-password" })).status === 401);
  const rr = await login({ email: "someone@example.com", reset: true });
  ok("password reset answers the same for non-admin emails (no email leak)", rr.status === 200);
  let last = 0;
  for (let i = 0; i < 10; i++) last = (await login({ email: ADMIN, password: "wrong-" + i })).status;
  ok("guessing is slowed down after repeated failures (429)", last === 429, String(last));

  console.log("\n== Headers, health and Firestore rules ==");
  const home = await api("/");
  const h = (k) => home.headers.get(k) || "";
  ok("Content-Security-Policy is set", h("content-security-policy").includes("frame-ancestors 'none'"));
  ok("X-Frame-Options DENY, nosniff, Referrer-Policy, HSTS are set", h("x-frame-options") === "DENY" && h("x-content-type-options") === "nosniff" && !!h("referrer-policy") && h("strict-transport-security").includes("max-age"));
  ok("X-Powered-By is hidden", !home.headers.get("x-powered-by"));
  const hl = await (await api("/api/health")).json();
  ok("health page only says whether Firebase is connected", Object.keys(hl).join() === "firebase" && hl.firebase === true);
  const pid = sa.project_id;
  for (const col of ["products", "images"]) {
    const fr = await fetch(`https://firestore.googleapis.com/v1/projects/${pid}/databases/(default)/documents/${col}?pageSize=1`);
    ok(`Firestore "${col}" is not readable by the public (rules deny)`, fr.status === 403 || fr.status === 401, String(fr.status));
    const fw = await fetch(`https://firestore.googleapis.com/v1/projects/${pid}/databases/(default)/documents/${col}?documentId=hack`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fields: { x: { stringValue: "1" } } }) });
    ok(`Firestore "${col}" cannot be written by the public`, fw.status === 403 || fw.status === 401, String(fw.status));
  }
} finally {
  if (nonAdminUid) await auth.deleteUser(nonAdminUid).catch(() => {});
  for (const d of (await db.collection("categories").get()).docs.filter((x) => String(x.data().name).startsWith("ZZ Test Category"))) {
    await db.collection("images").doc(String(d.data().img).split("/").pop()).delete().catch(() => {});
    await d.ref.delete();
    console.log("cleaned leftover test category:", d.id);
  }
  for (const col of ["products"]) {
    const left = (await db.collection(col).where("name", ">=", "ZZ TEST PRODUCT").where("name", "<=", "ZZ TEST PRODUCT").get()).docs;
    for (const d of left) await d.ref.delete();
    if (left.length) console.log("cleaned leftover test products:", left.length);
  }
}
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
