"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { formatRange } from "@/lib/dates";
import { formatPrice } from "@/lib/utils";

type SessionInfo = {
  id: string;
  locationName: string;
  locationSlug: string;
  startDate: string;
  endDate: string;
  pricePerChild: number;
  spotsLeft: number;
};

export function CartView({ sessions }: { sessions: SessionInfo[] }) {
  const { items, ready, updateItem, removeItem } = useCart();
  const rows = items
    .map((item) => {
      const session = sessions.find((entry) => entry.id === item.sessionId);
      if (!session) return null;
      return { ...item, session };
    })
    .filter(Boolean);

  const total = rows.reduce(
    (sum, row) => sum + row!.session.pricePerChild * row!.quantity,
    0,
  );

  if (!ready) {
    return <div className="rounded-[28px] bg-paper p-8 text-muted">Открываем корзину…</div>;
  }

  if (!rows.length) {
    return (
      <div className="rounded-[28px] bg-paper p-8 text-center">
        <p className="font-display text-3xl">Корзина пустая</p>
        <p className="mt-3 text-muted">
          Откройте базу, выберите дату и нажмите «Выбрать дату» — путёвка появится здесь.
        </p>
        <div className="mt-6">
          <Button href="/bases">Выбрать базу</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {rows.map((row) => {
        const item = row!;
        return (
          <article key={item.sessionId} className="rounded-[24px] bg-paper p-5 ring-1 ring-black/5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Link href={`/bases/${item.session.locationSlug}`} className="font-display text-2xl">
                  {item.session.locationName}
                </Link>
                <p className="mt-1 text-sm text-muted">
                  {formatRange(new Date(item.session.startDate), new Date(item.session.endDate))}
                </p>
              </div>
              <p className="font-semibold">
                {formatPrice(item.session.pricePerChild * item.quantity)}
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3 rounded-full bg-cream px-3 py-2">
                <button onClick={() => updateItem(item.sessionId, item.quantity - 1)}>−</button>
                <span className="w-6 text-center">{item.quantity}</span>
                <button
                  onClick={() =>
                    updateItem(
                      item.sessionId,
                      Math.min(item.session.spotsLeft, item.quantity + 1),
                    )
                  }
                >
                  +
                </button>
              </div>
              <button className="text-sm text-muted" onClick={() => removeItem(item.sessionId)}>
                Убрать
              </button>
            </div>
          </article>
        );
      })}
      <div className="flex items-center justify-between rounded-[24px] bg-forest px-6 py-5 text-cream">
        <span>Итого</span>
        <span className="font-display text-3xl">{formatPrice(total)}</span>
      </div>
      <Button href="/checkout" className="w-full">
        Оформить
      </Button>
    </div>
  );
}
