import { prisma } from "@/lib/prisma";
import { AdminField } from "@/components/admin/field";
import { guardAdmin } from "../actions";
import { addHomeVisuals, removeHomeVisual } from "./actions";

const field = "w-full rounded-2xl bg-paper px-4 py-3";

export default async function AdminVisualsPage() {
  await guardAdmin();
  const media = await prisma.media.findMany({
    where: { isShared: true },
    include: { location: { select: { name: true } } },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-4xl">Визуал главной</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          Фото попадут в карусель «Живые кадры»: она сама листается каждые 5 секунд, по нажатию
          открывается крупно. Видео остаются рядом с каруселью.
        </p>
      </div>

      <form action={addHomeVisuals} className="space-y-4 rounded-[28px] bg-cream p-6">
        <h2 className="font-display text-2xl">Добавить кадры</h2>
        <AdminField label="Подпись к новым файлам">
          <input name="alt" defaultValue="Живые кадры с выезда" className={field} />
        </AdminField>
        <AdminField
          label="Фото для карусели"
          hint="Можно выбрать сразу несколько. Они появятся на главной в блоке «Живые кадры»."
        >
          <input name="photos" type="file" accept="image/*" multiple className="block" />
        </AdminField>
        <AdminField label="Видео на главную">
          <input name="video" type="file" accept="video/*" className="block" />
        </AdminField>
        <AdminField label="Или ссылка на видео">
          <input name="videoUrl" placeholder="https://" className={field} />
        </AdminField>
        <AdminField label="Постер к видео">
          <input name="poster" type="file" accept="image/*" className="block" />
        </AdminField>
        <button className="rounded-full bg-forest px-5 py-3 text-sm font-semibold text-cream">
          Добавить на главную
        </button>
      </form>

      <section className="space-y-4">
        <h2 className="font-display text-2xl">Сейчас на главной</h2>
        {!media.length ? (
          <p className="text-sm text-muted">Пока пусто. Загрузите фото выше.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {media.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-[24px] bg-paper">
                <div className="relative aspect-[16/10] bg-black/5">
                  {item.kind === "photo" ? (
                    <img src={item.url} alt={item.alt} className="h-full w-full object-cover" />
                  ) : (
                    <video
                      src={item.url}
                      poster={item.posterUrl || undefined}
                      className="h-full w-full object-cover"
                      muted
                    />
                  )}
                </div>
                <div className="space-y-2 p-4">
                  <p className="text-sm font-semibold">
                    {item.kind === "photo" ? "Фото" : "Видео"}
                  </p>
                  <p className="text-sm text-muted">
                    {item.location ? `С базы «${item.location.name}»` : "Загружено для главной"}
                  </p>
                  <form action={removeHomeVisual}>
                    <input type="hidden" name="id" value={item.id} />
                    <button className="text-sm text-red-700">
                      {item.locationId ? "Убрать с главной" : "Удалить"}
                    </button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
