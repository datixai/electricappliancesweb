"use client";
import { useState } from "react";

export default function Gallery({ images, name }) {
  const [i, setI] = useState(0);
  return (
    <div className="gallery">
      <div className="g-main"><img src={images[i]} alt={name} /></div>
      {images.length > 1 && (
        <div className="g-thumbs">
          {images.map((src, k) => (
            <button key={k} onClick={() => setI(k)} className={k === i ? "on" : ""} aria-label={"Photo " + (k + 1)}>
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
