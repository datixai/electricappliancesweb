import Link from "next/link";
import { SITE, CATEGORIES, waLink, catName } from "@/lib/site";

// Demonstration values only. Replace with verified prices when they are available.
const DEMO_PRICES = {
  af1: 399,
  af2: 359,
  af3: 289,
  af4: 229,
  af5: 319,
  af6: 379,
  bl1: 179,
  bl2: 149,
  bl3: 299,
  bl4: 239,
  bl5: 189,
  ch1: 169,
  ch2: 219,
  ch3: 89,
  ju1: 269,
  ju2: 329,
  ju3: 209,
  sg1: 79,
  sg2: 259,
  sg3: 279,
  st1: 199,
  st2: 119,
  st3: 99,
  st4: 159,
  st5: 249,
  ke1: 39,
  ke2: 99,
  ke3: 59,
  ke4: 69,
};

const DEMO_CATEGORY_PRICES = {
  "air-fryers": 329,
  blenders: 199,
  choppers: 149,
  juicers: 249,
  "spice-grinders": 149,
  stoves: 149,
  kettles: 69,
};

export function formatProductPrice(p) {
  const price = p.price || DEMO_PRICES[p.id] || DEMO_CATEGORY_PRICES[p.category];
  return `AED ${Number(price).toFixed(2)}`;
}

export function Emblem({ size = 48 }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
      <defs>
        <linearGradient id="ae-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe08a" />
          <stop offset=".55" stopColor="#f5b301" />
          <stop offset="1" stopColor="#c98a00" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="16" fill="#0b1b3a" />
      <rect x="3" y="3" width="58" height="58" rx="15" fill="none" stroke="url(#ae-g)" strokeWidth="2" />
      <path d="M43 19.5V13h5v11" fill="url(#ae-g)" />
      <path d="M10 31 32 11l22 20" fill="none" stroke="url(#ae-g)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 53 32 23l12 30" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M34 32 27.5 42h4.6l-2.1 8.5L37 39.5h-4.6z" fill="url(#ae-g)" />
    </svg>
  );
}

export function Logo({ light }) {
  return (
    <Link href="/" className={"logo" + (light ? " light" : "")} aria-label={SITE.name + " home"}>
      <Emblem size={50} />
      <span className="wordmark">
        <b>ADNAN</b>
        <i>ELECTRONICS</i>
        <small>HOUSEHOLD <em>|</em> <span lang="fa" dir="rtl">لوازم خانگی</span></small>
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
          <span>Fast Delivery Across UAE &amp; GCC Countries</span>
          <span className="topbar-assurance">100% Original Products With Warranty</span>
          <a href={waLink()} target="_blank" rel="noopener noreferrer">WhatsApp {SITE.phone}</a>
        </div>
      </div>
      <div className="mainbar">
        <div className="wrap">
          <Logo />
          <form action="/search" className="search">
            <input name="q" placeholder="Search air fryers, blenders, kettles..." aria-label="Search products" />
            <button type="submit" aria-label="Search">Search</button>
          </form>
        </div>
      </div>
      <nav className="catnav" aria-label="Product categories">
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
    <footer className="site-footer" id="contact">
      <div className="wrap fgrid">
        <div className="footer-company">
          <Logo light />
          <p>{SITE.company}. Kitchen appliances for homes and businesses, with product support from our team.</p>
          <p className="footer-delivery">Delivering Across UAE &amp; GCC Countries</p>
        </div>
        <div>
          <h4>Quick links</h4>
          <Link href="/">Home</Link>
          <Link href="/#products">Products</Link>
          <Link href="/#categories">Categories</Link>
          <Link href="#contact">Contact us</Link>
        </div>
        <div>
          <h4>Contact information</h4>
          <p>{SITE.address}</p>
          <p><a href={"tel:" + SITE.phone.replace(/\s/g, "")}>Phone: {SITE.phone}</a></p>
          <p><a href={waLink()} target="_blank" rel="noopener noreferrer">WhatsApp: {SITE.phone}</a></p>
          <a className="instagram-link" href="https://www.instagram.com/adnanhousehold?evlk=aG55Y2RlMjYxaWw0&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Visit Adnan Electronics on Instagram">
            <svg viewBox="0 0 24 24" width="19" height="19" fill="none" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="17.5" cy="6.8" r="1" fill="currentColor" />
            </svg>
            Instagram
          </a>
        </div>
      </div>
      <div className="copy"><span>© {new Date().getFullYear()} {SITE.company}. All rights reserved.</span><span>Dubai, UAE · Delivering across UAE &amp; GCC countries</span></div>
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
        <b className="price">{formatProductPrice(p)}</b>
        <Link href={`/product/${p.id}`} className="card-details">View details</Link>
      </div>
    </div>
  );
}
