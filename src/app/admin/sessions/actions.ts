"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { deriveSessionStatus } from "@/lib/session-status";

async function ensureAdmin() {
  if (!(await requireAdmin())) redirect("/admin/login");
}

export async function upsertSession(formData: FormData) {
  await ensureAdmin();
  const id = String(formData.get("id") || "");
  const capacity = Number(formData.get("capacity") || 20);
  const spotsLeft = Number(formData.get("spotsLeft") || capacity);
  const status = deriveSessionStatus(spotsLeft, String(formData.get("status") || "open"));
  const data = {
    locationId: String(formData.get("locationId")),
    startDate: new Date(String(formData.get("startDate"))),
    endDate: new Date(String(formData.get("endDate"))),
    pricePerChild: Number(formData.get("pricePerChild")),
    capacity,
    spotsLeft,
    status,
    published: formData.get("published") === "on",
  };

  if (id) {
    await prisma.session.update({ where: { id }, data });
  } else {
    await prisma.session.create({ data });
  }
  revalidatePath("/bases");
  redirect("/admin/sessions");
}

export async function deleteSession(formData: FormData) {
  await ensureAdmin();
  await prisma.session.delete({ where: { id: String(formData.get("id")) } });
  redirect("/admin/sessions");
}
