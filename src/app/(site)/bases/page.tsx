import type { Metadata } from "next";
import { Header } from "@/components/site/header";
import { LocationCard } from "@/components/locations/location-card";
import { getPublishedLocations } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Базы",
  description: "Солнечный остров, Парк Сказов, Хрустальная, Баден-Баден и Пески — площадки выездного уикенда.",
};

export default async function BasesPage() {
  const locations = await getPublishedLocations();

  return (
    <main className="bg-bg">
      <div className="relative bg-forest pb-16 pt-28 text-cream">
        <Header inverted />
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-cream/50">Каталог</p>
          <h1 className="mt-3 font-display text-5xl">Базы</h1>
          <p className="mt-4 max-w-xl text-cream/70">
            Пять площадок. Смотрите описание места, наши кадры с выезда и ближайшую дату.
            Фото самой базы и фото отдыха лежат отдельно — если папка пустая, блок на сайте тоже пустой.
          </p>
        </div>
      </div>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 md:grid-cols-2 xl:grid-cols-3 md:px-6">
        {locations.map((location) => (
          <LocationCard key={location.id} {...location} />
        ))}
      </div>
    </main>
  );
}
