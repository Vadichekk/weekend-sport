import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { appUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = appUrl();
  const locations = await prisma.location.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/bases`, lastModified: new Date() },
    { url: `${base}/privacy`, lastModified: new Date() },
    ...locations.map((location) => ({
      url: `${base}/bases/${location.slug}`,
      lastModified: location.updatedAt,
    })),
  ];
}
