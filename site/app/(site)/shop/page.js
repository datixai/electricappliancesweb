import Link from "next/link";
import { getProducts } from "@/lib/store";
import { CATEGORIES } from "@/lib/site";
import { CategoryMosaic } from "@/components/ui";
import ShopFilters from "./ShopFilters";

export const dynamic = "force-dynamic";
export const metadata = {
  alternates: { canonical: "/shop" },
  title: "Shop all categories | Adnan Electronics Household",
  description: "Browse every Adnan Electronics category: air fryers, blenders, choppers, juicers, spice grinders, stoves, kettles and tea makers.",
};

export default async function Shop() {
  const products = await getProducts();
  const counts = Object.fromEntries(CATEGORIES.map((c) => [c.slug, products.filter((p) => p.category === c.slug).length]));
  return (
    <>
      <section className="intro">
        <p className="eyebrow">The collection</p>
        <h1 className="display">Every kitchen essential, one trusted shop</h1>
        <p>Seven categories of original appliances with warranty, chosen for busy family kitchens, cafes and restaurants. Pick a category to explore.</p>
      </section>

      <CategoryMosaic counts={counts} />

      <section className="wrap section" id="all">
        <div className="section-heading">
          <div><span className="section-kicker">The complete collection</span><h2>All products</h2></div>
          <div className="chips">
            {CATEGORIES.map((c) => (
              <Link key={c.slug} href={`/category/${c.slug}`} className="chip-link">{c.name} <span>{counts[c.slug]}</span></Link>
            ))}
          </div>
        </div>
        <ShopFilters products={products} />
      </section>
    </>
  );
}
