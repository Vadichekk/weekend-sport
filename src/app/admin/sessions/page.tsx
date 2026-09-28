import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatRange } from "@/lib/dates";
import { formatPrice } from "@/lib/utils";
import { sessionStatusLabel } from "@/lib/session-status";
import { guardAdmin } from "../actions";

export default async function AdminSessionsPage() {
  await guardAdmin();
  const sessions = await prisma.session.findMany({
    include: { location: true },
    orderBy: { startDate: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl">Заезды</h1>
        <Link href="/admin/sessions/new" className="rounded-full bg-clay px-4 py-2 text-sm font-semibold text-white">
          Новый заезд
        </Link>
      </div>
      <div className="mt-8 space-y-3">
        {sessions.map((session) => (
          <Link
            key={session.id}
            href={`/admin/sessions/${session.id}`}
            className="flex items-center justify-between rounded-2xl bg-paper px-5 py-4"
          >
            <div>
              <p className="font-semibold">{session.location.name}</p>
              <p className="text-sm text-muted">{formatRange(session.startDate, session.endDate)}</p>
            </div>
            <p className="text-sm">
              {formatPrice(session.pricePerChild)} · {session.spotsLeft}/{session.capacity} ·{" "}
              {sessionStatusLabel(session.status)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
