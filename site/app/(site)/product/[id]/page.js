import Link from "next/link";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/store";
import { catName, waLink } from "@/lib/site";
import { ProductCard, WaIcon } from "@/components/ui";
import Gallery from "./Gallery";

export const dynamic = "force-dynamic";

function specIcon(spec) {
  const text = spec.toLowerCase();
  if (text.includes("capacity") || /\b\d+(?:\.\d+)?\s*l\b/.test(text)) return "🍳";
  if (text.includes("control") || text.includes("touch")) return "⚙️";
  if (text.includes("power") || text.includes("watt") || text.includes("performance")) return "🔌";
  if (text.includes("glass") || text.includes("window")) return "🪟";
  return "✓";
}

export default async function Product({ params }) {
  const { id } = await params;
  const all = await getProducts();
  const p = all.find((x) => x.id === id);
  if (!p) notFound();
  const related = all.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);
  return (
    <div className="wrap section product-page">
      <nav className="product-breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link><span aria-hidden="true">/</span>
        <Link href={`/category/${p.category}`}>{catName(p.category)}</Link><span aria-hidden="true">/</span>
        <span aria-current="page">{p.name}</span>
      </nav>
      <div className="product-layout">
        <Gallery images={p.images?.length ? p.images : ["/products/p1.jpg"]} name={p.name} />
        <div className="product-info">
          <span className="product-category">{catName(p.category)}</span>
          <h1 className="product-title">{p.name}</h1>
          <dl className="product-meta">
            {p.brand && <div><dt>Brand</dt><dd>{p.brand}</dd></div>}
            {p.model && <div><dt>Model</dt><dd>{p.model}</dd></div>}
          </dl>
          {p.description && <p className="product-description">{p.description}</p>}
          {p.specs?.length > 0 && (
            <section className="product-specifications" aria-labelledby="product-specifications-title">
              <h2 id="product-specifications-title">Features &amp; specifications</h2>
              <ul className="product-spec-list">
                {p.specs.map((s, i) => (
                  <li key={i}>
                    <span aria-hidden="true">{specIcon(s)}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <a className="product-order-button" href={waLink(`Hello, I want to order: ${p.name} (${p.model})`)} target="_blank" rel="noopener noreferrer">
            <WaIcon size={20} /> Order on WhatsApp
          </a>
          <ul className="product-trust">
            <li><span aria-hidden="true">✓</span> 100% Original Products</li>
            <li><span aria-hidden="true">🛡️</span> Warranty Included</li>
            <li><span aria-hidden="true">🚚</span> Delivery Across UAE &amp; GCC</li>
          </ul>
        </div>
      </div>
      {related.length > 0 && (
        <section className="product-related" aria-labelledby="related-products-title">
          <div className="product-related-heading">
            <span>DISCOVER MORE</span>
            <h2 id="related-products-title">You may also like</h2>
          </div>
          <div className="grid">{related.map((r) => <ProductCard key={r.id} p={r} />)}</div>
        </section>
      )}
    </div>
  );
}
