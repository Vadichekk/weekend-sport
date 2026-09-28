import type { Metadata } from "next";
import { Header } from "@/components/site/header";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Оформление",
  description: "Оформление заезда на детский спортивный уикенд.",
};

const errors: Record<string, string> = {
  validation: "Проверьте ФИО, телефон, пароль и согласие на ПДн.",
  phone: "Телефон должен быть российским: +7 и 10 цифр.",
  children: "Укажите имя и возраст каждого ребёнка.",
  password: "Этот телефон уже есть. Введите пароль от кабинета.",
  spots: "На один из заездов уже не хватает мест.",
  cart: "Корзина повреждена, соберите заказ заново.",
  unknown: "Не получилось создать заказ. Попробуйте ещё раз.",
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const sessions = await prisma.session.findMany({
    include: { location: true },
  });

  return (
    <main className="min-h-screen bg-bg">
      <div className="bg-forest pb-16 pt-28 text-cream">
        <Header inverted />
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h1 className="font-display text-5xl">Оформление</h1>
          <p className="mt-3 max-w-xl text-cream/70">
            Телефон станет логином в кабинете. После оплаты заказ появится там со статусом.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
        {error && errors[error] ? (
          <p className="mb-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800">{errors[error]}</p>
        ) : null}
        <CheckoutForm
          sessions={sessions.map((session) => ({
            id: session.id,
            locationName: session.location.name,
            startDate: session.startDate.toISOString(),
            endDate: session.endDate.toISOString(),
            pricePerChild: session.pricePerChild,
          }))}
        />
      </div>
    </main>
  );
}
