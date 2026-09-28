import { NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments";
import { YooKassaProvider } from "@/lib/payments/yookassa";
import { applyPaymentStatus } from "@/lib/orders";
import { safeEqual } from "@/lib/crypto";

export async function POST(request: Request) {
  const rawBody = await request.text();
  if (rawBody.length > 50_000) {
    return NextResponse.json({ ok: false }, { status: 413 });
  }

  const provider = await getPaymentProvider();

  if (provider.name === "mock") {
    const secret = process.env.AUTH_SECRET || "";
    const given = request.headers.get("x-webhook-secret") || "";
    if (!secret || !safeEqual(secret, given)) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
  }

  try {
    const event = await provider.parseWebhook(rawBody, request.headers);
    if (!event.orderId || !event.paymentId) {
      return NextResponse.json({ ok: false, error: "no order" }, { status: 400 });
    }
    if (event.status === "paid" && provider instanceof YooKassaProvider) {
      const confirmed = await provider.getStatus(event.paymentId);
      const sameOrder = await provider.belongsToOrder(event.paymentId, event.orderId);
      if (confirmed !== "paid" || !sameOrder) {
        return NextResponse.json({ ok: false, error: "unconfirmed" }, { status: 400 });
      }
    }
    await applyPaymentStatus({
      orderId: event.orderId,
      paymentId: event.paymentId,
      status: event.status,
      eventKey: event.eventKey,
      payload: rawBody.slice(0, 8000),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
