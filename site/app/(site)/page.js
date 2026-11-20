import Link from "next/link";
import { getProducts } from "@/lib/store";
import { CATEGORIES, waLink } from "@/lib/site";
import { CategoryMosaic, ProductCard } from "@/components/ui";
import HeroSlider from "@/components/HeroSlider";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getProducts();
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const heroSlides = [
    { key: "juice", kicker: "Juicers", title: "Fresh juice, made at home", text: "Slow juicers and 5 in 1 juicer sets that keep more nutrition in every glass, for the whole family.", href: "/category/juicers", cta: "Shop juicers", image: "/products/p21.jpg", pos: "center", alt: "Juicer set in a family kitchen", tagSmall: "Bosstech", tag: "5 in 1 Juicer set" },
    { key: "tea", kicker: "Kettles and tea makers", title: "Make tea time your own", text: "Fast boiling kettles and two level tea makers in steel and glass, ready in minutes.", href: "/category/kettles", cta: "Shop kettles", image: "/products/p41.jpg", pos: "center 30%", alt: "Woman with an electric kettle", tagSmall: "Silvers Criest", tag: "Kettle and tea maker" },
    { key: "blend", kicker: "Blenders", title: "A better blend for every day", text: "From smoothies to dry grinding, powerful blenders for home kitchens, cafes and juice shops.", href: "/category/blenders", cta: "Shop blenders", image: "/products/p13.jpg", pos: "center", alt: "Blender set in a kitchen", tagSmall: "Disnie", tag: "Blender and grinder set" },
    { key: "fry", kicker: "Air fryers", title: "Crispy and golden, with less oil", text: "Large 10 to 16 litre digital air fryers with touch presets and see-through windows.", href: "/category/air-fryers", cta: "Shop air fryers", image: "/products/p14.jpg", pos: "center", alt: "Cody Crest digital air fryer", tagSmall: "Cody Crest", tag: "15L digital air fryer" },
  ];
  const counts = Object.fromEntries(CATEGORIES.map((c) => [c.slug, products.filter((p) => p.category === c.slug).length]));

  return (
    <>
      <section className="home-hero">
        <HeroSlider slides={heroSlides} />
      </section>

      <section className="home-cats" id="categories">
        <div className="wrap section">
        <div className="sec-head section-heading">
          <div><span className="section-kicker">Explore the collection</span><h2>Shop by category</h2></div>
          <p>Everyday essentials for a more capable kitchen. <Link href="/shop" className="link">Shop all categories</Link></p>
        </div>
        </div>
        <CategoryMosaic counts={counts} />
      </section>

      <section className="featured-section" id="products">
        <div className="wrap section">
          <div className="sec-head section-heading">
            <div><span className="section-kicker">Selected for your home</span><h2>Featured products</h2></div>
            <p>Browse a selection from our kitchen appliance range.</p>
          </div>
          <div className="grid">{featured.map((p) => <ProductCard key={p.id} p={p} />)}</div>
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

      <section className="why-section">
        <div className="wrap section">
          <div className="sec-head section-heading">
            <div><span className="section-kicker">A considered choice</span><h2>Why Adnan Electronics</h2></div>
            <p>Helpful product information and a team ready to assist.</p>
          </div>
          <div className="why-grid">
            <article className="why-item"><span className="why-number">01</span><h3>A considered collection</h3><p>Explore practical appliances for cooking, blending, chopping, juicing and more.</p></article>
            <article className="why-item"><span className="why-number">02</span><h3>Product details at a glance</h3><p>Review available specifications and warranty information on each product page.</p></article>
            <article className="why-item"><span className="why-number">03</span><h3>Direct, personal support</h3><p>Contact our team on WhatsApp to ask about a product or request more information.</p></article>
          </div>
        </div>
      </section>

      <section className="delivery-section">
        <div className="wrap delivery-inner">
          <div><span className="section-kicker">Closer to your kitchen</span><h2>Delivering across the UAE &amp; GCC countries</h2></div>
          <p>United Arab Emirates <span>·</span> Saudi Arabia <span>·</span> Qatar <span>·</span> Kuwait <span>·</span> Bahrain <span>·</span> Oman</p>
        </div>
      </section>

      <section className="wrap section faq-section" id="faq">
        <div className="sec-head section-heading">
          <div><span className="section-kicker">Need a hand?</span><h2>Frequently asked questions</h2></div>
          <p>Get in touch if you need help with a specific product.</p>
        </div>
        <div className="faq-list">
          <details><summary>What kinds of appliances can I find?</summary><p>Browse air fryers, blenders, choppers, juicers, spice grinders, stoves, kettles and tea makers.</p></details>
          <details><summary>How can I ask about a product or its price?</summary><p>Open a product page and use its WhatsApp inquiry button to contact our team about that item.</p></details>
          <details><summary>Where does Adnan Electronics deliver?</summary><p>Delivery is available across the UAE, Saudi Arabia, Qatar, Kuwait, Bahrain and Oman. Contact us for details about your order.</p></details>
          <details><summary>Where can I find warranty information?</summary><p>Check the product details for the available warranty information, or contact our team if you have a question.</p></details>
        </div>
      </section>
    </>
  );
}
