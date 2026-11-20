import { Header, Footer, WhatsAppFloat } from "@/components/ui";

export default function SiteLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
