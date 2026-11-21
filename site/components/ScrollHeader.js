"use client";

import { useEffect, useState } from "react";

export default function ScrollHeader({ children }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => {
      const scrolled = window.scrollY > 12;
      setIsScrolled((current) => current === scrolled ? current : scrolled);
    };
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  return (
    <header className={`site-header${isScrolled ? " is-scrolled" : ""}`}>
      {children}
    </header>
  );
}
