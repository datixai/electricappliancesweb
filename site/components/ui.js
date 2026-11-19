import Link from "next/link";
import { SITE, CATEGORIES, waLink, catName } from "@/lib/site";

export function Logo({ light }) {
  return (
    <Link href="/" className={"logo" + (light ? " light" : "")} aria-label={SITE.name + " home"}>
      <svg viewBox="0 0 48 48" width="44" height="44" aria-hidden="true">
        <defs>
          <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffd34d" />
            <stop offset="1" stopColor="#e09b00" />
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="22" fill="none" stroke="url(#lg)" strokeWidth="3" />
        <text x="24" y="32" textAnchor="middle" fontSize="24" fontWeight="800" fill="url(#lg)" fontFamily="Georgia, serif">A</text>
      </svg>
      <span>
        <b>ADNAN ELECTRONICS</b>
        <small>Household <span lang="fa" dir="rtl">لوازم خانگی</span></small>
      </span>
    </Link>
  );
}

export function WaIcon({ size = 22 }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true" fill="currentColor">
      <path d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3zm0 23.6a10.6 10.6 0 0 1-5.4-1.5l-.4-.2-3.9 1 1-3.8-.2-.4A10.6 10.6 0 1 1 16 26.6zm5.8-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7 0a8.7 8.7 0 0 1-4.3-3.8c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.6 3.6 0 0 0-1.1 2.7 6.3 6.3 0 0 0 1.3 3.3 14.4 14.4 0 0 0 5.5 4.9c2 .9 2.8.9 3.8.8a3.3 3.3 0 0 0 2.2-1.5 2.7 2.7 0 0 0 .2-1.5c-.1-.2-.3-.2-.6-.4z" />
    </svg>
  );
}

export function Header() {
  return (
    <header className="site-header">
      <div className="topbar">
        <div className="wrap">
          <span>Fast delivery across the UAE</span>
          <span className="hide-sm">100% original products with warranty</span>
          <a href={waLink()} target="_blank" rel="noopener">WhatsApp {SITE.phone}</a>
        </div>
      </div>
      <div className="mainbar">
        <div className="wrap">
          <Logo />
          <form action="/search" className="search">
            <input name="q" placeholder="Search air fryers, blenders, kettles..." aria-label="Search products" />
            <button type="submit">Search</button>
          </form>
          <a className="btn-wa hide-sm" href={waLink()} target="_blank" rel="noopener"><WaIcon size={18} /> Order on WhatsApp</a>
        </div>
      </div>
      <nav className="catnav">
        <div className="wrap">
          <Link href="/">Home</Link>
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`}>{c.name}</Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap fgrid">
        <div>
          <Logo light />
          <p>{SITE.company}. Your trusted partner for quality kitchen appliances in Dubai and across the UAE.</p>
        </div>
        <div>
          <h4>Categories</h4>
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`}>{c.name}</Link>
          ))}
        </div>
        <div>
          <h4>Visit or contact us</h4>
          <p>{SITE.address}</p>
          <p><a href={waLink()} target="_blank" rel="noopener">WhatsApp: {SITE.phone}</a></p>
        </div>
      </div>
      <div className="copy">© {new Date().getFullYear()} {SITE.company}. Website by Datix AI.</div>
    </footer>
  );
}

export function WhatsAppFloat() {
  return (
    <a className="wa-float" href={waLink()} target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
      <WaIcon size={30} />
      <span>Chat with us</span>
    </a>
  );
}

export function ProductCard({ p }) {
  return (
    <div className="card">
      <Link href={`/product/${p.id}`} className="card-img">
        <img src={p.images?.[0] || "/products/p1.jpg"} alt={p.name} loading="lazy" />
      </Link>
      <div className="card-body">
        <span className="chip">{catName(p.category)}</span>
        <Link href={`/product/${p.id}`} className="card-title">{p.name}</Link>
        <span className="muted">{p.brand}{p.model ? " · " + p.model : ""}</span>
        <div className="card-foot">
          <b className="price">{p.price ? "AED " + p.price : "Ask for price"}</b>
          <a className="mini-wa" href={waLink(`Hello, I want to order: ${p.name} (${p.model})`)} target="_blank" rel="noopener" aria-label={"Order " + p.name + " on WhatsApp"}>
            <WaIcon size={18} />
          </a>
        </div>
      </div>
    </div>
  );
}
