import { getProducts } from "@/lib/store";
import { SITE, CATEGORIES } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const now = new Date();
  const page = (path, priority, changeFrequency = "weekly") => ({ url: SITE.url + path, lastModified: now, changeFrequency, priority });
  const products = await getProducts();
  return [
    page("/", 1, "daily"),
    page("/shop", 0.9, "daily"),
    ...CATEGORIES.map((c) => page(`/category/${c.slug}`, 0.8)),
    ...products.map((p) => page(`/product/${p.id}`, 0.7)),
    page("/about", 0.5, "monthly"),
    page("/contact", 0.5, "monthly"),
  ];
}
