import Link from "next/link";
import NavLinks from "./NavLinks";
import ScrollHeader from "./ScrollHeader";
import { SITE, CATEGORIES, waLink, catName } from "@/lib/site";

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
    <ScrollHeader>
      <div className="mainbar">
        <div className="wrap header-inner">
          <Logo />
          <nav className="catnav" aria-label="Main navigation">
            <NavLinks />
          </nav>
        </div>
      </div>
    </ScrollHeader>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer" id="contact">
      <div className="wrap fgrid">
        <div className="footer-company">
          <Logo light />
          <p>{SITE.company}. Kitchen appliances for homes and businesses, chosen for daily use and backed by warranty.</p>
          <p className="footer-delivery">Delivering across the UAE &amp; GCC</p>
        </div>
        <div>
          <h4>Shop</h4>
          <Link href="/shop">All categories</Link>
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`}>{c.name}</Link>
          ))}
        </div>
        <div>
          <h4>Explore</h4>
          <Link href="/">Home</Link>
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/#products">Featured products</Link>
          <Link href="/#faq">Questions</Link>
          <Link href="/search?q=">Search products</Link>
        </div>
        <div>
          <h4>Visit or contact us</h4>
          <p>{SITE.address}</p>
          <p><a href={"tel:" + SITE.phone.replace(/\s/g, "")}>Phone: {SITE.phone}</a></p>
          <p><a href={waLink()} target="_blank" rel="noopener noreferrer">WhatsApp: {SITE.phone}</a></p>
          <p><a href="mailto:adnandisnie@gmail.com"><span aria-hidden="true">✉️</span> Email: adnandisnie@gmail.com</a></p>
          <a className="instagram-link" href={SITE.instagram} target="_blank" rel="noopener noreferrer" aria-label="Visit Adnan Electronics on Instagram">
            <svg viewBox="0 0 24 24" width="19" height="19" fill="none" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="17.5" cy="6.8" r="1" fill="currentColor" />
            </svg>
            Instagram
          </a>
        </div>
      </div>
      <div className="copy">
        <span>© {year} {SITE.company}. All rights reserved.</span>
        <a href="https://www.datixai.com" target="_blank" rel="noopener noreferrer" className="datix-credit">
          Developed by <b>Datix AI</b>
        </a>
      </div>
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
  const href = `/product/${p.id}`;
  return (
    <article className="card">
      <Link href={href} className="card-img">
        <img src={p.images?.[0] || "/products/p1.jpg"} alt={p.name} loading="lazy" />
        <span className="card-badge">{catName(p.category)}</span>
        {p.featured && <span className="card-flag">Best seller</span>}
      </Link>
      <div className="card-body">
        <span className="card-brand">{p.brand}</span>
        <Link href={href} className="card-title">{p.name}</Link>
        {p.model && <span className="card-model">Model {p.model}</span>}
        {p.specs?.length > 0 && (
          <ul className="card-specs">{p.specs.slice(0, 2).map((s, i) => <li key={i}>{s}</li>)}</ul>
        )}
        <div className="card-foot">
          <Link href={href} className="card-details">More info <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </article>
  );
}

export function CategoryMosaic({ counts = {}, exclude }) {
  const list = CATEGORIES.filter((c) => c.slug !== exclude);
  return (
    <div className={"mosaic" + (exclude ? " mosaic-strip" : "")}>
      {list.map((c, i) => (
        <Link key={c.slug} href={`/category/${c.slug}`} className={"mtile m" + (i + 1)}>
          <img src={c.img} alt="" loading="lazy" />
          <span className="m-shade" aria-hidden="true" />
          <div className="m-text">
            <h3>{c.name}</h3>
            <p>{c.blurb}</p>
            {counts[c.slug] != null && <small>{counts[c.slug]} products</small>}
            <span className="m-cta">Discover</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function PageHero({ eyebrow, title, intro, image, children }) {
  return (
    <section className="page-hero">
      {image && <div className="ph-bg"><img src={image} alt="" /></div>}
      <div className="ph-shade" aria-hidden="true" />
      <div className="wrap ph-inner">
        {eyebrow && <p className="eyebrow light">{eyebrow}</p>}
        <h1>{title}</h1>
        {intro && <p className="ph-intro">{intro}</p>}
        {children}
      </div>
    </section>
  );
}
