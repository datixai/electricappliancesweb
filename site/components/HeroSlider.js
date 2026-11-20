"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

function ArrowIcon({ direction }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path d={direction === "previous" ? "M15 5 8 12l7 7" : "m9 5 7 7-7 7"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function HeroSlider({ slides }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(preference.matches);

    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (slides.length < 2 || isHovered || hasFocus || prefersReducedMotion) return;

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [activeIndex, hasFocus, isHovered, prefersReducedMotion, slides.length]);

  if (!slides.length) return null;

  const goTo = (index) => {
    setActiveIndex((index + slides.length) % slides.length);
  };

  return (
    <div
      className="wrap home-hero-carousel"
      role="region"
      aria-label="Featured kitchen appliances"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setHasFocus(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setHasFocus(false);
      }}
    >
      <div className="hero-slides" aria-live="off">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;
          return (
            <article
              key={slide.id}
              className={"hero-slide" + (isActive ? " is-active" : "")}
              aria-hidden={!isActive}
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slides.length}: ${slide.productName}`}
            >
              <div className="home-hero-copy">
                <span className="eyebrow">{slide.categoryName}</span>
                <h1>{slide.headline}</h1>
                <p className="hero-slide-description">{slide.description}</p>
                <ul className="hero-promises">
                  <li><span>01</span> Original products</li>
                  <li><span>02</span> Warranty information</li>
                  <li><span>03</span> UAE &amp; GCC delivery</li>
                </ul>
              </div>
              <div className="hero-visual">
                <div className="hero-product hero-product-main">
                  <Image
                    src={slide.image}
                    alt={slide.productName}
                    fill
                    sizes="(max-width: 640px) 90vw, (max-width: 900px) 45vw, 42vw"
                    priority={index === 0}
                  />
                </div>
                <div className="hero-caption">
                  <span>{slide.brand}{slide.model ? ` · ${slide.model}` : ""}</span>
                  <b>{slide.productName}</b>
                </div>
                {slides.length > 1 && (
                  <div className="hero-carousel-controls" role="group" aria-label="Carousel navigation">
                    <div className="hero-carousel-dots">
                      {slides.map((item, dotIndex) => (
                        <button
                          key={item.id}
                          type="button"
                          className={"hero-carousel-dot" + (dotIndex === activeIndex ? " is-active" : "")}
                          aria-label={`Show slide ${dotIndex + 1}: ${item.productName}`}
                          aria-pressed={dotIndex === activeIndex}
                          onClick={() => goTo(dotIndex)}
                        />
                      ))}
                    </div>
                    <div className="hero-carousel-arrows">
                      <button type="button" aria-label="Previous slide" onClick={() => goTo(activeIndex - 1)}>
                        <ArrowIcon direction="previous" />
                      </button>
                      <button type="button" aria-label="Next slide" onClick={() => goTo(activeIndex + 1)}>
                        <ArrowIcon direction="next" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
