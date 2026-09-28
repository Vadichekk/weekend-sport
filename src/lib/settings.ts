import { prisma } from "@/lib/prisma";

export type AppSettings = {
  paymentProvider: "mock" | "yookassa" | "tkassa" | "cloudpayments";
  paymentShopId: string;
  paymentSecretKey: string;
  paymentWebhookSecret: string;
  amoDomain: string;
  amoAccessToken: string;
  amoPipelineName: string;
  amoEnabled: boolean;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
};

const DEFAULTS: AppSettings = {
  paymentProvider: (process.env.PAYMENT_PROVIDER as AppSettings["paymentProvider"]) || "mock",
  paymentShopId: process.env.PAYMENT_SHOP_ID || "",
  paymentSecretKey: process.env.PAYMENT_SECRET_KEY || "",
  paymentWebhookSecret: process.env.PAYMENT_WEBHOOK_SECRET || "",
  amoDomain: process.env.AMO_DOMAIN || "recordekb.amocrm.ru",
  amoAccessToken: process.env.AMO_ACCESS_TOKEN || "",
  amoPipelineName: process.env.AMO_PIPELINE_NAME || "СПОРТИВНЫЕ СЕКЦИИ",
  amoEnabled: process.env.AMO_ENABLED === "true",
  contactPhone: "+7 (343) 000-00-00",
  contactEmail: "hello@weekend.local",
  contactAddress: "Екатеринбург",
};

export async function getSettings(): Promise<AppSettings> {
  const rows = await prisma.setting.findMany();
  const map = Object.fromEntries(rows.map((row) => [row.key, row.value]));
  return {
    paymentProvider:
      (map.paymentProvider as AppSettings["paymentProvider"]) || DEFAULTS.paymentProvider,
    paymentShopId: map.paymentShopId ?? DEFAULTS.paymentShopId,
    paymentSecretKey: map.paymentSecretKey ?? DEFAULTS.paymentSecretKey,
    paymentWebhookSecret: map.paymentWebhookSecret ?? DEFAULTS.paymentWebhookSecret,
    amoDomain: map.amoDomain ?? DEFAULTS.amoDomain,
    amoAccessToken: map.amoAccessToken ?? DEFAULTS.amoAccessToken,
    amoPipelineName: map.amoPipelineName ?? DEFAULTS.amoPipelineName,
    amoEnabled: (map.amoEnabled ?? String(DEFAULTS.amoEnabled)) === "true",
    contactPhone: map.contactPhone ?? DEFAULTS.contactPhone,
    contactEmail: map.contactEmail ?? DEFAULTS.contactEmail,
    contactAddress: map.contactAddress ?? DEFAULTS.contactAddress,
  };
}

export async function saveSettings(next: Partial<AppSettings>) {
  const entries = Object.entries(next).filter(([, value]) => value !== undefined);
  for (const [key, value] of entries) {
    await prisma.setting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    });
  }
}
