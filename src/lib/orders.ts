import { prisma } from "@/lib/prisma";
import { enqueueAmoJobs } from "@/lib/amocrm/client";
import { deriveSessionStatus } from "@/lib/session-status";
import type { PaymentStatus } from "@/lib/payments/types";

export async function applyPaymentStatus(input: {
  orderId: string;
  paymentId: string;
  status: PaymentStatus;
  eventKey: string;
  payload: string;
}) {
  const existing = await prisma.paymentEvent.findUnique({
    where: { eventKey: input.eventKey },
  });
  if (existing) {
    return prisma.order.findUnique({ where: { id: input.orderId } });
  }

  const order = await prisma.order.findUnique({
    where: { id: input.orderId },
    include: { items: true },
  });
  if (!order) {
    throw new Error("Заказ не найден");
  }

  await prisma.paymentEvent.create({
    data: {
      eventKey: input.eventKey,
      orderId: order.id,
      status: input.status,
      payload: input.payload,
    },
  });

  if (order.status === "paid") {
    return order;
  }

  if (input.status === "paid") {
    const updated = await prisma.order.update({
      where: { id: order.id },
      data: { status: "paid", paymentId: input.paymentId },
    });
    await enqueueAmoJobs(order.id);
    return updated;
  }

  if (input.status === "failed" && order.status === "pending") {
    await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        const session = await tx.session.findUnique({ where: { id: item.sessionId } });
        if (!session) continue;
        const spotsLeft = session.spotsLeft + item.quantity;
        await tx.session.update({
          where: { id: session.id },
          data: {
            spotsLeft,
            status: deriveSessionStatus(spotsLeft, session.status === "closed" ? "open" : session.status),
          },
        });
      }
      await tx.order.update({
        where: { id: order.id },
        data: { status: "failed", paymentId: input.paymentId },
      });
    });
  }

  return prisma.order.findUnique({ where: { id: order.id } });
}
