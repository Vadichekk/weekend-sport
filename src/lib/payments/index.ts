import { getSettings } from "@/lib/settings";
import { CloudPaymentsProvider } from "./cloudpayments";
import { MockPaymentProvider } from "./mock";
import { TKassaProvider } from "./tkassa";
import { YooKassaProvider } from "./yookassa";
import type { PaymentProvider } from "./types";

export async function getPaymentProvider(): Promise<PaymentProvider> {
  const settings = await getSettings();
  switch (settings.paymentProvider) {
    case "yookassa":
      return new YooKassaProvider(settings);
    case "tkassa":
      return new TKassaProvider(settings);
    case "cloudpayments":
      return new CloudPaymentsProvider(settings);
    default:
      return new MockPaymentProvider();
  }
}

export type { PaymentProvider, PaymentStatus } from "./types";
