import Link from "next/link";
import { getProducts } from "@/lib/store";
import { CATEGORIES, waLink } from "@/lib/site";
import { ProductCard, WaIcon } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getProducts();
  const featured = products.filter((p) => p.featured).slice(0, 8);
  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-text">
            <span className="eyebrow">New season deals in Dubai</span>
            <h1>Smart kitchen appliances for <em>every home</em></h1>
            <p>Air fryers, blenders, choppers, juicers, spice grinders, stoves and kettles. Original products with warranty and fast delivery across the UAE.</p>
            <div className="hero-cta">
              <Link href="#categories" className="btn-gold">Shop by category</Link>
              <a href={waLink()} target="_blank" rel="noopener" className="btn-ghost"><WaIcon size={18} /> Ask on WhatsApp</a>
            </div>
            <ul className="trust">
              <li><b>100%</b> Original</li>
              <li><b>1-3 yr</b> Warranty</li>
              <li><b>UAE</b> Delivery</li>
            </ul>
          </div>
          <div className="hero-art">
            <div className="tile t1"><img src="/products/p1.jpg" alt="Silver Crest air fryer" /></div>
            <div className="tile t2"><img src="/products/p20.jpg" alt="Silver Crest blender" /></div>
            <div className="tile t3"><img src="/products/p41.jpg" alt="Electric kettle" /></div>
            <div className="tile t4"><img src="/products/p5.jpg" alt="Meat grinder" /></div>
            <div className="badge-round"><b>7</b><span>categories</span></div>
          </div>
        </div>
      </section>

      <section className="wrap section" id="categories">
        <div className="sec-head">
          <h2>Shop by category</h2>
          <p>Everything for a modern kitchen, in one shop</p>
        </div>
        <div className="cat-grid">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`} className="cat">
              <img src={c.img} alt={c.name} loading="lazy" />
              <div>
                <b>{c.name}</b>
                <span>{c.blurb}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap section">
        <div className="sec-head">
          <h2>Best sellers</h2>
          <p>Our most popular products this month</p>
        </div>
        <div className="grid">{featured.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </section>

      <section className="promo">
        <div className="wrap promo-inner">
          <div>
            <h2>Buying for a shop, cafe or restaurant?</h2>
            <p>Ask us for wholesale prices on commercial blenders, grinders and choppers.</p>
          </div>
          <a href={waLink("Hello, I want wholesale prices.")} target="_blank" rel="noopener" className="btn-gold">Get wholesale prices</a>
        </div>
      </section>

      {CATEGORIES.map((c) => {
        const list = products.filter((p) => p.category === c.slug).slice(0, 4);
        if (!list.length) return null;
        return (
          <section key={c.slug} className="wrap section">
            <div className="sec-head row">
              <h2>{c.name}</h2>
              <Link href={`/category/${c.slug}`} className="link">View all</Link>
            </div>
            <div className="grid">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>
          </section>
        );
      })}
    </>
  );
}
