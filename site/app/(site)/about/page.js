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
          <p>{SITE.name} is the retail name of {SITE.company}, based in Deira, Dubai. The range includes air fryers, blenders, choppers, juicers, spice grinders, stoves, kettles and tea makers for home and business kitchens.</p>
          <p>Product pages share the available brand, model, images and specifications. The store describes its products as original and supplied with warranty. For questions about a product or its details, contact the team directly before ordering.</p>
          <Link className="about-cta" href="/shop">Explore the collection</Link>
        </div>
        <figure className="about-visual">
          <img src="/products/p21.jpg" alt="Juicer from the kitchen appliance collection" />
          <figcaption>Explore appliances for home and business kitchens.</figcaption>
        </figure>
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
