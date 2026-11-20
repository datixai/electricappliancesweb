"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/* Split hero: copy on the left, a large photo panel on the right that cross-fades
   between lifestyle photos with a slow zoom (same feel as the Luxe page heroes). */
export default function HeroSlider({ slides }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (slides.length < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setActive((i) => (i + 1) % slides.length), 6000);
    return () => window.clearInterval(t);
  }, [paused, slides.length]);

  if (!slides.length) return null;
  const s = slides[active];

  return (
    <div
      className="hx"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured kitchen appliances"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false); }}
    >
      <div className="wrap hx-grid">
        <div className="hx-copy" key={s.key}>
          <p className="eyebrow light">{s.kicker}</p>
          <h1>{s.title}</h1>
          <p className="hx-text">{s.text}</p>
          <div className="hx-cta">
            <Link href={s.href} className="btn-gold">{s.cta}</Link>
            <Link href="/shop" className="btn-ghost">All categories</Link>
          </div>
          <ul className="hx-trust">
            <li><b>100%</b>Original products</li>
            <li><b>1-3 yr</b>Warranty</li>
            <li><b>6</b>GCC countries</li>
          </ul>
        </div>

        <div className="hx-media">
          {slides.map((sl, k) => (
            <div key={sl.key} className={"hx-img" + (k === active ? " on" : "")} aria-hidden={k !== active}>
              <img src={sl.image} alt={k === active ? sl.alt : ""} style={{ objectPosition: sl.pos || "center" }} fetchPriority={k === 0 ? "high" : "low"} />
            </div>
          ))}
          <div className="hx-tag" key={"t" + s.key}><span>{s.tagSmall}</span><b>{s.tag}</b></div>
          {slides.length > 1 && (
            <div className="hx-dots" role="group" aria-label="Choose slide">
              {slides.map((sl, k) => (
                <button key={sl.key} type="button" className={k === active ? "on" : ""} aria-label={`Show slide ${k + 1}: ${sl.kicker}`} aria-pressed={k === active} onClick={() => setActive(k)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
