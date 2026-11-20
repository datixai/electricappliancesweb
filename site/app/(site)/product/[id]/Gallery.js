"use client";
import { useState } from "react";

export default function Gallery({ images, name }) {
  const [i, setI] = useState(0);
  return (
    <div className="product-gallery">
      <div className="product-gallery-main">
        <img src={images[i]} alt={`${name}, image ${i + 1}`} fetchPriority="high" />
      </div>
      {images.length > 1 && (
        <div className="product-gallery-thumbnails" role="group" aria-label="Product images">
          {images.map((src, k) => (
            <button
              key={k}
              type="button"
              onClick={() => setI(k)}
              className={k === i ? "is-selected" : ""}
              aria-label={"Show product image " + (k + 1)}
              aria-pressed={k === i}
            >
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
