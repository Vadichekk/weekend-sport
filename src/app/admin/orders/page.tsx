import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/dates";
import { formatPrice } from "@/lib/utils";
import { guardAdmin } from "../actions";

export default async function AdminOrdersPage() {
  await guardAdmin();
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div>
      <h1 className="font-display text-4xl">Заказы</h1>
      <div className="mt-8 space-y-3">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/admin/orders/${order.id}`}
            className="flex items-center justify-between rounded-2xl bg-paper px-5 py-4"
          >
            <div>
              <p className="font-semibold">{order.publicNumber}</p>
              <p className="text-sm text-muted">
                {order.parentName} · {order.parentPhone} · {formatDateTime(order.createdAt)}
              </p>
            </div>
            <p className="text-sm">
              {formatPrice(order.totalAmount)} · {order.status}
            </p>
          </Link>
        ))}
        {orders.length === 0 ? <p className="text-muted">Заказов ещё нет.</p> : null}
      </div>
    </div>
  );
}
