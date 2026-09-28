import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Header } from "@/components/site/header";
import { requireParent } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDateTime, formatRange } from "@/lib/dates";
import { formatPrice } from "@/lib/utils";
import { logoutParent } from "./actions";

export const metadata: Metadata = {
  title: "Кабинет родителя",
  description: "Заказы и статусы оплаты выездного уикенда.",
};

const statusLabel: Record<string, string> = {
  pending: "Ожидает оплату",
  paid: "Оплачен",
  failed: "Оплата не прошла",
};

export default async function AccountPage() {
  const auth = await requireParent();
  if (!auth) redirect("/account/login");

  const orders = await prisma.order.findMany({
    where: { parentId: auth.parent.id },
    include: { items: { include: { session: { include: { location: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-bg">
      <div className="bg-forest pb-16 pt-28 text-cream">
        <Header inverted />
        <div className="mx-auto flex max-w-6xl items-end justify-between px-4 md:px-6">
          <div>
            <h1 className="font-display text-5xl">Кабинет</h1>
            <p className="mt-3 text-cream/70">{auth.parent.name}</p>
          </div>
          <form action={logoutParent}>
            <button className="text-sm text-cream/70">Выйти</button>
          </form>
        </div>
      </div>
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-12 md:px-6">
        {orders.length === 0 ? (
          <p className="rounded-[28px] bg-paper p-8 text-muted">Заказов пока нет.</p>
        ) : (
          orders.map((order) => (
            <article key={order.id} className="rounded-[28px] bg-paper p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-muted">{order.publicNumber}</p>
                  <p className="mt-1 font-display text-2xl">{formatPrice(order.totalAmount)}</p>
                </div>
                <span className="rounded-full bg-cream px-3 py-1 text-xs font-semibold">
                  {statusLabel[order.status] || order.status}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted">{formatDateTime(order.createdAt)}</p>
              <div className="mt-4 space-y-2 text-sm">
                {order.items.map((item) => (
                  <p key={item.id}>
                    {item.session.location.name},{" "}
                    {formatRange(item.session.startDate, item.session.endDate)} · {item.quantity} дет.
                  </p>
                ))}
              </div>
            </article>
          ))
        )}
      </div>
    </main>
  );
}
