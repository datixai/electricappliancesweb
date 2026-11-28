import Link from "next/link";
import { getProducts, getCategories } from "@/lib/store";
import { CategoryMosaic } from "@/components/ui";
import ShopFilters from "./ShopFilters";

export const dynamic = "force-dynamic";
export const metadata = {
  alternates: { canonical: "/shop" },
  title: "Kitchen Appliances in Dubai: Shop All | Adnan Electronics Household",
  description: "Shop kitchen appliances in Dubai: air fryers, blenders, choppers, juicers, spice grinders, stoves, kettles and tea makers. Original products with warranty and delivery across the UAE and GCC.",
};

export default async function Shop() {
  const [products, CATEGORIES] = await Promise.all([getProducts(), getCategories()]);
  const counts = Object.fromEntries(CATEGORIES.map((c) => [c.slug, products.filter((p) => p.category === c.slug).length]));
  return (
    <>
      <section className="intro">
        <p className="eyebrow">The collection</p>
        <h1 className="display">Every kitchen essential, one trusted shop</h1>
        <p>{CATEGORIES.length} categories of original appliances with warranty, chosen for busy family kitchens, cafes and restaurants. Pick a category to explore.</p>
      </section>

      <CategoryMosaic categories={CATEGORIES} counts={counts} />

      <section className="wrap section" id="all">
        <div className="section-heading">
          <div><span className="section-kicker">The complete collection</span><h2>All products</h2></div>
          <div className="chips">
            {CATEGORIES.map((c) => (
              <Link key={c.slug} href={`/category/${c.slug}`} className="chip-link">{c.name} <span>{counts[c.slug]}</span></Link>
            ))}
          </div>
        </div>
        <ShopFilters products={products} categories={CATEGORIES} />
      </section>
    </>
  );
}
