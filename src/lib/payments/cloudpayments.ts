import type { AppSettings } from "@/lib/settings";
import { hmacSha256Base64, safeEqual } from "@/lib/crypto";
import type { CreatePaymentInput, PaymentProvider, PaymentStatus, WebhookResult } from "./types";

export class CloudPaymentsProvider implements PaymentProvider {
  name = "cloudpayments";

  constructor(private settings: AppSettings) {}

  async createPayment(input: CreatePaymentInput) {
    if (!this.settings.paymentShopId) {
      throw new Error("CloudPayments: заполните Public ID в настройках админки");
    }

    return {
      paymentId: `cp_${input.orderId}`,
      confirmationUrl: `${input.returnUrl}?error=cloudpayments-widget-not-wired`,
      provider: this.name,
    };
  }

  async parseWebhook(rawBody: string, headers: Headers): Promise<WebhookResult> {
    const secret = this.settings.paymentWebhookSecret || this.settings.paymentSecretKey;
    const given = headers.get("content-hmac") || headers.get("Content-HMAC") || "";
    if (!secret || !given || !safeEqual(hmacSha256Base64(rawBody, secret), given)) {
      throw new Error("CloudPayments: подпись не совпала");
    }
    const params = new URLSearchParams(rawBody);
    const paymentId = params.get("TransactionId") || params.get("InvoiceId") || "";
    const orderId = params.get("InvoiceId") || params.get("AccountId") || "";
    const statusCode = params.get("Status") || "";
    const status: PaymentStatus =
      statusCode === "Completed" ? "paid" : statusCode === "Declined" ? "failed" : "pending";
    return {
      eventKey: `${paymentId}:${statusCode || "unknown"}`,
      paymentId,
      orderId,
      status,
    };
  }

  async getStatus(): Promise<PaymentStatus> {
    return "pending";
  }
}
