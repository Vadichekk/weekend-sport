import type { Metadata } from "next";
import { Header } from "@/components/site/header";
import { CartView } from "@/components/cart/cart-view";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Корзина",
  description: "Выбранные заезды на детский спортивный уикенд.",
};

export default async function CartPage() {
  const sessions = await prisma.session.findMany({
    include: { location: true },
  });

  return (
    <main className="min-h-screen bg-bg">
      <div className="bg-forest pb-16 pt-28 text-cream">
        <Header inverted />
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h1 className="font-display text-5xl">Корзина</h1>
          <p className="mt-3 max-w-xl text-cream/70">
            Можно держать несколько заездов и баз. Имена детей спросим на оформлении.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
        <CartView
          sessions={sessions.map((session) => ({
            id: session.id,
            locationName: session.location.name,
            locationSlug: session.location.slug,
            startDate: session.startDate.toISOString(),
            endDate: session.endDate.toISOString(),
            pricePerChild: session.pricePerChild,
            spotsLeft: session.spotsLeft,
          }))}
        />
      </div>
    </main>
  );
}
