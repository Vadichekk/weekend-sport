import Link from "next/link";
import { getSettings } from "@/lib/settings";

export async function Footer() {
  const settings = await getSettings();

  return (
    <footer className="border-t border-line bg-forest text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4 md:px-6">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <img src="/brand/logo.png" alt="" width={48} height={48} className="h-12 w-12 rounded-full" />
            <p className="font-display text-3xl">Уикенд</p>
          </div>
          <p className="mt-3 max-w-md text-sm leading-6 text-cream/75">
            Выездной детский спортивный уикенд. Берём группу на проверенную базу, проводим
            программу и возвращаем уставших. Площадки — настоящие: остров, сказы, термы, Шарташ.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-cream/50">Разделы</p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <Link href="/bases">Каталог баз</Link>
            <Link href="/account">Кабинет родителя</Link>
            <Link href="/privacy">Политика ПДн</Link>
            <Link href="/admin">Админка</Link>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-cream/50">Контакты</p>
          <div className="mt-4 space-y-2 text-sm text-cream/80">
            <p>{settings.contactPhone}</p>
            <p>{settings.contactEmail}</p>
            <p>{settings.contactAddress}</p>
            <p className="text-cream/50">Заглушки. Замените в админке.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
