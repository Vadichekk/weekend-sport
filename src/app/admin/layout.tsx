import Link from "next/link";
import { getSession } from "@/lib/auth";
import { logoutAdmin } from "./actions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const isAdmin = session?.role === "admin";

  if (!isAdmin) {
    return children;
  }

  return (
    <div className="min-h-screen bg-bg">
      <aside className="border-b border-line bg-forest text-cream md:fixed md:inset-y-0 md:w-64 md:border-b-0 md:border-r md:border-white/10">
        <div className="p-6">
          <p className="font-display text-2xl">Уикенд</p>
          <p className="text-xs text-cream/60">Админка</p>
        </div>
        <nav className="flex flex-col gap-1 px-3 pb-6 text-sm">
          <Link className="rounded-xl px-3 py-2 hover:bg-white/10" href="/admin">
            Сводка
          </Link>
          <Link className="rounded-xl px-3 py-2 hover:bg-white/10" href="/admin/visuals">
            Визуал
          </Link>
          <Link className="rounded-xl px-3 py-2 hover:bg-white/10" href="/admin/locations">
            Базы
          </Link>
          <Link className="rounded-xl px-3 py-2 hover:bg-white/10" href="/admin/sessions">
            Заезды
          </Link>
          <Link className="rounded-xl px-3 py-2 hover:bg-white/10" href="/admin/orders">
            Заказы
          </Link>
          <Link className="rounded-xl px-3 py-2 hover:bg-white/10" href="/admin/settings">
            Настройки
          </Link>
          <Link className="rounded-xl px-3 py-2 hover:bg-white/10" href="/">
            На сайт
          </Link>
          <form action={logoutAdmin}>
            <button className="rounded-xl px-3 py-2 text-cream/70">Выйти</button>
          </form>
        </nav>
      </aside>
      <div className="md:pl-64">
        <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">{children}</div>
      </div>
    </div>
  );
}
