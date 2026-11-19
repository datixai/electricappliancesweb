import { notFound } from "next/navigation";
import { getProducts } from "@/lib/store";
import { CATEGORIES } from "@/lib/site";
import { ProductCard } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function Category({ params }) {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) notFound();
  const list = (await getProducts()).filter((p) => p.category === slug);
  return (
    <>
      <div className="page-head"><div className="wrap"><h1>{cat.name}</h1><p>{cat.blurb}. {list.length} products</p></div></div>
      <section className="wrap section">
        {list.length ? <div className="grid">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div> : <p>New products coming soon.</p>}
      </section>
    </>
  );
}
