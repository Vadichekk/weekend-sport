"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getSettings, saveSettings } from "@/lib/settings";

function keep(current: string, next: string) {
  const value = next.trim();
  return value || current;
}

export async function updateSettings(formData: FormData) {
  if (!(await requireAdmin())) redirect("/admin/login");
  const current = await getSettings();
  await saveSettings({
    paymentProvider: String(formData.get("paymentProvider") || "mock") as
      | "mock"
      | "yookassa"
      | "tkassa"
      | "cloudpayments",
    paymentShopId: String(formData.get("paymentShopId") || ""),
    paymentSecretKey: keep(current.paymentSecretKey, String(formData.get("paymentSecretKey") || "")),
    paymentWebhookSecret: keep(
      current.paymentWebhookSecret,
      String(formData.get("paymentWebhookSecret") || ""),
    ),
    amoDomain: String(formData.get("amoDomain") || ""),
    amoAccessToken: keep(current.amoAccessToken, String(formData.get("amoAccessToken") || "")),
    amoPipelineName: String(formData.get("amoPipelineName") || "СПОРТИВНЫЕ СЕКЦИИ"),
    amoEnabled: formData.get("amoEnabled") === "on",
    contactPhone: String(formData.get("contactPhone") || ""),
    contactEmail: String(formData.get("contactEmail") || ""),
    contactAddress: String(formData.get("contactAddress") || ""),
  });
  redirect("/admin/settings");
}
