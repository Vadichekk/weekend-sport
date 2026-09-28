"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { applyPaymentStatus } from "@/lib/orders";
import { getSettings } from "@/lib/settings";

export async function resolveMockPayment(formData: FormData) {
  const settings = await getSettings();
  const allowMock = settings.paymentProvider === "mock" && process.env.ALLOW_MOCK_PAY !== "false";
  const demoPay = process.env.ALLOW_MOCK_PAY === "true" || Boolean(process.env.VERCEL);
  if (process.env.NODE_ENV === "production" && !demoPay) {
    redirect("/pay/fail");
  }
  if (!allowMock) {
    redirect("/pay/fail");
  }

  const orderId = String(formData.get("orderId") || "");
  const paymentId = String(formData.get("paymentId") || "");
  const status = String(formData.get("status")) === "failed" ? "failed" : "paid";
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.paymentId !== paymentId) {
    redirect("/pay/fail");
  }

  await applyPaymentStatus({
    orderId,
    paymentId,
    status,
    eventKey: `${paymentId}:${status}:${Date.now()}`,
    payload: JSON.stringify({ source: "mock-page", status }),
  });

  redirect(status === "paid" ? `/pay/success?order=${orderId}` : `/pay/fail?order=${orderId}`);
}
