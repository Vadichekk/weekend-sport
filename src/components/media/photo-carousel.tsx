"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Lightbox, type LightboxItem } from "@/components/media/lightbox";

export function PhotoCarousel({ items }: { items: LightboxItem[] }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const current = items[index];

  useEffect(() => {
    if (items.length < 2 || paused || open) return;
    const timer = window.setInterval(() => {
      setIndex((value) => (value + 1) % items.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [items.length, paused, open]);

  if (!current) return null;

  return (
    <div
      className="relative overflow-hidden rounded-[28px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative block aspect-[16/9] w-full"
        aria-label={`Открыть фото: ${current.alt}`}
      >
        <Image
          src={current.url}
          alt={current.alt}
          fill
          className="object-cover transition duration-700"
          sizes="(max-width: 768px) 100vw, 1100px"
        />
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent px-5 py-4 text-left text-sm text-white">
          {current.caption || "Нажмите, чтобы увеличить"}
        </span>
      </button>

      {items.length > 1 ? (
        <>
          <button
            type="button"
            className="absolute left-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/35 text-white"
            onClick={() => setIndex((value) => (value - 1 + items.length) % items.length)}
            aria-label="Предыдущее фото"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="absolute right-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/35 text-white"
            onClick={() => setIndex((value) => (value + 1) % items.length)}
            aria-label="Следующее фото"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {items.map((item, itemIndex) => (
              <button
                key={item.id}
                type="button"
                className={`h-1.5 rounded-full transition ${
                  itemIndex === index ? "w-6 bg-white" : "w-1.5 bg-white/50"
                }`}
                onClick={() => setIndex(itemIndex)}
                aria-label={`Фото ${itemIndex + 1}`}
              />
            ))}
          </div>
        </>
      ) : null}

      {open ? (
        <Lightbox
          items={items}
          index={index}
          onClose={() => setOpen(false)}
          onChangeIndex={setIndex}
        />
      ) : null}
    </div>
  );
}
