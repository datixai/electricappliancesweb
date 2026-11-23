// Crawl the site and report broken internal links and images. Usage: node scripts/check-links.mjs [base]
const BASE = process.argv[2] || "http://localhost:3000";
const seen = new Map(), queue = ["/"], bad = [], assets = new Set();
const attr = /(?:href|src)="([^"#]+)(?:#[^"]*)?"/g;
while (queue.length) {
  const path = queue.shift();
  if (seen.has(path)) continue;
  const r = await fetch(BASE + path, { redirect: "follow" });
  seen.set(path, r.status);
  if (r.status >= 400) { bad.push([path, r.status]); continue; }
  if (!(r.headers.get("content-type") || "").includes("text/html")) continue;
  const html = await r.text();
  for (const m of html.matchAll(attr)) {
    let u = m[1].replace(/&amp;/g, "&");
    if (/^(https?:|mailto:|tel:|data:|javascript:|\/\/)/.test(u)) continue;
    if (!u.startsWith("/")) continue;
    if (u.startsWith("/_next/") || /\.(jpg|png|svg|webp|ico|css|js|txt|xml)(\?|$)/.test(u) || u.startsWith("/api/img/")) assets.add(u);
    else if (!seen.has(u)) queue.push(u);
  }
}
for (const a of assets) { const r = await fetch(BASE + a); if (r.status >= 400) bad.push([a, r.status]); }
console.log(`pages checked: ${seen.size}, assets checked: ${assets.size}`);
console.log(bad.length ? "BROKEN:\n" + bad.map((b) => b.join("  ")).join("\n") : "no broken internal links or images");
