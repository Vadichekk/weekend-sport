import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { loginAdmin } from "../actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  if (session?.role === "admin") redirect("/admin");

  const { error } = await searchParams;
  const showHint = process.env.NODE_ENV !== "production";

  return (
    <main className="grid min-h-screen place-items-center bg-forest px-4 text-cream">
      <form action={loginAdmin} className="w-full max-w-md space-y-4 rounded-[28px] bg-paper p-8 text-ink">
        <h1 className="font-display text-3xl">Админка</h1>
        <p className="text-sm leading-6 text-muted">
          Служебный вход, не кабинет родителя.
          {showHint ? (
            <>
              <br />
              Локально: <span className="font-semibold text-ink">admin@weekend.local</span>
              <br />
              пароль <span className="font-semibold text-ink">admin1234</span>
            </>
          ) : null}
        </p>
        {error === "rate" ? (
          <p className="text-sm text-red-700">Слишком много попыток. Подождите 15 минут.</p>
        ) : null}
        {error === "1" ? <p className="text-sm text-red-700">Неверный логин или пароль.</p> : null}
        <label className="block text-sm font-semibold">
          Email
          <input
            required
            name="email"
            type="email"
            autoComplete="username"
            defaultValue={showHint ? "admin@weekend.local" : ""}
            className="mt-2 w-full rounded-2xl bg-cream px-4 py-3 font-normal"
          />
        </label>
        <label className="block text-sm font-semibold">
          Пароль
          <input
            required
            name="password"
            type="password"
            autoComplete="current-password"
            className="mt-2 w-full rounded-2xl bg-cream px-4 py-3 font-normal"
          />
        </label>
        <button className="w-full rounded-full bg-forest py-3 text-cream">Войти в админку</button>
      </form>
    </main>
  );
}
