import { upsertSession } from "@/app/admin/sessions/actions";
import { AdminField } from "@/components/admin/field";

type Props = {
  locations: { id: string; name: string }[];
  session?: {
    id: string;
    locationId: string;
    startDate: Date;
    endDate: Date;
    pricePerChild: number;
    capacity: number;
    spotsLeft: number;
    status: string;
    published: boolean;
  };
};

const field = "w-full rounded-2xl bg-paper px-4 py-3";

function dt(value: Date) {
  const iso = new Date(value.getTime() - value.getTimezoneOffset() * 60000).toISOString();
  return iso.slice(0, 16);
}

export function SessionForm({ locations, session }: Props) {
  return (
    <form action={upsertSession} className="space-y-4">
      {session ? <input type="hidden" name="id" value={session.id} /> : null}
      <AdminField label="База">
        <select name="locationId" defaultValue={session?.locationId} className={field}>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
      </AdminField>
      <div className="grid gap-4 md:grid-cols-2">
        <AdminField label="Начало заезда">
          <input
            name="startDate"
            type="datetime-local"
            required
            defaultValue={session ? dt(session.startDate) : ""}
            className={field}
          />
        </AdminField>
        <AdminField label="Конец заезда">
          <input
            name="endDate"
            type="datetime-local"
            required
            defaultValue={session ? dt(session.endDate) : ""}
            className={field}
          />
        </AdminField>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <AdminField label="Цена за ребёнка, ₽">
          <input
            name="pricePerChild"
            type="number"
            required
            defaultValue={session?.pricePerChild ?? 7500}
            className={field}
          />
        </AdminField>
        <AdminField label="Всего мест">
          <input
            name="capacity"
            type="number"
            required
            defaultValue={session?.capacity ?? 20}
            className={field}
          />
        </AdminField>
        <AdminField label="Осталось мест">
          <input
            name="spotsLeft"
            type="number"
            required
            defaultValue={session?.spotsLeft ?? 20}
            className={field}
          />
        </AdminField>
      </div>
      <AdminField label="Статус">
        <select name="status" defaultValue={session?.status ?? "open"} className={field}>
          <option value="open">Открыт</option>
          <option value="few">Мало мест</option>
          <option value="closed">Закрыт</option>
        </select>
      </AdminField>
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" name="published" defaultChecked={session?.published ?? true} />
        Показывать на сайте
      </label>
      <button className="rounded-full bg-forest px-5 py-3 text-sm font-semibold text-cream">
        Сохранить заезд
      </button>
    </form>
  );
}
