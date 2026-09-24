"use client";

import { useState } from "react";
import Image from "next/image";

type PhotoGalleryProps = {
  photos: string[];
  alt: string;
};

/**
 * Photos as the top of the page: one large frame with the rest as a strip
 * underneath. With a single photo the strip disappears, and with none we
 * say so rather than showing a broken frame.
 */
export default function PhotoGallery({ photos, alt }: PhotoGalleryProps) {
  const [active, setActive] = useState(0);

  if (photos.length === 0) {
    return (
      <div className="grid aspect-[16/10] w-full place-items-center rounded-3xl bg-mist text-sm text-slate">
        No photos yet — ask for some when you get in touch
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl bg-mist">
        <Image
          src={photos[active]}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 62vw"
          className="object-cover"
          priority
          loading="eager"
        />
      </div>

      {photos.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {photos.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show photo ${index + 1} of ${photos.length}`}
              aria-pressed={index === active}
              className={`relative aspect-[4/3] overflow-hidden rounded-xl transition ${
                index === active
                  ? "ring-2 ring-navy ring-offset-2"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill sizes="20vw" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
