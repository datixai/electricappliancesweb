import Link from "next/link";
import { getProducts } from "@/lib/store";
import { CATEGORIES, catName, waLink } from "@/lib/site";
import { ProductCard } from "@/components/ui";
import HeroSlider from "@/components/HeroSlider";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getProducts();
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const slideOptions = [
    { category: "air-fryers", headline: "Thoughtful cooking for every day" },
    { category: "blenders", headline: "A better blend for every day" },
    { category: "juicers", headline: "Fresh juice, made at home" },
    { category: "kettles", headline: "Make tea time your own" },
  ];
  const heroSlides = slideOptions.flatMap((option) => {
    const product = products.find((p) => p.category === option.category && p.featured)
      || products.find((p) => p.category === option.category);
    if (!product) return [];

    return [{
      id: product.id,
      productName: product.name,
      brand: product.brand,
      model: product.model,
      categoryName: catName(product.category),
      description: product.description || `Explore our ${catName(product.category).toLowerCase()} collection.`,
      headline: option.headline,
      image: product.images?.[0] || CATEGORIES.find((c) => c.slug === option.category)?.img || "/products/p1.jpg",
    }];
  });

  return (
    <>
      <section className="home-hero">
        <HeroSlider slides={heroSlides} />
      </section>

      <section className="wrap section" id="categories">
        <div className="sec-head section-heading">
          <div><span className="section-kicker">Explore the collection</span><h2>Shop by category</h2></div>
          <p>Everyday essentials for a more capable kitchen. <Link href="/shop" className="link">Shop all categories</Link></p>
        </div>
        <div className="cat-grid">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`} className="cat">
              <div className="cat-image"><img src={c.img} alt={c.name} loading="lazy" /></div>
              <div>
                <b>{c.name}</b>
                <span>{c.blurb}</span>
                <span className="cat-explore">Explore category <span aria-hidden="true">↗</span></span>
              </div>
            </Link>
          ))}
        </div>
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
