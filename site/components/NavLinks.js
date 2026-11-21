"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks() {
  const path = usePathname() || "/";
  const links = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop All" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
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
