import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "dark" | "line";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
};

const styles = {
  primary:
    "bg-clay text-white hover:bg-clay-deep shadow-[0_10px_24px_rgba(197,106,69,0.25)]",
  dark: "bg-forest text-cream hover:bg-forest-soft",
  ghost: "bg-white/15 text-white ring-1 ring-white/30 hover:bg-white/25",
  line: "bg-transparent text-forest ring-1 ring-forest/20 hover:bg-forest/5",
};

export function Button({
  href,
  children,
  variant = "primary",
  className,
  type = "button",
  onClick,
  disabled,
}: Props) {
  const cls = cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition disabled:opacity-50",
    styles[variant],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}
