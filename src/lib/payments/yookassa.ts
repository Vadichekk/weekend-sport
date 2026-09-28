import type { AppSettings } from "@/lib/settings";
import type { CreatePaymentInput, PaymentProvider, PaymentStatus, WebhookResult } from "./types";

export class YooKassaProvider implements PaymentProvider {
  name = "yookassa";

  constructor(private settings: AppSettings) {}

  async createPayment(input: CreatePaymentInput) {
    if (!this.settings.paymentShopId || !this.settings.paymentSecretKey) {
      throw new Error("ЮKassa: заполните shopId и секретный ключ в настройках админки");
    }

    const auth = Buffer.from(
      `${this.settings.paymentShopId}:${this.settings.paymentSecretKey}`,
    ).toString("base64");

    const response = await fetch("https://api.yookassa.ru/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Idempotence-Key": input.orderId,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: { value: input.amount.toFixed(2), currency: "RUB" },
        capture: true,
        confirmation: { type: "redirect", return_url: input.returnUrl },
        description: input.description,
        metadata: { orderId: input.orderId, ...input.metadata },
      }),
    });

    if (!response.ok) {
      throw new Error(`ЮKassa: не удалось создать платёж (${response.status})`);
    }

    const data = (await response.json()) as {
      id: string;
      confirmation?: { confirmation_url?: string };
    };

    return {
      paymentId: data.id,
      confirmationUrl: data.confirmation?.confirmation_url || input.returnUrl,
      provider: this.name,
    };
  }

  async parseWebhook(rawBody: string): Promise<WebhookResult> {
    const data = JSON.parse(rawBody) as {
      event?: string;
      object?: { id?: string; status?: string; metadata?: { orderId?: string } };
    };
    const paymentId = data.object?.id || "unknown";
    const orderId = data.object?.metadata?.orderId || "";
    const remote = data.object?.status;
    const status: PaymentStatus =
      remote === "succeeded" ? "paid" : remote === "canceled" ? "failed" : "pending";
    return {
      eventKey: `${paymentId}:${data.event || remote || "unknown"}`,
      paymentId,
      orderId,
      status,
    };
  }

  async getStatus(paymentId: string): Promise<PaymentStatus> {
    const data = await this.fetchPayment(paymentId);
    if (!data) return "pending";
    if (data.status === "succeeded") return "paid";
    if (data.status === "canceled") return "failed";
    return "pending";
  }

  async belongsToOrder(paymentId: string, orderId: string) {
    const data = await this.fetchPayment(paymentId);
    return Boolean(data && data.metadata?.orderId === orderId);
  }

  private async fetchPayment(paymentId: string) {
    if (!this.settings.paymentShopId || !this.settings.paymentSecretKey) {
      return null;
    }
    const auth = Buffer.from(
      `${this.settings.paymentShopId}:${this.settings.paymentSecretKey}`,
    ).toString("base64");
    const response = await fetch(`https://api.yookassa.ru/v3/payments/${encodeURIComponent(paymentId)}`, {
      headers: { Authorization: `Basic ${auth}` },
    });
    if (!response.ok) return null;
    return (await response.json()) as { status?: string; metadata?: { orderId?: string } };
  }
}
