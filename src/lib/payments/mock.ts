import type { CreatePaymentInput, PaymentProvider, PaymentStatus, WebhookResult } from "./types";

export class MockPaymentProvider implements PaymentProvider {
  name = "mock";

  async createPayment(input: CreatePaymentInput) {
    const paymentId = `mock_${input.orderId}`;
    const params = new URLSearchParams({
      orderId: input.orderId,
      paymentId,
      amount: String(input.amount),
      number: input.publicNumber,
    });
    return {
      paymentId,
      confirmationUrl: `/pay/mock?${params.toString()}`,
      provider: this.name,
    };
  }

  async parseWebhook(rawBody: string): Promise<WebhookResult> {
    const data = JSON.parse(rawBody) as {
      eventKey?: string;
      paymentId: string;
      orderId: string;
      status: PaymentStatus;
    };
    return {
      eventKey: data.eventKey || `${data.paymentId}:${data.status}`,
      paymentId: data.paymentId,
      orderId: data.orderId,
      status: data.status,
    };
  }

  async getStatus(): Promise<PaymentStatus> {
    return "pending";
  }
}
