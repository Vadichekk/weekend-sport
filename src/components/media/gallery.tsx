"use client";

import Image from "next/image";
import { useState } from "react";
import { Lightbox, type LightboxItem } from "@/components/media/lightbox";

export function Gallery({ items }: { items: LightboxItem[] }) {
  const [index, setIndex] = useState<number | null>(null);

  if (!items.length) return null;

  return (
    <>
      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item, itemIndex) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setIndex(itemIndex)}
            className={`relative overflow-hidden rounded-[24px] ${
              itemIndex === 0 ? "aspect-[16/9] md:col-span-2" : "aspect-[4/3]"
            }`}
          >
            <Image
              src={item.url}
              alt={item.alt}
              fill
              className="object-cover transition duration-500 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 700px"
            />
          </button>
        ))}
      </div>
      {index !== null ? (
        <Lightbox
          items={items}
          index={index}
          onClose={() => setIndex(null)}
          onChangeIndex={setIndex}
        />
      ) : null}
    </>
  );
}
