import { getProducts } from "@/lib/store";
import { ProductCard } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function Search({ searchParams }) {
  const q = ((await searchParams).q || "").toString().trim().toLowerCase();
  const list = (await getProducts()).filter((p) =>
    [p.name, p.brand, p.model, p.category, p.description].join(" ").toLowerCase().includes(q)
  );
  return (
    <>
      <div className="page-head"><div className="wrap"><h1>Search</h1><p>{list.length} results for "{q}"</p></div></div>
      <section className="wrap section"><div className="grid">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div></section>
    </>
  );
}
