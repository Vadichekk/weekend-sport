"use server";

import { unlink } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { saveUpload } from "@/lib/upload";

async function ensureAdmin() {
  const session = await requireAdmin();
  if (!session) redirect("/admin/login");
}

export async function addHomeVisuals(formData: FormData) {
  await ensureAdmin();
  const last = await prisma.media.findFirst({
    where: { isShared: true },
    orderBy: { sortOrder: "desc" },
  });
  let sortOrder = (last?.sortOrder ?? 0) + 1;
  const alt = String(formData.get("alt") || "Живые кадры с выезда").trim() || "Живые кадры с выезда";

  const photos = (formData.getAll("photos") as File[]).slice(0, 20);
  for (const file of photos) {
    const url = await saveUpload(file, "photos");
    if (!url) continue;
    await prisma.media.create({
      data: {
        kind: "photo",
        url,
        alt,
        caption: alt,
        category: "home",
        isShared: true,
        sortOrder,
      },
    });
    sortOrder += 1;
  }

  const videoUrl =
    (await saveUpload(formData.get("video") as File, "videos")) ||
    String(formData.get("videoUrl") || "").trim();
  if (videoUrl) {
    const posterUrl = await saveUpload(formData.get("poster") as File, "posters");
    await prisma.media.create({
      data: {
        kind: "video",
        url: videoUrl,
        posterUrl,
        alt,
        caption: alt,
        category: "home",
        isShared: true,
        sortOrder,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/visuals");
  redirect("/admin/visuals");
}

export async function removeHomeVisual(formData: FormData) {
  await ensureAdmin();
  const id = String(formData.get("id") || "");
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) redirect("/admin/visuals");

  if (media.locationId) {
    await prisma.media.update({ where: { id }, data: { isShared: false } });
  } else {
    await prisma.media.delete({ where: { id } });
    await deleteUpload(media.url);
    if (media.posterUrl) await deleteUpload(media.posterUrl);
  }

  revalidatePath("/");
  revalidatePath("/admin/visuals");
  redirect("/admin/visuals");
}

async function deleteUpload(url: string) {
  if (!url.startsWith("/uploads/")) return;
  const file = path.join(process.cwd(), "public", url);
  await unlink(file).catch(() => undefined);
}
