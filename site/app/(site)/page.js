import Link from "next/link";
import { getProducts } from "@/lib/store";
import { waLink } from "@/lib/site";
import { ProductCard } from "@/components/ui";
import HeroSlider from "@/components/HeroSlider";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getProducts();
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const heroSlides = [
    { key: "juice", kicker: "Juicers", title: "Fresh juice, made at home", text: "Slow juicers and 5 in 1 juicer sets that keep more nutrition in every glass, for the whole family.", href: "/category/juicers", cta: "Shop juicers", image: "/products/p21.jpg", pos: "center", alt: "Juicer set in a family kitchen", tagSmall: "Bosstech", tag: "5 in 1 Juicer set" },
    { key: "tea", kicker: "Kettles and tea makers", title: "Make tea time your own", text: "Fast boiling kettles and two level tea makers in steel and glass, ready in minutes.", href: "/category/kettles", cta: "Shop kettles", image: "/products/p41.jpg", pos: "center 30%", alt: "Woman with an electric kettle", tagSmall: "Silvers Criest", tag: "Kettle and tea maker" },
    { key: "blend", kicker: "Blenders", title: "A better blend for every day", text: "From smoothies to dry grinding, powerful blenders for home kitchens, cafes and juice shops.", href: "/category/blenders", cta: "Shop blenders", image: "/products/p13.jpg", pos: "center", alt: "Blender set in a kitchen", tagSmall: "Adnan Electronics", tag: "Blender and grinder set" },
    { key: "fry", kicker: "Air fryers", title: "Crispy and golden, with less oil", text: "Large 10 to 16 litre digital air fryers with touch presets and see-through windows.", href: "/category/air-fryers", cta: "Shop air fryers", image: "/products/p14.jpg", pos: "center", alt: "Cody Crest digital air fryer", tagSmall: "Cody Crest", tag: "15L digital air fryer" },
  ];
  return (
    <>
      <section className="home-hero">
        <HeroSlider slides={heroSlides} />
      </section>

      <section className="delivery-section">
        <div className="wrap delivery-inner">
          <div><span className="section-kicker">Closer to your kitchen</span><h2>Delivering across the UAE &amp; GCC countries</h2></div>
          <p>United Arab Emirates <span>·</span> Saudi Arabia <span>·</span> Qatar <span>·</span> Kuwait <span>·</span> Bahrain <span>·</span> Oman</p>
        </div>
      </section>

      <section className="featured-section" id="products">
        <div className="wrap section">
          <div className="sec-head section-heading">
            <div><span className="section-kicker">Selected for your home</span><h2>Featured products</h2></div>
            <p>Browse a selection from our kitchen appliance range.</p>
          </div>
          <div className="grid">{featured.map((p) => <ProductCard key={p.id} p={p} />)}</div>
          <div className="featured-see-all-wrap">
            <Link href="/shop" className="featured-see-all">See All</Link>
          </div>
        </div>
      </section>

      <section className="promo">
        <div className="wrap promo-inner">
          <div className="promo-copy">
            <span className="section-kicker">For home and business kitchens</span>
            <h2>Buying for a shop, cafe or restaurant?</h2>
            <p>Talk to our team about wholesale pricing on commercial blenders, grinders and choppers.</p>
          </div>
          <a href={waLink("Hello, I want wholesale prices.")} target="_blank" rel="noopener noreferrer" className="btn-gold">Ask about wholesale</a>
        </div>
      </section>

    </>
  );
}
