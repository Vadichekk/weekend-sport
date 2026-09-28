"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRange } from "@/lib/dates";
import { formatPrice, spotsLabel } from "@/lib/utils";
import { sessionStatusLabel } from "@/lib/session-status";

type SessionOption = {
  id: string;
  startDate: string;
  endDate: string;
  pricePerChild: number;
  spotsLeft: number;
  status: string;
};

export function DatePicker({
  locationName,
  sessions,
}: {
  locationName: string;
  sessions: SessionOption[];
}) {
  const { addItem } = useCart();
  const firstOpen = sessions.find((session) => session.status !== "closed");
  const [selected, setSelected] = useState(firstOpen?.id || sessions[0]?.id || "");
  const [quantity, setQuantity] = useState(1);
  const current = sessions.find((session) => session.id === selected);

  if (!sessions.length) {
    return (
      <div className="rounded-[28px] bg-paper p-6 ring-1 ring-black/5">
        <p className="font-display text-2xl">Ближайшие заезды</p>
        <p className="mt-3 text-sm text-muted">Даты появятся в админке.</p>
      </div>
    );
  }

  const canBook = current && current.status !== "closed" && quantity <= current.spotsLeft;

  return (
    <div className="rounded-[28px] bg-paper p-6 shadow-[var(--shadow)] ring-1 ring-black/5">
      <p className="text-xs uppercase tracking-[0.16em] text-muted">Запись на {locationName}</p>
      <h2 className="mt-2 font-display text-3xl">Выберите дату</h2>
      <div className="mt-5 space-y-3">
        {sessions.map((session) => {
          const active = session.id === selected;
          return (
            <button
              key={session.id}
              disabled={session.status === "closed"}
              onClick={() => setSelected(session.id)}
              className={`flex w-full items-start justify-between rounded-2xl px-4 py-4 text-left ring-1 transition ${
                active ? "bg-forest text-cream ring-forest" : "bg-cream ring-black/5"
              } ${session.status === "closed" ? "opacity-50" : ""}`}
            >
              <div>
                <p className="font-semibold">
                  {formatRange(new Date(session.startDate), new Date(session.endDate))}
                </p>
                <p className={`mt-1 text-xs ${active ? "text-cream/70" : "text-muted"}`}>
                  {spotsLabel(session.spotsLeft)} · {formatPrice(session.pricePerChild)}
                </p>
              </div>
              <Badge tone={session.status === "few" ? "warn" : session.status === "closed" ? "sand" : "clay"}>
                {sessionStatusLabel(session.status)}
              </Badge>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-between rounded-2xl bg-cream px-4 py-3">
        <span className="text-sm">Детей в этой путёвке</span>
        <div className="flex items-center gap-3">
          <button
            className="grid h-8 w-8 place-items-center rounded-full bg-white"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
          >
            −
          </button>
          <span className="w-6 text-center font-semibold">{quantity}</span>
          <button
            className="grid h-8 w-8 place-items-center rounded-full bg-white"
            onClick={() =>
              setQuantity((value) => Math.min(current?.spotsLeft || 1, value + 1))
            }
          >
            +
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <Button
          disabled={!canBook}
          onClick={() => {
            if (!current || !canBook) return;
            addItem(current.id, quantity);
            window.location.href = "/cart";
          }}
        >
          Выбрать дату
          {current ? ` · ${formatPrice(current.pricePerChild * quantity)}` : ""}
        </Button>
        <p className="text-center text-xs text-muted">
          Можно добавить ещё одну базу или другой заезд из корзины.
        </p>
      </div>
    </div>
  );
}
