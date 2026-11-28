import Link from "next/link";
import { notFound } from "next/navigation";
import { getProducts, getCategories } from "@/lib/store";
import { SITE } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import { CategoryMosaic, PageHero, ProductCard } from "@/components/ui";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const CATEGORIES = await getCategories();
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return { title: "Category | Adnan Electronics Household" };
  const description = `${cat.name} in Dubai from Adnan Electronics Household: ${cat.blurb.toLowerCase()}. Original products with warranty, delivery across the UAE and GCC.`;
  return { title: `${cat.name} in Dubai, UAE | Adnan Electronics Household`, description, alternates: { canonical: `/category/${slug}` }, openGraph: { title: cat.name, description, url: `/category/${slug}`, images: [{ url: cat.img, alt: cat.name }] } };
}

export default async function Category({ params }) {
  const { slug } = await params;
  const CATEGORIES = await getCategories();
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) notFound();
  const list = (await getProducts()).filter((p) => p.category === slug);
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${cat.name} in Dubai`,
    url: `${SITE.url}/category/${slug}`,
    isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
    breadcrumb: { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url + "/" },
      { "@type": "ListItem", position: 2, name: cat.name, item: `${SITE.url}/category/${slug}` },
    ] },
    mainEntity: { "@type": "ItemList", numberOfItems: list.length, itemListElement: list.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE.url}/product/${p.id}`, name: p.name })) },
  };
  return (
    <>
      <JsonLd data={schema} />
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
        <CategoryMosaic categories={CATEGORIES} exclude={slug} />
      </section>
    </>
  );
}
