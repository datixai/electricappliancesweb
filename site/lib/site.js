export const SITE = {
  name: "Adnan Electronics Household",
  // Public address of the live site (set NEXT_PUBLIC_SITE_URL on the host when the domain is final).
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://adnanhomestore.com").replace(/\/$/, ""),
  nameFa: "لوازم خانگی",
  company: "Adnan Electronics Household",
  tagline: "Quality kitchen appliances you can trust",
  whatsapp: "971554629676",
  phone: "+971 55 462 9676",
  email: "adnandisnie@gmail.com",
  instagram: "https://www.instagram.com/adnanhousehold",
  address: "Shop No. 29, Fikri Building, Deira, Dubai, UAE",
};

export const CATEGORIES = [
  { slug: "air-fryers", name: "Air Fryers", img: "/products/p1.jpg", blurb: "Crispy food with up to 80% less oil" },
  { slug: "blenders", name: "Blenders", img: "/products/p20.jpg", blurb: "Smoothies, shakes and grinding" },
  { slug: "choppers", name: "Choppers", img: "/products/p5.jpg", blurb: "Meat, onion and vegetable choppers" },
  { slug: "juicers", name: "Juicers", img: "/products/p21.jpg", blurb: "Fresh juice, more nutrition" },
  { slug: "spice-grinders", name: "Spice Grinders", img: "/products/p36.jpg", blurb: "Spices, herbs, grains and coffee" },
  { slug: "stoves", name: "Stoves", img: "/products/p28.jpg", blurb: "Gas stoves and ceramic cookers" },
  { slug: "kettles", name: "Kettles and Tea Makers", img: "/products/p41.jpg", blurb: "Smart boiling, perfect tea" },
];

export const catName = (slug) => CATEGORIES.find((c) => c.slug === slug)?.name || slug;

export const waLink = (text) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text || "Hello, I want to ask about your products.")}`;
