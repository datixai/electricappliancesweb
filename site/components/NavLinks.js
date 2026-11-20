"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES } from "@/lib/site";

// Category menu that highlights only the page the visitor is on.
export default function NavLinks() {
  const path = usePathname() || "/";
  const links = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop all" },
    ...CATEGORIES.map((c) => ({ href: `/category/${c.slug}`, label: c.name })),
  ];
  return links.map((l) => {
    const active = l.href === "/" ? path === "/" : path === l.href || path.startsWith(l.href + "/");
    return (
      <Link key={l.href} href={l.href} className={active ? "active" : undefined} aria-current={active ? "page" : undefined}>
        {l.label}
      </Link>
    );
  });
}
