import Image from "next/image";
import { cn } from "@/lib/utils";

export function CoverImage({
  src,
  alt,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  const empty = !src || src.includes("cover-empty");

  if (empty) {
    return (
      <div className={cn("absolute inset-0 grid place-items-center bg-forest", className)}>
        <div className="flex flex-col items-center gap-3 text-cream/80">
          <Image src="/brand/logo.png" alt="" width={88} height={88} className="rounded-full" />
          <span className="text-xs uppercase tracking-[0.18em]">медиа базы скоро</span>
        </div>
      </div>
    );
  }

  return (
    <Image src={src} alt={alt} fill priority={priority} className={cn("object-cover", className)} />
  );
}
