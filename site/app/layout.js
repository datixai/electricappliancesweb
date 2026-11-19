import "./globals.css";
import { Poppins } from "next/font/google";
import { Header, Footer, WhatsAppFloat } from "@/components/ui";

const font = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export const metadata = {
  title: "Adnan Electronics Household | Kitchen Appliances in Dubai",
  description: "Air fryers, blenders, choppers, juicers, spice grinders, stoves and kettles. Original products, fast delivery across the UAE.",
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
