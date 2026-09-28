import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/site/header";
import { PhoneField } from "@/components/forms/phone-field";
import { loginParent } from "../actions";

export const metadata: Metadata = {
  title: "Вход в кабинет родителя",
  description: "Кабинет родителя: заказы и статусы оплаты.",
};

export default async function AccountLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="min-h-screen bg-bg">
      <div className="bg-forest pb-16 pt-28 text-cream">
        <Header inverted />
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h1 className="font-display text-5xl">Кабинет родителя</h1>
          <p className="mt-3 max-w-xl text-cream/70">
            Здесь не регистрируются заранее. Сначала оформляете заказ — телефон и пароль с
            той формы и есть вход.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-md space-y-6 px-4 py-12">
        <div className="rounded-[24px] bg-paper px-5 py-4 text-sm leading-6 text-muted">
          <p>1. Выберите базу и дату, положите в корзину.</p>
          <p>2. На оформлении укажите телефон и придумайте пароль.</p>
          <p>3. После оплаты вернитесь сюда: телефон + пароль → ваши заказы.</p>
        </div>
        <form action={loginParent} className="space-y-4">
          {error ? (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800">
              Неверный телефон или пароль. Если заказа ещё не было — сначала оформите его.
            </p>
          ) : null}
          <PhoneField name="phone" />
          <label className="block text-sm">
            Пароль, который задали на оформлении
            <input
              required
              name="password"
              type="password"
              className="mt-2 w-full rounded-2xl bg-paper px-4 py-3 ring-1 ring-black/5"
            />
          </label>
          <button className="w-full rounded-full bg-clay py-3 font-semibold text-white">Войти</button>
        </form>
        <p className="text-center text-sm text-muted">
          Заказа ещё нет?{" "}
          <Link href="/bases" className="font-semibold text-forest">
            Выбрать базу
          </Link>
        </p>
      </div>
    </main>
  );
}
