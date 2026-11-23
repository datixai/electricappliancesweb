"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Emblem } from "@/components/ui";

export function Login() {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const call = (body) => fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    setNote("");
    const fd = new FormData(e.target);
    const r = await call({ email: fd.get("email"), password: fd.get("password") });
    setBusy(false);
    if (r.ok) router.refresh();
    else setErr("Wrong email or password. Please try again.");
  }
  async function forgot(e) {
    const email = e.target.form.email.value.trim();
    setErr("");
    if (!email) return setErr("Type the admin email first.");
    const r = await call({ email, reset: true });
    if (r.ok) setNote("A password reset link has been sent to " + email + ".");
    else setErr("Could not send a reset link for this email.");
  }
  return (
    <div className="ad-login">
      <form onSubmit={submit} className="ad-login-card">
        <Emblem size={64} />
        <h1>Admin panel</h1>
        <p>Adnan Electronics Household</p>
        <label>Email<input type="email" name="email" required autoFocus autoComplete="username" /></label>
        <label>Password<input type="password" name="password" required autoComplete="current-password" /></label>
        <button className="ad-btn gold" disabled={busy}>{busy ? "Checking..." : "Log in"}</button>
        <button type="button" className="ad-forgot" onClick={forgot}>Forgot password?</button>
        {err && <p className="ad-err">{err}</p>}
        {note && <p className="ad-note">{note}</p>}
        <a href="/" className="ad-back">Back to website</a>
      </form>
    </div>
  );
}

// Resize a photo in the browser to max 1400 px and JPEG, so it stays well under 1 MB.
async function shrink(file) {
  const bmp = await createImageBitmap(file);
  let side = 1400;
  for (let q = 0.85; ; q -= 0.1) {
    const scale = Math.min(1, side / Math.max(bmp.width, bmp.height));
    const cv = document.createElement("canvas");
    cv.width = Math.round(bmp.width * scale);
    cv.height = Math.round(bmp.height * scale);
    const cx = cv.getContext("2d");
    cx.fillStyle = "#fff";
    cx.fillRect(0, 0, cv.width, cv.height);
    cx.drawImage(bmp, 0, 0, cv.width, cv.height);
    const blob = await new Promise((r) => cv.toBlob(r, "image/jpeg", q));
    if (blob.size < 700 * 1024 || q < 0.5) return blob;
    side = Math.round(side * 0.8);
  }
}

const EMPTY = { id: "", name: "", model: "", brand: "", category: "", price: "", description: "", specs: [], images: [], featured: false };

