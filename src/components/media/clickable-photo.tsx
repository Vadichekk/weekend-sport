"use client";

import Image from "next/image";
import { useState } from "react";
import { Lightbox, type LightboxItem } from "@/components/media/lightbox";

export function ClickablePhoto({
  src,
  alt,
  caption,
  className = "",
  sizes = "100vw",
  items,
  startIndex = 0,
}: {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  sizes?: string;
  items?: LightboxItem[];
  startIndex?: number;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const gallery = items?.length ? items : [{ id: src, url: src, alt, caption }];

  return (
    <>
      <button
        type="button"
        onClick={() => setIndex(startIndex)}
        className={`relative block overflow-hidden ${className}`}
        aria-label={`Открыть фото: ${alt}`}
      >
        <Image src={src} alt={alt} fill className="object-cover transition duration-500 hover:scale-105" sizes={sizes} />
      </button>
      {index !== null ? (
        <Lightbox
          items={gallery}
          index={index}
          onClose={() => setIndex(null)}
          onChangeIndex={gallery.length > 1 ? setIndex : undefined}
        />
      ) : null}
    </>
  );
}
