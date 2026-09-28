"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { createCheckout } from "@/app/(site)/checkout/actions";
import { PhoneField } from "@/components/forms/phone-field";
import { formatRange } from "@/lib/dates";
import { formatPrice } from "@/lib/utils";

type SessionInfo = {
  id: string;
  locationName: string;
  startDate: string;
  endDate: string;
  pricePerChild: number;
};

type Child = { name: string; age: string };

export function CheckoutForm({ sessions }: { sessions: SessionInfo[] }) {
  const { items, ready } = useCart();
  const rows = items
    .map((item) => {
      const session = sessions.find((entry) => entry.id === item.sessionId);
      return session ? { ...item, session } : null;
    })
    .filter(Boolean) as { sessionId: string; quantity: number; session: SessionInfo }[];

  const [childrenMap, setChildrenMap] = useState<Record<string, Child[]>>({});

  const prepared = useMemo(() => {
    return rows.map((row) => {
      const current = childrenMap[row.sessionId] || [];
      const children = Array.from({ length: row.quantity }, (_, index) => current[index] || {
        name: "",
        age: "",
      });
      return { ...row, children };
    });
  }, [rows, childrenMap]);

  const payload = JSON.stringify(
    prepared.map((row) => ({
      sessionId: row.sessionId,
      children: row.children.map((child) => ({
        name: child.name.trim(),
        age: Number(child.age),
      })),
    })),
  );

  const total = prepared.reduce(
    (sum, row) => sum + row.session.pricePerChild * row.quantity,
    0,
  );

  if (!ready) {
    return <div className="rounded-[28px] bg-paper p-8 text-muted">Открываем корзину…</div>;
  }

  if (!prepared.length) {
    return (
      <div className="rounded-[28px] bg-paper p-8 text-center">
        <p>Сначала соберите корзину.</p>
        <div className="mt-4">
          <Button href="/bases">К базам</Button>
        </div>
      </div>
    );
  }

  return (
    <form action={createCheckout} className="space-y-6">
      <input type="hidden" name="items" value={payload} />
      <section className="space-y-4 rounded-[28px] bg-paper p-6">
        <h2 className="font-display text-2xl">Родитель</h2>
        <label className="block text-sm">
          ФИО
          <input
            required
            name="parentName"
            className="mt-2 w-full rounded-2xl bg-cream px-4 py-3 outline-none ring-1 ring-black/5"
          />
        </label>
        <PhoneField />
        <label className="block text-sm">
          Email, по желанию
          <input
            name="parentEmail"
            type="email"
            className="mt-2 w-full rounded-2xl bg-cream px-4 py-3 outline-none ring-1 ring-black/5"
          />
        </label>
        <label className="block text-sm">
          Пароль для кабинета родителя
          <input
            required
            name="password"
            type="password"
            minLength={6}
            className="mt-2 w-full rounded-2xl bg-cream px-4 py-3 outline-none ring-1 ring-black/5"
          />
          <span className="mt-2 block text-xs text-muted">
            Запомните его: этим телефоном и паролем потом входите в «Кабинет родителя».
          </span>
        </label>
      </section>

      {prepared.map((row) => (
        <section key={row.sessionId} className="space-y-4 rounded-[28px] bg-paper p-6">
          <div>
            <h2 className="font-display text-2xl">{row.session.locationName}</h2>
            <p className="text-sm text-muted">
              {formatRange(new Date(row.session.startDate), new Date(row.session.endDate))} ·{" "}
              {formatPrice(row.session.pricePerChild)} за ребёнка
            </p>
          </div>
          {row.children.map((child, index) => (
            <div key={`${row.sessionId}-${index}`} className="grid gap-3 md:grid-cols-[1fr_120px]">
              <input
                required
                placeholder={`Имя ребёнка ${index + 1}`}
                value={child.name}
                onChange={(event) => {
                  const next = [...row.children];
                  next[index] = { ...next[index], name: event.target.value };
                  setChildrenMap((current) => ({ ...current, [row.sessionId]: next }));
                }}
                className="rounded-2xl bg-cream px-4 py-3 outline-none ring-1 ring-black/5"
              />
              <input
                required
                type="number"
                min={4}
                max={17}
                placeholder="Возраст"
                value={child.age}
                onChange={(event) => {
                  const next = [...row.children];
                  next[index] = { ...next[index], age: event.target.value };
                  setChildrenMap((current) => ({ ...current, [row.sessionId]: next }));
                }}
                className="rounded-2xl bg-cream px-4 py-3 outline-none ring-1 ring-black/5"
              />
            </div>
          ))}
        </section>
      ))}

      <label className="flex items-start gap-3 text-sm leading-6 text-muted">
        <input required type="checkbox" name="pdnConsent" className="mt-1" />
        <span>
          Соглашаюсь на обработку персональных данных. Текст политики — заглушка, его можно
          заменить на странице «Политика ПДн».
        </span>
      </label>

      <div className="flex items-center justify-between rounded-[24px] bg-forest px-6 py-5 text-cream">
        <span>К оплате</span>
        <span className="font-display text-3xl">{formatPrice(total)}</span>
      </div>
      <Button type="submit" className="w-full">
        Перейти к оплате
      </Button>
    </form>
  );
}
