export type PaymentStatus = "pending" | "paid" | "failed";

export type CreatePaymentInput = {
  orderId: string;
  publicNumber: string;
  amount: number;
  description: string;
  returnUrl: string;
  failUrl: string;
  metadata: Record<string, string>;
};

export type CreatePaymentResult = {
  paymentId: string;
  confirmationUrl: string;
  provider: string;
};

export type WebhookResult = {
  eventKey: string;
  paymentId: string;
  orderId: string;
  status: PaymentStatus;
};

export interface PaymentProvider {
  name: string;
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  parseWebhook(rawBody: string, headers: Headers): Promise<WebhookResult>;
  getStatus(paymentId: string): Promise<PaymentStatus>;
}
