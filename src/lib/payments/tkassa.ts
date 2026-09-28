import type { AppSettings } from "@/lib/settings";
import { safeEqual, sha256Hex } from "@/lib/crypto";
import type { CreatePaymentInput, PaymentProvider, PaymentStatus, WebhookResult } from "./types";

export class TKassaProvider implements PaymentProvider {
  name = "tkassa";

  constructor(private settings: AppSettings) {}

  async createPayment(input: CreatePaymentInput) {
    if (!this.settings.paymentShopId || !this.settings.paymentSecretKey) {
      throw new Error("Т-Касса: заполните терминал и секретный ключ в настройках админки");
    }

    const response = await fetch("https://securepay.tinkoff.ru/v2/Init", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        TerminalKey: this.settings.paymentShopId,
        Amount: input.amount * 100,
        OrderId: input.orderId,
        Description: input.description,
        SuccessURL: input.returnUrl,
        FailURL: input.failUrl,
        DATA: input.metadata,
      }),
    });

    if (!response.ok) {
      throw new Error(`Т-Касса: не удалось создать платёж (${response.status})`);
    }

    const data = (await response.json()) as {
      Success?: boolean;
      PaymentId?: number | string;
      PaymentURL?: string;
      Message?: string;
    };

    if (!data.Success || !data.PaymentURL) {
      throw new Error(data.Message || "Т-Касса: платёж не создан");
    }

    return {
      paymentId: String(data.PaymentId),
      confirmationUrl: data.PaymentURL,
      provider: this.name,
    };
  }

  async parseWebhook(rawBody: string): Promise<WebhookResult> {
    const data = JSON.parse(rawBody) as Record<string, string | number | undefined>;
    const token = String(data.Token || "");
    const password = this.settings.paymentSecretKey || this.settings.paymentWebhookSecret;
    if (!password || !token) {
      throw new Error("Т-Касса: нет подписи уведомления");
    }
    const copy: Record<string, string | number | undefined> = { ...data, Password: password };
    delete copy.Token;
    const expected = sha256Hex(
      Object.keys(copy)
        .sort()
        .map((key) => String(copy[key] ?? ""))
        .join(""),
    );
    if (!safeEqual(expected.toLowerCase(), token.toLowerCase())) {
      throw new Error("Т-Касса: подпись не совпала");
    }
    const paymentId = String(data.PaymentId || "");
    const remote = String(data.Status || "").toUpperCase();
    const status: PaymentStatus =
      remote === "CONFIRMED" ? "paid" : ["REJECTED", "CANCELED", "DEADLINE_EXPIRED"].includes(remote)
        ? "failed"
        : "pending";
    return {
      eventKey: `${paymentId}:${remote || "unknown"}`,
      paymentId,
      orderId: String(data.OrderId || ""),
      status,
    };
  }

  async getStatus(): Promise<PaymentStatus> {
    return "pending";
  }
}
