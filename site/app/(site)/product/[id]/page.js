import Link from "next/link";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/store";
import { catName, waLink } from "@/lib/site";
import { formatProductPrice, ProductCard, WaIcon } from "@/components/ui";
import Gallery from "./Gallery";

export const dynamic = "force-dynamic";

export default async function Product({ params }) {
  const { id } = await params;
  const all = await getProducts();
  const p = all.find((x) => x.id === id);
  if (!p) notFound();
  const related = all.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);
  return (
    <section className="wrap section">
      <p className="crumbs"><Link href="/">Home</Link> / <Link href={`/category/${p.category}`}>{catName(p.category)}</Link> / {p.name}</p>
      <div className="pd">
        <Gallery images={p.images?.length ? p.images : ["/products/p1.jpg"]} name={p.name} />
        <div className="pd-info">
          <span className="chip">{catName(p.category)}</span>
          <h1>{p.name}</h1>
          <p className="muted">Brand: {p.brand} {p.model ? " | Model: " + p.model : ""}</p>
          <p className="pd-price">{formatProductPrice(p)}</p>
          <p>{p.description}</p>
          {p.specs?.length > 0 && (
            <ul className="specs">{p.specs.map((s, i) => <li key={i}>{s}</li>)}</ul>
          )}
          <a className="btn-wa big" href={waLink(`Hello, I want to order: ${p.name} (${p.model})`)} target="_blank" rel="noopener">
            <WaIcon size={20} /> Order on WhatsApp
          </a>
          <ul className="perks"><li>Original product</li><li>Warranty included</li><li>Delivery across the UAE and GCC</li></ul>
        </div>
      </div>
      {related.length > 0 && (
        <>
          <div className="sec-head"><h2>You may also like</h2></div>
          <div className="grid">{related.map((r) => <ProductCard key={r.id} p={r} />)}</div>
        </>
      )}
    </section>
  );
}
