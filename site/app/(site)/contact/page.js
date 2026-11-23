import ContactForm from "./ContactForm";
import { SITE, waLink } from "@/lib/site";

export const metadata = {
  alternates: { canonical: "/contact" },
  title: "Get in Touch | Adnan Electronics Household",
  description: "Contact Adnan Electronics Household in Deira, Dubai about kitchen appliances, wholesale inquiries, warranty or support.",
};

export default function Contact() {
  return (
    <div className="contact-page">
      <section className="contact-intro wrap" aria-labelledby="contact-title">
        <div className="contact-intro-copy">
          <span className="section-kicker">Contact</span>
          <h1 id="contact-title">Get in Touch</h1>
          <p>Have a question about an appliance or need help choosing the right one? Send us a message and our team will be glad to assist.</p>
        </div>
        <div className="contact-intro-media">
          <img src="/products/p41.jpg" alt="A product representative presenting a household appliance" />
        </div>
      </section>

      <div className="wrap contact-layout">
        <ContactForm />

        <aside className="contact-info" aria-labelledby="contact-info-title">
          <span className="contact-info-kicker">Adnan Electronics Household</span>
          <h2 id="contact-info-title">We are here to help</h2>
          <p className="contact-info-intro">Reach out to us about product inquiries, wholesale, warranty or support.</p>

          <dl className="contact-info-list">
            <div>
              <dt>Business</dt>
              <dd>{SITE.company}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd><a href={`tel:${SITE.phone.replace(/\s/g, "")}`}>{SITE.phone}</a></dd>
            </div>
            <div>
              <dt>WhatsApp</dt>
              <dd><a href={waLink()} target="_blank" rel="noopener noreferrer">{SITE.phone}</a></dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd><a href={`mailto:${SITE.email}`}>{SITE.email}</a></dd>
            </div>
            <div>
              <dt>Instagram</dt>
              <dd><a href={SITE.instagram} target="_blank" rel="noopener noreferrer">Adnan Electronics Household</a></dd>
            </div>
          </dl>
        </aside>

        <section className="contact-location" aria-labelledby="contact-location-title">
          <div>
            <span className="section-kicker">Visit us</span>
            <h2 id="contact-location-title">Our Location</h2>
          </div>
          <address>{SITE.address}</address>
        </section>
      </div>
    </div>
  );
}
