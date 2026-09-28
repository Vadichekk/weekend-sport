import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LocationForm } from "@/components/admin/location-form";
import { guardAdmin } from "../../actions";
import { deleteLocation } from "../actions";

export default async function EditLocationPage({ params }: { params: Promise<{ id: string }> }) {
  await guardAdmin();
  const { id } = await params;
  const location = await prisma.location.findUnique({
    where: { id },
    include: { media: true },
  });
  if (!location) notFound();

  return (
    <div className="space-y-8">
      <h1 className="font-display text-4xl">{location.name}</h1>
      <LocationForm location={location} />
      <div className="rounded-2xl bg-paper p-5 text-sm text-muted">
        Медиа: {location.media.length} файлов. Новые фото и видео добавятся к уже существующим.
      </div>
      <form action={deleteLocation}>
        <input type="hidden" name="id" value={location.id} />
        <button className="text-sm text-red-700">Удалить базу</button>
      </form>
    </div>
  );
}
