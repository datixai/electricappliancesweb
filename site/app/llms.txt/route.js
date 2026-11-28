import { getCategories } from "@/lib/store";

export const dynamic = "force-dynamic";

// Plain-text summary of the shop for AI assistants and search tools. Always lists the current categories.
export async function GET() {
  const cats = await getCategories();
  const body = [
    "# Adnan Electronics Household (لوازم خانگی)",
    "",
    "> Kitchen appliance shop in Deira, Dubai, UAE. Original products with warranty and delivery across the UAE, Saudi Arabia, Qatar, Kuwait, Bahrain and Oman. Orders and questions by WhatsApp, phone or email.",
    "",
    "## Shop",
    "- [All products](/shop): the full catalogue",
    ...cats.map((c) => `- [${c.name}](/category/${c.slug})${c.blurb ? ": " + c.blurb : ""}`),
    "",
    "## About",
    "- [About us](/about)",
    "- [Contact](/contact): Shop No. 29, Fikri Building, Deira, Dubai",
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
