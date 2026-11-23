import { Header, Footer, WhatsAppFloat } from "@/components/ui";
import JsonLd from "@/components/JsonLd";
import { SITE, CATEGORIES } from "@/lib/site";

const storeSchema = {
  "@context": "https://schema.org",
  "@type": "HomeGoodsStore",
  "@id": SITE.url + "/#store",
  name: SITE.name,
  alternateName: "Adnan Electronics " + SITE.nameFa,
  description: "Kitchen appliance shop in Deira, Dubai: air fryers, blenders, choppers, juicers, spice grinders, stoves, kettles and tea makers, with delivery across the UAE and GCC.",
  url: SITE.url,
  logo: SITE.url + "/brand/emblem.png",
  image: SITE.url + "/brand/logo-horizontal.png",
  telephone: SITE.phone.replace(/\s/g, ""),
  email: SITE.email,
  address: { "@type": "PostalAddress", streetAddress: "Shop No. 29, Fikri Building", addressLocality: "Deira, Dubai", addressCountry: "AE" },
  areaServed: ["United Arab Emirates", "Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman"],
  sameAs: [SITE.instagram],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Kitchen appliances",
    itemListElement: CATEGORIES.map((c) => ({ "@type": "OfferCatalog", name: c.name, url: `${SITE.url}/category/${c.slug}` })),
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: SITE.url,
  potentialAction: { "@type": "SearchAction", target: SITE.url + "/search?q={search_term_string}", "query-input": "required name=search_term_string" },
};

export default function SiteLayout({ children }) {
  return (
    <>
      <JsonLd data={[storeSchema, websiteSchema]} />
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
