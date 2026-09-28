"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { clearSession, createSession, verifyLogin } from "@/lib/auth";
import { clientIpFromHeaders, limited } from "@/lib/rate-limit";
import { isValidRuPhone, normalizePhone } from "@/lib/utils";

export async function loginParent(formData: FormData) {
  const ip = clientIpFromHeaders(await headers());
  if (limited(`parent-login:${ip}`, 8, 15 * 60_000)) {
    redirect("/account/login?error=1");
  }

  const raw = String(formData.get("phone") || "");
  if (!isValidRuPhone(raw)) {
    redirect("/account/login?error=1");
  }
  const phone = normalizePhone(raw);
  const password = String(formData.get("password") || "");
  const parent = await prisma.parent.findUnique({ where: { phone } });
  if (!(await verifyLogin(password, parent?.passwordHash))) {
    redirect("/account/login?error=1");
  }
  await createSession({
    role: "parent",
    parentId: parent!.id,
    name: parent!.name,
    phone: parent!.phone,
  });
  redirect("/account");
}

export async function logoutParent() {
  await clearSession();
  redirect("/");
}
