import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/site/header";
import { Badge } from "@/components/ui/badge";
import { Gallery } from "@/components/media/gallery";
import { VideoCard } from "@/components/media/video-card";
import { CoverImage } from "@/components/media/cover-image";
import { EmptyMedia } from "@/components/media/empty-media";
import { DatePicker } from "@/components/booking/date-picker";
import { getLocationBySlug } from "@/lib/queries";
import { formatRange } from "@/lib/dates";
import { formatPrice, parseJsonArray, splitParagraphs } from "@/lib/utils";
import { nextOpenSession } from "@/lib/queries";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const location = await getLocationBySlug(slug);
  if (!location) return { title: "База" };
  return {
    title: location.name,
    description: location.shortDescription,
    openGraph: { images: [location.coverImage] },
  };
}

export default async function LocationPage({ params }: Props) {
  const { slug } = await params;
  const location = await getLocationBySlug(slug);
  if (!location) notFound();

  const placePhotos = location.media.filter((item) => item.kind === "photo" && item.category === "place");
  const stayPhotos = location.media.filter((item) => item.kind === "photo" && item.category !== "place");
  const videos = location.media.filter((item) => item.kind === "video");
  const amenities = parseJsonArray<string>(location.amenities);
  const next = nextOpenSession(location.sessions);

  return (
    <main>
      <section className="relative min-h-[70vh] bg-forest text-white">
        <CoverImage src={location.coverImage} alt={location.name} priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
        <Header inverted />
        <div className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-end px-4 pb-12 pt-28 md:px-6">
          <div className="flex flex-wrap gap-2">
            <Badge tone="sand">{location.district}</Badge>
            <Badge>
              {location.ageMin}–{location.ageMax} лет
            </Badge>
          </div>
          <h1 className="mt-4 font-display text-5xl md:text-6xl">{location.name}</h1>
          <p className="mt-4 max-w-2xl text-white/80">{location.shortDescription}</p>
          {next ? (
            <p className="mt-6 text-sm text-white/70">
              Ближайшая дата {formatRange(next.startDate, next.endDate)} · от {formatPrice(next.pricePerChild)}
            </p>
          ) : null}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.1fr_0.9fr] md:px-6">
        <div className="space-y-10">
          <div>
            <h2 className="font-display text-3xl">Что за площадка</h2>
            <div className="mt-4 space-y-4 text-base leading-7 text-muted">
              {splitParagraphs(location.description).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            {location.website ? (
              <a
                href={location.website}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block text-sm font-semibold text-forest"
              >
                Официальный сайт площадки
              </a>
            ) : null}
          </div>
          <div>
            <h2 className="font-display text-3xl">Условия</h2>
            <p className="mt-4 leading-7 text-muted">{location.conditions}</p>
          </div>
          <div>
            <h2 className="font-display text-3xl">Безопасность</h2>
            <p className="mt-4 leading-7 text-muted">{location.safety}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {amenities.map((item) => (
              <Badge key={item} tone="forest">
                {item}
              </Badge>
            ))}
          </div>
          <div>
            <h2 className="mb-4 font-display text-3xl">Как выглядит база</h2>
            {placePhotos.length ? <Gallery items={placePhotos} /> : <EmptyMedia title="Фото самой площадки" />}
          </div>
          <div>
            <h2 className="mb-4 font-display text-3xl">Как мы там проводим время</h2>
            {stayPhotos.length ? <Gallery items={stayPhotos} /> : <EmptyMedia title="Фото с наших выездов" />}
          </div>
          <div>
            <h2 className="mb-4 font-display text-3xl">Видео с выездов</h2>
            {videos.length ? (
              <div className="space-y-4">
                {videos.map((video) => (
                  <VideoCard
                    key={video.id}
                    src={video.url}
                    poster={video.posterUrl}
                    caption={video.caption}
                  />
                ))}
              </div>
            ) : (
              <EmptyMedia title="Видео с выездов" />
            )}
          </div>
        </div>
        <div className="md:sticky md:top-8 md:self-start">
          <DatePicker
            locationName={location.name}
            sessions={location.sessions.map((session) => ({
              id: session.id,
              startDate: session.startDate.toISOString(),
              endDate: session.endDate.toISOString(),
              pricePerChild: session.pricePerChild,
              spotsLeft: session.spotsLeft,
              status: session.status,
            }))}
          />
        </div>
      </section>
    </main>
  );
}
