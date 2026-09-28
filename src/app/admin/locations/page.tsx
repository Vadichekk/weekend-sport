import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { guardAdmin } from "../actions";

export default async function AdminLocationsPage() {
  await guardAdmin();
  const locations = await prisma.location.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl">Базы</h1>
        <Link href="/admin/locations/new" className="rounded-full bg-clay px-4 py-2 text-sm font-semibold text-white">
          Добавить базу
        </Link>
      </div>
      <div className="mt-8 space-y-3">
        {locations.map((location) => (
          <Link
            key={location.id}
            href={`/admin/locations/${location.id}`}
            className="flex items-center justify-between rounded-2xl bg-paper px-5 py-4"
          >
            <div>
              <p className="font-semibold">{location.name}</p>
              <p className="text-sm text-muted">{location.district}</p>
            </div>
            <span className="text-xs text-muted">{location.published ? "опубликована" : "черновик"}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
