"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";

export type LightboxItem = {
  id: string;
  url: string;
  alt: string;
  caption?: string;
};

export function Lightbox({
  items,
  index,
  onClose,
  onChangeIndex,
}: {
  items: LightboxItem[];
  index: number;
  onClose: () => void;
  onChangeIndex?: (index: number) => void;
}) {
  const [zoom, setZoom] = useState(1);
  const current = items[index];

  useEffect(() => {
    setZoom(1);
  }, [index]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight" && onChangeIndex && items.length > 1) {
        onChangeIndex((index + 1) % items.length);
      }
      if (event.key === "ArrowLeft" && onChangeIndex && items.length > 1) {
        onChangeIndex((index - 1 + items.length) % items.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [index, items.length, onChangeIndex, onClose]);

  if (!current) return null;

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/85"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Просмотр фото"
    >
      <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white"
          onClick={(event) => {
            event.stopPropagation();
            setZoom((value) => Math.max(1, Number((value - 0.5).toFixed(1))));
          }}
          aria-label="Уменьшить"
        >
          <ZoomOut className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white"
          onClick={(event) => {
            event.stopPropagation();
            setZoom((value) => Math.min(3, Number((value + 0.5).toFixed(1))));
          }}
          aria-label="Увеличить"
        >
          <ZoomIn className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white"
          onClick={onClose}
          aria-label="Закрыть"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {items.length > 1 && onChangeIndex ? (
        <>
          <button
            type="button"
            className="absolute left-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white"
            onClick={(event) => {
              event.stopPropagation();
              onChangeIndex((index - 1 + items.length) % items.length);
            }}
            aria-label="Предыдущее фото"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="absolute right-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white"
            onClick={(event) => {
              event.stopPropagation();
              onChangeIndex((index + 1) % items.length);
            }}
            aria-label="Следующее фото"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      ) : null}

      <div
        className="flex h-full items-center justify-center overflow-auto p-6 pt-20"
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="relative h-[78vh] w-full max-w-6xl cursor-zoom-in transition-transform duration-200"
          style={{ transform: `scale(${zoom})` }}
          onClick={() => setZoom((value) => (value >= 2 ? 1 : Number((value + 0.5).toFixed(1))))}
        >
          <Image src={current.url} alt={current.alt} fill className="object-contain" sizes="100vw" />
        </div>
      </div>
      {current.caption ? (
        <p className="pointer-events-none absolute inset-x-0 bottom-0 bg-black/50 px-4 py-3 text-center text-sm text-white">
          {current.caption}
        </p>
      ) : null}
    </div>
  );
}
