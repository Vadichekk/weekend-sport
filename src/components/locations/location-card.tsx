import Link from "next/link";
import { formatRange } from "@/lib/dates";
import { formatPrice } from "@/lib/utils";
import { nextOpenSession } from "@/lib/queries";
import { Badge } from "@/components/ui/badge";
import { CoverImage } from "@/components/media/cover-image";

type LocationCardProps = {
  slug: string;
  name: string;
  district: string;
  shortDescription: string;
  coverImage: string;
  ageMin: number;
  ageMax: number;
  sessions: { startDate: Date; endDate: Date; pricePerChild: number; status: string }[];
};

export function LocationCard(location: LocationCardProps) {
  const next = nextOpenSession(location.sessions);

  return (
    <Link
      href={`/bases/${location.slug}`}
      className="group overflow-hidden rounded-[28px] bg-paper shadow-[var(--shadow)] ring-1 ring-black/5"
    >
      <div className="relative aspect-[5/4] overflow-hidden">
        <CoverImage
          src={location.coverImage}
          alt={location.name}
          className="transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <p className="font-display text-3xl">{location.name}</p>
          <p className="mt-1 text-sm text-white/80">{location.district}</p>
        </div>
      </div>
      <div className="space-y-4 p-5">
        <p className="text-sm leading-6 text-muted">{location.shortDescription}</p>
        <div className="flex flex-wrap gap-2">
          <Badge>
            {location.ageMin}–{location.ageMax} лет
          </Badge>
          {next ? (
            <Badge tone="clay">{formatRange(next.startDate, next.endDate)}</Badge>
          ) : (
            <Badge tone="sand">дат пока нет</Badge>
          )}
        </div>
        <div className="flex items-end justify-between">
          <p className="text-sm text-muted">
            {next ? (
              <>
                от <span className="text-lg font-semibold text-ink">{formatPrice(next.pricePerChild)}</span>
              </>
            ) : (
              "цену уточним"
            )}
          </p>
          <span className="text-sm font-semibold text-forest">Смотреть базу →</span>
        </div>
      </div>
    </Link>
  );
}
