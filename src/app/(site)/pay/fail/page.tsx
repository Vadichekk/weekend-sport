import type { Metadata } from "next";
import { Header } from "@/components/site/header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Оплата не прошла",
  description: "Платёж за спортивный уикенд не завершился.",
};

export default function FailPage() {
  return (
    <main className="min-h-screen bg-bg">
      <div className="bg-forest pb-16 pt-28 text-cream">
        <Header inverted />
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h1 className="font-display text-5xl">Оплата не прошла</h1>
        </div>
      </div>
      <div className="mx-auto max-w-lg px-4 py-12 md:px-6">
        <div className="rounded-[28px] bg-paper p-8">
          <p className="text-muted">
            Места вернулись в продажу. Можно попробовать ещё раз или выбрать другую дату.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Button href="/cart">Вернуться в корзину</Button>
            <Button href="/bases" variant="line">
              К базам
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
