import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatRange } from "@/lib/dates";
import { formatPrice, parseJsonArray } from "@/lib/utils";
import { guardAdmin } from "../../actions";

export default async function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  await guardAdmin();
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { session: { include: { location: true } } } },
      amoJobs: true,
      paymentEvents: true,
    },
  });
  if (!order) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl">{order.publicNumber}</h1>
      <div className="rounded-[24px] bg-paper p-6 text-sm leading-7">
        <p>Родитель: {order.parentName}, {order.parentPhone}, {order.parentEmail || "без email"}</p>
        <p>Сумма: {formatPrice(order.totalAmount)}</p>
        <p>Оплата: {order.status} · {order.paymentProvider} · {order.paymentId || "нет id"}</p>
        <p>Согласие на ПДн: {order.pdnConsent ? "да" : "нет"}</p>
      </div>
      <div className="space-y-3">
        {order.items.map((item) => {
          const children = parseJsonArray<{ name: string; age: number }>(item.children);
          return (
            <div key={item.id} className="rounded-[24px] bg-paper p-5">
              <p className="font-semibold">
                {item.session.location.name}, {formatRange(item.session.startDate, item.session.endDate)}
              </p>
              <p className="mt-2 text-sm text-muted">
                {item.quantity} × {formatPrice(item.priceEach)}
              </p>
              <ul className="mt-2 text-sm">
                {children.map((child) => (
                  <li key={`${child.name}-${child.age}`}>
                    {child.name}, {child.age} лет
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      <div className="text-sm text-muted">
        <p>События оплаты: {order.paymentEvents.length}</p>
        <p>Задачи amoCRM: {order.amoJobs.map((job) => `${job.status}`).join(", ") || "нет"}</p>
        <p>ID сделок: {order.amoLeadIds}</p>
      </div>
    </div>
  );
}
