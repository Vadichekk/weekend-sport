import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "forest",
}: {
  children: React.ReactNode;
  tone?: "forest" | "clay" | "sand" | "warn";
}) {
  const tones = {
    forest: "bg-forest/10 text-forest",
    clay: "bg-clay/12 text-clay-deep",
    sand: "bg-black/5 text-muted",
    warn: "bg-amber-100 text-amber-900",
  };

  return (
    <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-semibold", tones[tone])}>
      {children}
    </span>
  );
}
