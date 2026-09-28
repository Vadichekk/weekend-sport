"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { cn } from "@/lib/utils";

export function Header({ inverted = false }: { inverted?: boolean }) {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/bases", label: "Базы" },
    { href: "/#how", label: "Как проходит" },
    { href: "/#steps", label: "Запись" },
    { href: "/account", label: "Кабинет родителя" },
  ];

  const cartClass =
    "inline-flex items-center gap-2 rounded-full bg-[#c56a45] px-4 py-2.5 text-sm font-semibold !text-white shadow-md";

  return (
    <header
      className={cn(
        "absolute inset-x-0 top-0 z-40",
        inverted ? "text-white" : "text-ink",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/brand/logo.png"
            alt="Уикенд"
            width={44}
            height={44}
            className="h-11 w-11 rounded-full shadow-sm ring-2 ring-white/20"
          />
          <span className="leading-tight">
            <span className="block font-display text-lg leading-none">Уикенд</span>
            <span className={cn("text-xs", inverted ? "text-white/70" : "text-muted")}>
              выездной спорт
            </span>
          </span>
        </Link>

        <nav className={cn("hidden items-center gap-7 text-sm md:flex", inverted ? "text-white" : "text-ink")}>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="opacity-80 hover:opacity-100">
              {link.label}
            </Link>
          ))}
          <Link href="/cart" className={cartClass} aria-label="Корзина">
            <ShoppingBag className="h-4 w-4 shrink-0" />
            <span>Корзина</span>
            {count ? (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-white px-1.5 text-[11px] font-bold text-[#1e3b31]">
                {count}
              </span>
            ) : null}
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Link href="/cart" className={cartClass} aria-label="Корзина">
            <ShoppingBag className="h-4 w-4 shrink-0" />
            <span>Корзина</span>
            {count ? (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-white px-1.5 text-[11px] font-bold text-[#1e3b31]">
                {count}
              </span>
            ) : null}
          </Link>
          <button onClick={() => setOpen((value) => !value)} aria-label="Меню">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="mx-4 rounded-3xl bg-paper p-5 text-ink shadow-lg md:hidden">
          <div className="flex flex-col gap-4 text-sm">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link href="/cart" onClick={() => setOpen(false)} className="font-semibold">
              Корзина{count ? ` · ${count}` : ""}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
