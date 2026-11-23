// Small security helpers shared by the API routes.

// Blocks cross-site requests: a browser always sends Origin (or Referer) on POST/DELETE,
// so the request must come from this same site.
export function sameOrigin(req) {
  const host = req.headers.get("host");
  const from = req.headers.get("origin") || req.headers.get("referer");
  if (!host || !from) return false;
  try {
    return new URL(from).host === host;
  } catch {
    return false;
  }
}

// Simple in-memory rate limit (per server instance; Firebase also limits sign-ins itself).
const hits = new Map();
export function tooMany(req, bucket, max, windowMs) {
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  const key = bucket + ":" + ip;
  const now = Date.now();
  const list = (hits.get(key) || []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(key, list);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
  return list.length > max;
}

// Real file type from the first bytes, so a renamed file cannot pass as a photo.
export function sniffImage(buf) {
  if (buf.length > 12 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.length > 12 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (buf.length > 12 && buf.subarray(0, 4).toString("latin1") === "RIFF" && buf.subarray(8, 12).toString("latin1") === "WEBP") return "image/webp";
  return null;
}

// Existing images a product may keep: its uploaded photos or the bundled seed photos.
export const SAFE_IMAGE = /^(\/api\/img\/[a-f0-9]{16}|\/products\/p\d{1,3}\.jpg)$/;
export const SAFE_ID = /^[a-zA-Z0-9_-]{1,40}$/;
