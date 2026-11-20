import "./globals.css";
import { Poppins } from "next/font/google";
import { Header, Footer, WhatsAppFloat } from "@/components/ui";

const font = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export const metadata = {
  title: "Adnan Electronics Household | Kitchen Appliances in Dubai",
  description: "Explore air fryers, blenders, choppers, juicers, spice grinders, stoves and kettles from Adnan Electronics Household. Delivery across the UAE and GCC.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={font.className}>
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
