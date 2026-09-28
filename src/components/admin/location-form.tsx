import { createLocation, updateLocation } from "@/app/admin/locations/actions";
import { AdminField } from "@/components/admin/field";
import { parseJsonArray } from "@/lib/utils";

type LocationValue = {
  id?: string;
  name: string;
  slug: string;
  district: string;
  address: string;
  website?: string;
  shortDescription: string;
  description: string;
  conditions: string;
  safety: string;
  ageMin: number;
  ageMax: number;
  amenities: string;
  published: boolean;
  sortOrder: number;
  coverImage?: string;
};

const field = "w-full rounded-2xl bg-paper px-4 py-3";

export function LocationForm({ location }: { location?: LocationValue }) {
  const action = location?.id ? updateLocation : createLocation;
  const amenities = location ? parseJsonArray<string>(location.amenities).join(", ") : "";

  return (
    <form action={action} className="space-y-8">
      {location?.id ? <input type="hidden" name="id" value={location.id} /> : null}

      <section className="space-y-4">
        <h2 className="font-display text-2xl">О площадке</h2>
        <AdminField label="Название">
          <input name="name" required defaultValue={location?.name} className={field} />
        </AdminField>
        <AdminField
          label="Адрес страницы"
          hint="Можно оставить пустым — подставится сам из названия."
        >
          <input name="slug" defaultValue={location?.slug} className={field} />
        </AdminField>
        <AdminField label="Район / как добраться">
          <input name="district" required defaultValue={location?.district} className={field} />
        </AdminField>
        <AdminField label="Адрес">
          <input name="address" required defaultValue={location?.address} className={field} />
        </AdminField>
        <AdminField label="Официальный сайт площадки">
          <input
            name="website"
            defaultValue={location?.website}
            placeholder="https://"
            className={field}
          />
        </AdminField>
        <AdminField label="Коротко для карточки">
          <textarea
            name="shortDescription"
            required
            defaultValue={location?.shortDescription}
            className={`min-h-24 ${field}`}
          />
        </AdminField>
        <AdminField label="Описание">
          <textarea
            name="description"
            required
            defaultValue={location?.description}
            className={`min-h-40 ${field}`}
          />
        </AdminField>
        <AdminField label="Условия заезда">
          <textarea
            name="conditions"
            required
            defaultValue={location?.conditions}
            className={`min-h-24 ${field}`}
          />
        </AdminField>
        <AdminField label="Безопасность">
          <textarea
            name="safety"
            required
            defaultValue={location?.safety}
            className={`min-h-24 ${field}`}
          />
        </AdminField>
        <AdminField
          label="Удобства"
          hint="Через запятую, например: Бассейн, Wi‑Fi, питание"
        >
          <input name="amenities" defaultValue={amenities} className={field} />
        </AdminField>
        <div className="grid gap-4 md:grid-cols-3">
          <AdminField label="Возраст от, лет">
            <input
              name="ageMin"
              type="number"
              defaultValue={location?.ageMin ?? 6}
              className={field}
            />
          </AdminField>
          <AdminField label="Возраст до, лет">
            <input
              name="ageMax"
              type="number"
              defaultValue={location?.ageMax ?? 14}
              className={field}
            />
          </AdminField>
          <AdminField label="Порядок в каталоге" hint="Меньше число — выше в списке">
            <input
              name="sortOrder"
              type="number"
              defaultValue={location?.sortOrder ?? 10}
              className={field}
            />
          </AdminField>
        </div>
        <AdminField label="Обложка карточки">
          <input name="cover" type="file" accept="image/*" className="block" />
        </AdminField>
      </section>

      <section className="space-y-4 rounded-[24px] bg-cream p-5">
        <h2 className="font-display text-2xl">Как выглядит база</h2>
        <p className="text-sm text-muted">
          Фото самой площадки: корпуса, двор, бассейн. Попадут в блок «Как выглядит база» на сайте.
        </p>
        <AdminField label="Фото площадки">
          <input name="placeGallery" type="file" accept="image/*" multiple className="block" />
        </AdminField>
        <AdminField label="Видео площадки">
          <input name="placeVideo" type="file" accept="video/*" className="block" />
        </AdminField>
      </section>

      <section className="space-y-4 rounded-[24px] bg-cream p-5">
        <h2 className="font-display text-2xl">Как мы там отдыхаем</h2>
        <p className="text-sm text-muted">
          Наши кадры с выезда: дети, станции, грамоты. Попадут в блоки «Как мы проводим время» и
          «Видео».
        </p>
        <AdminField label="Фото с выезда">
          <input name="stayGallery" type="file" accept="image/*" multiple className="block" />
        </AdminField>
        <AdminField label="Видео с выезда">
          <input name="stayVideo" type="file" accept="video/*" className="block" />
        </AdminField>
        <AdminField label="Или ссылка на видео">
          <input name="stayVideoUrl" placeholder="https://" className={field} />
        </AdminField>
        <AdminField label="Постер к видео с выезда">
          <input name="stayPoster" type="file" accept="image/*" className="block" />
        </AdminField>
      </section>

      <label className="flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" name="published" defaultChecked={location?.published ?? true} />
        Показать базу на сайте
      </label>
      <button className="rounded-full bg-forest px-5 py-3 text-sm font-semibold text-cream">
        Сохранить
      </button>
    </form>
  );
}
