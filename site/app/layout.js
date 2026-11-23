import "./globals.css";
import "./theme.css";
import { Poppins, Playfair_Display } from "next/font/google";

const font = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const display = Playfair_Display({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display" });

import { SITE } from "@/lib/site";

const DESCRIPTION = "Adnan Electronics Household, Deira, Dubai: air fryers, blenders, choppers, juicers, spice grinders, stoves, kettles and tea makers. Original products with warranty and delivery across the UAE and GCC.";

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: "Adnan Electronics Household | Kitchen Appliances in Dubai",
  description: DESCRIPTION,
  applicationName: SITE.name,
  keywords: ["Adnan Electronics Household", "kitchen appliances Dubai", "air fryer Dubai", "blender Dubai", "meat chopper", "slow juicer", "spice grinder", "gas stove", "electric kettle", "tea maker", "Deira", "UAE", "GCC", "لوازم خانگی"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: "Adnan Electronics Household | Kitchen Appliances in Dubai",
    description: DESCRIPTION,
    url: "/",
    locale: "en_AE",
    images: [{ url: "/brand/logo-horizontal.png", width: 708, height: 240, alt: SITE.name }],
  },
  twitter: { card: "summary_large_image", title: SITE.name, description: DESCRIPTION, images: ["/brand/logo-horizontal.png"] },
  robots: { index: true, follow: true },
  formatDetection: { telephone: true, email: true, address: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={font.className + " " + display.variable}>{children}</body>
    </html>
  );
}