export default function AdminPanel({ products, categories }) {
  const router = useRouter();
  const [edit, setEdit] = useState(EMPTY);
  const [keep, setKeep] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState("");
  const [q, setQ] = useState("");

  useEffect(() => () => previews.forEach((u) => URL.revokeObjectURL(u)), [previews]);

  const catName = (slug) => categories.find((c) => c.slug === slug)?.name || slug;
  const shown = useMemo(
    () =>
      products.filter(
        (p) => (!filter || p.category === filter) && (!q || [p.name, p.brand, p.model].join(" ").toLowerCase().includes(q.toLowerCase()))
      ),
    [products, filter, q]
  );

  function reset(form) {
    setEdit(EMPTY);
    setKeep([]);
    setPreviews([]);
    form?.reset();
  }

  function startEdit(p) {
    setEdit(p);
    setKeep(p.images || []);
    setPreviews([]);
    setMsg(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const fd = new FormData(e.target);
    keep.forEach((k) => fd.append("keep", k));
    const files = fd.getAll("images").filter((f) => f && f.size);
    fd.delete("images");
    try {
      for (const f of files) fd.append("images", await shrink(f), "photo.jpg");
    } catch {
      setBusy(false);
      return setMsg({ ok: false, text: "One of the photos could not be read. Please use a JPG, PNG or WEBP photo." });
    }
    const r = await fetch("/api/products", { method: "POST", body: fd });
    const j = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) return setMsg({ ok: false, text: j.error || "Could not save. Please try again." });
    setMsg({ ok: true, text: edit.id ? "Product updated." : "Product added. It is now live on the website." });
    reset(e.target);
    router.refresh();
  }

  async function remove(p) {
    if (!confirm(`Delete "${p.name}" from the website?`)) return;
    const r = await fetch("/api/products?id=" + encodeURIComponent(p.id), { method: "DELETE" });
    setMsg(r.ok ? { ok: true, text: "Product deleted." } : { ok: false, text: "Could not delete." });
    router.refresh();
  }

  async function logout() {
    await fetch("/api/login", { method: "DELETE" });
    router.refresh();
  }

  const counts = Object.fromEntries(categories.map((c) => [c.slug, products.filter((p) => p.category === c.slug).length]));

  return (
    <div className="ad">
      <header className="ad-top">
        <div className="ad-brand"><Emblem size={38} /><div><b>Adnan Electronics Household</b><span>Admin panel</span></div></div>
        <div className="ad-top-actions">
          <a href="/" target="_blank" rel="noopener" className="ad-btn ghost">View website</a>
          <button onClick={logout} className="ad-btn ghost">Log out</button>
        </div>
      </header>

      <div className="ad-wrap">
        <section className="ad-stats">
          <div><span>Products</span><b>{products.length}</b></div>
          <div><span>Best sellers</span><b>{products.filter((p) => p.featured).length}</b></div>
          <div><span>Categories</span><b>{categories.length}</b></div>
          <div><span>With a price</span><b>{products.filter((p) => p.price).length}</b></div>
        </section>

        {msg && <p className={"ad-msg " + (msg.ok ? "ok" : "bad")}>{msg.text}</p>}

        <div className="ad-main">
          <form key={edit.id || "new"} className="ad-card ad-form" onSubmit={save}>
            <div className="ad-card-head">
              <h2>{edit.id ? "Edit product" : "Add a new product"}</h2>
              {edit.id && <button type="button" className="ad-link" onClick={() => reset()}>+ New product</button>}
            </div>
            <input type="hidden" name="id" defaultValue={edit.id} />
            <label>Product name *<input name="name" defaultValue={edit.name} required placeholder="e.g. Silver Crest 16L Air Fryer" /></label>
            <label>Category *
              <select name="category" defaultValue={edit.category} required>
                <option value="">Choose a category</option>
                {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </label>
            <div className="ad-2">
              <label>Brand<input name="brand" defaultValue={edit.brand} placeholder="e.g. Silver Crest" /></label>
              <label>Model<input name="model" defaultValue={edit.model} placeholder="e.g. SC-7099LED" /></label>
            </div>
            <label>Price in AED<input name="price" defaultValue={edit.price} inputMode="decimal" placeholder="Leave empty to show a demo price" /></label>
            <label>Description<textarea name="description" rows={3} defaultValue={edit.description} placeholder="One or two sentences about the product" /></label>
            <label>Features (one per line)<textarea name="specs" rows={4} defaultValue={(edit.specs || []).join("\n")} placeholder={"16 L capacity\nLCD touch control"} /></label>

            <div className="ad-photos">
              <span>Photos</span>
              <div className="ad-thumbs">
                {keep.map((k) => (
                  <div key={k} className="ad-thumb"><img src={k} alt="" /><button type="button" onClick={() => setKeep(keep.filter((x) => x !== k))} aria-label="Remove photo">×</button></div>
                ))}
                {previews.map((u) => (
                  <div key={u} className="ad-thumb new"><img src={u} alt="" /><em>New</em></div>
                ))}
                <label className="ad-drop">
                  <input type="file" name="images" accept="image/jpeg,image/png,image/webp" multiple onChange={(e) => setPreviews([...e.target.files].map((f) => URL.createObjectURL(f)))} />
                  <b>+</b><span>Add photos</span>
                </label>
              </div>
              <small>JPG, PNG or WEBP, any size (resized automatically). The first photo is the main one.</small>
            </div>

            <label className="ad-check"><input type="checkbox" name="featured" defaultChecked={edit.featured} /> Show in Best sellers on the home page</label>
            <div className="ad-actions">
              <button className="ad-btn gold" disabled={busy}>{busy ? "Saving..." : edit.id ? "Save changes" : "Add product"}</button>
              {edit.id && <button type="button" className="ad-btn ghost dark" onClick={() => reset()}>Cancel</button>}
            </div>
          </form>

          <section className="ad-card ad-list">
            <div className="ad-card-head">
              <h2>Products <span>{shown.length}</span></h2>
              <input className="ad-search" placeholder="Search name, brand or model" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search products" />
            </div>
            <div className="ad-tabs">
              <button className={!filter ? "on" : ""} onClick={() => setFilter("")}>All <span>{products.length}</span></button>
              {categories.map((c) => (
                <button key={c.slug} className={filter === c.slug ? "on" : ""} onClick={() => setFilter(c.slug)}>{c.name} <span>{counts[c.slug]}</span></button>
              ))}
            </div>
            <div className="ad-rows">
              {shown.map((p) => (
                <div key={p.id} className={"ad-row" + (edit.id === p.id ? " editing" : "")}>
                  <img src={p.images?.[0] || "/products/p1.jpg"} alt="" />
                  <div className="ad-row-info">
                    <b>{p.name}</b>
                    <span>{catName(p.category)}{p.model ? " | " + p.model : ""}{p.price ? " | AED " + p.price : ""}</span>
                    {p.featured && <em>Best seller</em>}
                  </div>
                  <div className="ad-row-actions">
                    <a href={`/product/${p.id}`} target="_blank" rel="noopener" className="ad-link">View</a>
                    <button className="ad-btn ghost dark sm" onClick={() => startEdit(p)}>Edit</button>
                    <button className="ad-btn danger sm" onClick={() => remove(p)}>Delete</button>
                  </div>
                </div>
              ))}
              {!shown.length && <p className="ad-empty">No products match.</p>}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
