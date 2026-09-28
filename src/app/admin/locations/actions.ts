"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { saveUpload } from "@/lib/upload";
import { slugify } from "@/lib/utils";

async function ensureAdmin() {
  const session = await requireAdmin();
  if (!session) redirect("/admin/login");
}

function readLocation(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  return {
    name,
    slug: String(formData.get("slug") || slugify(name)),
    district: String(formData.get("district") || ""),
    address: String(formData.get("address") || ""),
    website: String(formData.get("website") || ""),
    shortDescription: String(formData.get("shortDescription") || ""),
    description: String(formData.get("description") || ""),
    conditions: String(formData.get("conditions") || ""),
    safety: String(formData.get("safety") || ""),
    ageMin: Number(formData.get("ageMin") || 6),
    ageMax: Number(formData.get("ageMax") || 14),
    amenities: JSON.stringify(
      String(formData.get("amenities") || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
    published: formData.get("published") === "on",
    sortOrder: Number(formData.get("sortOrder") || 0),
  };
}

export async function createLocation(formData: FormData) {
  await ensureAdmin();
  const cover = await saveUpload(formData.get("cover") as File, "photos");
  const data = readLocation(formData);
  const location = await prisma.location.create({
    data: {
      ...data,
      coverImage: cover || "/brand/cover-empty.svg",
    },
  });
  await attachMedia(location.id, formData);
  revalidatePath("/");
  redirect("/admin/locations");
}

export async function updateLocation(formData: FormData) {
  await ensureAdmin();
  const id = String(formData.get("id"));
  const cover = await saveUpload(formData.get("cover") as File, "photos");
  const data = readLocation(formData);
  await prisma.location.update({
    where: { id },
    data: {
      ...data,
      ...(cover ? { coverImage: cover } : {}),
    },
  });
  await attachMedia(id, formData);
  revalidatePath("/");
  redirect("/admin/locations");
}

async function addPhotos(locationId: string, files: File[], category: "place" | "stay", start: number) {
  for (const [index, file] of files.entries()) {
    const url = await saveUpload(file, "photos");
    if (!url) continue;
    await prisma.media.create({
      data: {
        locationId,
        kind: "photo",
        url,
        alt: category === "place" ? "Фото площадки" : "Фото с выезда",
        category,
        sortOrder: start + index,
      },
    });
  }
}

async function addVideo(
  locationId: string,
  file: File | null,
  urlField: string,
  poster: File | null,
  category: "place" | "stay",
  sortOrder: number,
) {
  const uploaded = await saveUpload(file, "videos");
  const posterUrl = await saveUpload(poster, "posters");
  const url = uploaded || urlField;
  if (!url) return;
  await prisma.media.create({
    data: {
      locationId,
      kind: "video",
      url,
      posterUrl,
      alt: category === "place" ? "Видео площадки" : "Видео с выезда",
      category,
      sortOrder,
    },
  });
}

async function attachMedia(locationId: string, formData: FormData) {
  await addPhotos(locationId, formData.getAll("placeGallery") as File[], "place", 10);
  await addPhotos(locationId, formData.getAll("stayGallery") as File[], "stay", 20);
  await addVideo(
    locationId,
    formData.get("placeVideo") as File,
    "",
    null,
    "place",
    30,
  );
  await addVideo(
    locationId,
    formData.get("stayVideo") as File,
    String(formData.get("stayVideoUrl") || "").trim(),
    formData.get("stayPoster") as File,
    "stay",
    40,
  );
}

export async function deleteLocation(formData: FormData) {
  await ensureAdmin();
  await prisma.location.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/");
  redirect("/admin/locations");
}
