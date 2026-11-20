import Link from "next/link";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/store";
import { CATEGORIES } from "@/lib/site";
import { CategoryMosaic, PageHero, ProductCard } from "@/components/ui";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.slug === slug);
  return { title: cat ? `${cat.name} | Adnan Electronics Household` : "Category" };
}

export default async function Category({ params }) {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) notFound();
  const list = (await getProducts()).filter((p) => p.category === slug);
  return (
    <>
      <PageHero eyebrow="Shop by category" title={cat.name} intro={`${cat.blurb}. Original products with warranty and delivery across the UAE and GCC.`} image={cat.img}>
        <p className="ph-meta"><Link href="/">Home</Link> / <Link href="/shop">Shop</Link> / {cat.name} <span>{list.length} products</span></p>
      </PageHero>

      <section className="wrap section">
        {list.length ? <div className="grid">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div> : <p className="empty">New products are coming soon. Ask us on WhatsApp for current stock.</p>}
      </section>

      <section className="more-cats">
        <div className="wrap section-heading">
          <div><span className="section-kicker">Keep exploring</span><h2>Other categories</h2></div>
          <Link href="/shop" className="link">View all categories</Link>
        </div>
        <CategoryMosaic exclude={slug} />
      </section>
    </>
  );
}
