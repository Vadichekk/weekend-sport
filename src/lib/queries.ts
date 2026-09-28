import { prisma } from "@/lib/prisma";
import { deriveSessionStatus } from "@/lib/session-status";

export async function getPublishedLocations() {
  const locations = await prisma.location.findMany({
    where: { published: true },
    include: {
      sessions: {
        where: { published: true, endDate: { gte: new Date() } },
        orderBy: { startDate: "asc" },
      },
      media: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: { sortOrder: "asc" },
  });

  return locations.map((location) => ({
    ...location,
    sessions: location.sessions.map((session) => ({
      ...session,
      status: deriveSessionStatus(session.spotsLeft, session.status),
    })),
  }));
}

export async function getLocationBySlug(slug: string) {
  const location = await prisma.location.findFirst({
    where: { slug, published: true },
    include: {
      sessions: {
        where: { published: true, endDate: { gte: new Date() } },
        orderBy: { startDate: "asc" },
      },
      media: { orderBy: { sortOrder: "asc" } },
    },
  });
  if (!location) return null;
  return {
    ...location,
    sessions: location.sessions.map((session) => ({
      ...session,
      status: deriveSessionStatus(session.spotsLeft, session.status),
    })),
  };
}

export async function getSharedMedia() {
  return prisma.media.findMany({
    where: { isShared: true },
    orderBy: { sortOrder: "asc" },
  });
}

export function nextOpenSession<T extends { startDate: Date; pricePerChild: number; status: string }>(
  sessions: T[],
) {
  return sessions.find((session) => session.status !== "closed") ?? sessions[0] ?? null;
}
