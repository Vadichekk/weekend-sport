import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/site/header";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { formatRange } from "@/lib/dates";
import { formatPrice, parseJsonArray } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Оплата прошла",
  description: "Заказ на спортивный уикенд оплачен.",
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderId } = await searchParams;
  const order = orderId
    ? await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: { include: { session: { include: { location: true } } } } },
      })
    : null;

  return (
    <main className="min-h-screen bg-bg">
      <div className="bg-forest pb-16 pt-28 text-cream">
        <Header inverted />
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h1 className="font-display text-5xl">Оплата прошла</h1>
          <p className="mt-3 text-cream/70">Заказ принят. Дальше всё в кабинете родителя.</p>
        </div>
      </div>
      <div className="mx-auto max-w-lg space-y-4 px-4 py-12 md:px-6">
        <div className="rounded-[28px] bg-paper p-8">
          {order ? (
            <div className="space-y-4">
              <p className="text-sm text-muted">Номер заказа</p>
              <p className="font-display text-3xl">{order.publicNumber}</p>
              <p className="text-lg font-semibold">{formatPrice(order.totalAmount)}</p>
              <p className="text-sm text-muted">
                Статус: {order.status === "paid" ? "оплачен" : order.status}
              </p>
              <ul className="space-y-2 text-sm">
                {order.items.map((item) => {
                  const children = parseJsonArray<{ name: string; age: number }>(item.children);
                  return (
                    <li key={item.id}>
                      {item.session.location.name},{" "}
                      {formatRange(item.session.startDate, item.session.endDate)}
                      {children.length
                        ? ` — ${children.map((child) => `${child.name}, ${child.age} лет`).join("; ")}`
                        : ""}
                    </li>
                  );
                })}
              </ul>
              <p className="text-sm leading-6 text-muted">
                Войти в кабинет: телефон из заказа и пароль, который задали на оформлении.
              </p>
            </div>
          ) : (
            <p className="text-muted">
              Платёж принят, но заказ не найден на этой странице. Откройте кабинет родителя —
              он должен быть там.
            </p>
          )}
          <div className="mt-6 flex flex-col gap-3">
            <Button href="/account">Открыть кабинет родителя</Button>
            <Link href="/bases" className="text-center text-sm text-muted">
              Выбрать ещё заезд
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
