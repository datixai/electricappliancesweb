"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function Login() {
  const router = useRouter();
  const [err, setErr] = useState("");
  async function submit(e) {
    e.preventDefault();
    const password = new FormData(e.target).get("password");
    const r = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    if (r.ok) router.refresh();
    else setErr("Wrong password");
  }
  return (
    <section className="wrap section">
      <form className="login" onSubmit={submit}>
        <h1>Admin login</h1>
        <input type="password" name="password" placeholder="Password" required autoFocus />
        <button className="btn-gold" type="submit">Log in</button>
        {err && <p className="err">{err}</p>}
      </form>
    </section>
  );
}

const EMPTY = { id: "", name: "", model: "", brand: "", category: "", price: "", description: "", specs: [], images: [], featured: false };

export default function AdminPanel({ products, categories }) {
  const router = useRouter();
  const [edit, setEdit] = useState(EMPTY);
  const [keep, setKeep] = useState([]);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState("");

  function startEdit(p) {
    setEdit(p);
    setKeep(p.images || []);
    setMsg("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const fd = new FormData(e.target);
    keep.forEach((k) => fd.append("keep", k));
    const r = await fetch("/api/products", { method: "POST", body: fd });
    const j = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) return setMsg(j.error || "Could not save");
    setMsg(edit.id ? "Product updated" : "Product added");
    setEdit(EMPTY);
    setKeep([]);
    e.target.reset();
    router.refresh();
  }

  async function remove(p) {
    if (!confirm(`Delete "${p.name}"?`)) return;
    await fetch("/api/products?id=" + encodeURIComponent(p.id), { method: "DELETE" });
    router.refresh();
  }

  async function logout() {
    await fetch("/api/login", { method: "DELETE" });
    router.refresh();
  }

  const shown = products.filter((p) => !filter || p.category === filter);

  return (
    <section className="wrap section admin">
      <div className="sec-head row">
        <h1>Admin panel</h1>
        <button className="btn-ghost dark" onClick={logout}>Log out</button>
      </div>

      <form key={edit.id || "new"} className="aform" onSubmit={save}>
        <h2>{edit.id ? "Edit product" : "Add new product"}</h2>
        <input type="hidden" name="id" defaultValue={edit.id} />
        <div className="f2">
          <label>Product name *<input name="name" defaultValue={edit.name} required /></label>
          <label>Category *
            <select name="category" defaultValue={edit.category} required>
              <option value="">Choose category</option>
              {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </label>
          <label>Brand<input name="brand" defaultValue={edit.brand} /></label>
          <label>Model number<input name="model" defaultValue={edit.model} /></label>
          <label>Price in AED (empty = "Ask for price")<input name="price" defaultValue={edit.price} inputMode="decimal" /></label>
          <label className="check"><input type="checkbox" name="featured" defaultChecked={edit.featured} /> Show in Best sellers</label>
        </div>
        <label>Description<textarea name="description" rows={3} defaultValue={edit.description} /></label>
        <label>Features (one per line)<textarea name="specs" rows={4} defaultValue={(edit.specs || []).join("\n")} /></label>
        {keep.length > 0 && (
          <div className="keep">
            {keep.map((k) => (
              <div key={k}><img src={k} alt="" /><button type="button" onClick={() => setKeep(keep.filter((x) => x !== k))}>Remove</button></div>
            ))}
          </div>
        )}
        <label>Photos (JPG, PNG or WEBP, you can pick several)<input type="file" name="images" accept="image/jpeg,image/png,image/webp" multiple /></label>
        <div className="row gap">
          <button className="btn-gold" disabled={busy}>{busy ? "Saving..." : edit.id ? "Save changes" : "Add product"}</button>
          {edit.id && <button type="button" className="btn-ghost dark" onClick={() => { setEdit(EMPTY); setKeep([]); }}>Cancel</button>}
          {msg && <span className="ok">{msg}</span>}
        </div>
      </form>

      <div className="sec-head row">
        <h2>All products ({shown.length})</h2>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter by category">
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
      </div>
      <div className="atable">
        {shown.map((p) => (
          <div key={p.id} className="arow">
            <img src={p.images?.[0] || "/products/p1.jpg"} alt="" />
            <div><b>{p.name}</b><span className="muted">{categories.find((c) => c.slug === p.category)?.name} | {p.model}</span></div>
            <button className="btn-ghost dark" onClick={() => startEdit(p)}>Edit</button>
            <button className="btn-del" onClick={() => remove(p)}>Delete</button>
          </div>
        ))}
      </div>
    </section>
  );
}
