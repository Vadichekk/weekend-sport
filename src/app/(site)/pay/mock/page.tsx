import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/site/header";
import { MockPayActions } from "@/components/pay/mock-pay-actions";
import { getSettings } from "@/lib/settings";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Тестовая оплата",
  description: "Тестовый платёжный контур без реального провайдера.",
};

export default async function MockPayPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string; paymentId?: string; amount?: string; number?: string }>;
}) {
  const settings = await getSettings();
  const allow =
    settings.paymentProvider === "mock" &&
    (process.env.NODE_ENV !== "production" || process.env.ALLOW_MOCK_PAY === "true");
  if (!allow) notFound();

  const params = await searchParams;

  return (
    <main className="min-h-screen bg-bg">
      <div className="bg-forest pb-16 pt-28 text-cream">
        <Header inverted />
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-cream/50">Тестовый контур</p>
          <h1 className="mt-3 font-display text-5xl">Оплата заказа</h1>
        </div>
      </div>
      <div className="mx-auto max-w-lg px-4 py-12 md:px-6">
        <div className="rounded-[28px] bg-paper p-8">
          <p className="text-sm text-muted">Заказ {params.number}</p>
          <p className="mt-2 font-display text-4xl">{formatPrice(Number(params.amount || 0))}</p>
          <p className="mt-4 text-sm leading-6 text-muted">
            Это тестовая оплата. На боевом сайте её не будет, пока не включён настоящий провайдер.
          </p>
          {params.orderId && params.paymentId ? (
            <MockPayActions orderId={params.orderId} paymentId={params.paymentId} />
          ) : (
            <p className="mt-6 text-sm text-red-700">Нет данных заказа.</p>
          )}
        </div>
      </div>
    </main>
  );
}
