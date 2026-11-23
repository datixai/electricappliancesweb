import Link from "next/link";
import { PageHero } from "@/components/ui";
import { SITE } from "@/lib/site";

export const metadata = {
  title: "About Us | Adnan Electronics Household",
  description: "Learn about Adnan Electronics Household, kitchen appliances, customer support and UAE and GCC delivery.",
};

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About the business"
        title="Practical appliances for everyday kitchens"
        intro="A focused collection of kitchen and household appliances, with product information and direct support when you need it."
        image="/products/p41.jpg"
      />

      <section className="wrap section about-section">
        <div className="about-copy">
          <span className="section-kicker">Adnan Electronics Household</span>
          <h2>Kitchen essentials, with helpful service</h2>
          <p>{SITE.name} is a kitchen appliance shop in Deira, Dubai. The range includes air fryers, blenders, choppers, juicers, spice grinders, stoves, kettles and tea makers for home and business kitchens.</p>
          <p>Every product page shows the brand, model, photos and key features. All products are original and come with warranty. If you have a question about a product, contact our team before ordering and we will help you choose.</p>
          <Link className="about-cta" href="/shop">Explore the collection</Link>
        </div>
        <figure className="about-visual">
          <img src="/products/p21.jpg" alt="Juicer from the kitchen appliance collection" />
          <figcaption>Explore appliances for home and business kitchens.</figcaption>
        </figure>
      </section>

      <section className="why-section">
        <div className="wrap section">
          <div className="sec-head section-heading">
            <div><span className="section-kicker">A considered choice</span><h2>Why Adnan Electronics Household</h2></div>
            <p>Helpful product information and a team ready to assist.</p>
          </div>
          <div className="why-grid">
            <article className="why-item"><span className="why-number">01</span><h3>A considered collection</h3><p>Explore practical appliances for cooking, blending, chopping, juicing and more.</p></article>
            <article className="why-item"><span className="why-number">02</span><h3>Product details at a glance</h3><p>Review available specifications and warranty information on each product page.</p></article>
            <article className="why-item"><span className="why-number">03</span><h3>Direct, personal support</h3><p>Contact our team on WhatsApp to ask about a product or request more information.</p></article>
          </div>
        </div>
      </section>

      <section className="about-service">
        <div className="wrap about-service-inner">
          <div>
            <span className="section-kicker">Here to help</span>
            <h2>Clear product details and direct support</h2>
            <p>Browse product information online, or reach out to the team on WhatsApp for assistance and further product questions.</p>
            <Link href="/contact">Contact our team</Link>
          </div>
          <div>
            <span className="section-kicker">Delivery</span>
            <h2>Across the UAE and GCC</h2>
            <p>The website lists delivery across the United Arab Emirates and GCC countries. Contact the team to confirm delivery details for your location.</p>
            <p className="about-address">{SITE.address}</p>
          </div>
        </div>
      </section>
    </>
  );
}
