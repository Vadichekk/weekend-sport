import type { Metadata } from "next";
import { Header } from "@/components/site/header";

export const metadata: Metadata = {
  title: "Политика обработки персональных данных",
  description: "Заглушка политики обработки персональных данных.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-bg">
      <div className="bg-forest pb-16 pt-28 text-cream">
        <Header inverted />
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h1 className="font-display text-4xl md:text-5xl">Политика обработки персональных данных</h1>
        </div>
      </div>
      <article className="mx-auto max-w-3xl space-y-4 px-4 py-12 text-sm leading-7 text-muted md:px-6">
        <p>Это заглушка. Перед запуском с реальной оплатой замените текст на юридически выверенный.</p>
        <p>
          Оператор обрабатывает ФИО родителя, телефон, адрес электронной почты, имена и возраст
          детей исключительно для записи на заезд, связи и передачи заказа в CRM.
        </p>
        <p>
          Согласие даётся на странице оформления. Отозвать его можно по контакту, указанному в
          подвале сайта.
        </p>
        <p>Платёжные реквизиты карты сайт не хранит — их принимает выбранный платёжный провайдер.</p>
      </article>
    </main>
  );
}
