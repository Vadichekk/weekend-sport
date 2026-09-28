"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { clearSession, createSession, requireAdmin, verifyLogin } from "@/lib/auth";
import { clientIpFromHeaders, limited } from "@/lib/rate-limit";

export async function loginAdmin(formData: FormData) {
  const ip = clientIpFromHeaders(await headers());
  if (limited(`admin-login:${ip}`, 5, 15 * 60_000)) {
    redirect("/admin/login?error=rate");
  }

  const email = String(formData.get("email") || "").toLowerCase().trim();
  const password = String(formData.get("password") || "");
  if (process.env.NODE_ENV === "production" && email === "admin@weekend.local" && password === "admin1234") {
    redirect("/admin/login?error=1");
  }

  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!(await verifyLogin(password, admin?.passwordHash))) {
    redirect("/admin/login?error=1");
  }
  await createSession({ role: "admin", email: admin!.email });
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearSession();
  redirect("/admin/login");
}

export async function guardAdmin() {
  const session = await requireAdmin();
  if (!session) redirect("/admin/login");
  return session;
}
