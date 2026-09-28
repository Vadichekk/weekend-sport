import { prisma } from "@/lib/prisma";
import { guardAdmin } from "./actions";
import { formatPrice } from "@/lib/utils";

export default async function AdminHomePage() {
  await guardAdmin();
  const [locations, sessions, orders, paid] = await Promise.all([
    prisma.location.count(),
    prisma.session.count(),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { totalAmount: true }, where: { status: "paid" } }),
  ]);

  return (
    <div>
      <h1 className="font-display text-4xl">Сводка</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {[
          ["Базы", String(locations)],
          ["Заезды", String(sessions)],
          ["Заказы", String(orders)],
          ["Оплачено", formatPrice(paid._sum.totalAmount || 0)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-[24px] bg-paper p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">{label}</p>
            <p className="mt-2 font-display text-3xl">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
