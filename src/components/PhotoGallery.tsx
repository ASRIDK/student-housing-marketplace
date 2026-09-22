"use client";

import { useState } from "react";
import Image from "next/image";

type PhotoGalleryProps = {
  photos: string[];
  alt: string;
};

export default function PhotoGallery({ photos, alt }: PhotoGalleryProps) {
  const [active, setActive] = useState(0);

  // No photos: show a single grey placeholder.
  if (photos.length === 0) {
    return (
      <div className="flex aspect-[4/3] w-full items-center justify-center rounded-xl bg-neutral-100 text-sm text-neutral-400">
        No photos yet
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-neutral-100">
        <Image
          src={photos[active]}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
          priority
        />
      </div>

      {photos.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {photos.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1}`}
              className={`relative aspect-[4/3] overflow-hidden rounded-lg transition ${
                i === active
                  ? "ring-2 ring-neutral-900"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill sizes="25vw" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
