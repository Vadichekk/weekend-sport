"use client";

import { useCart } from "@/components/cart/cart-provider";
import { resolveMockPayment } from "@/app/(site)/pay/actions";

export function MockPayActions({ orderId, paymentId }: { orderId: string; paymentId: string }) {
  const { clear } = useCart();

  return (
    <div className="mt-8 flex flex-col gap-3">
      <form
        action={async (formData) => {
          clear();
          await resolveMockPayment(formData);
        }}
      >
        <input type="hidden" name="orderId" value={orderId} />
        <input type="hidden" name="paymentId" value={paymentId} />
        <input type="hidden" name="status" value="paid" />
        <button className="inline-flex w-full items-center justify-center rounded-full bg-clay px-5 py-3 text-sm font-semibold text-white">
          Оплатить успешно
        </button>
      </form>
      <form action={resolveMockPayment}>
        <input type="hidden" name="orderId" value={orderId} />
        <input type="hidden" name="paymentId" value={paymentId} />
        <input type="hidden" name="status" value="failed" />
        <button className="inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-forest ring-1 ring-forest/20">
          Имитировать ошибку
        </button>
      </form>
    </div>
  );
}
