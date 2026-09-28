"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession, hashPassword, verifyPassword } from "@/lib/auth";
import { getPaymentProvider } from "@/lib/payments";
import { deriveSessionStatus } from "@/lib/session-status";
import { requestOrigin } from "@/lib/origin";
import { clientIpFromHeaders, limited } from "@/lib/rate-limit";
import { isValidRuPhone, normalizePhone, orderNumber } from "@/lib/utils";

const childSchema = z.object({
  name: z.string().min(2),
  age: z.coerce.number().min(4).max(17),
});

const schema = z.object({
  parentName: z.string().min(3),
  parentPhone: z.string().min(10),
  parentEmail: z.string().email().optional().or(z.literal("")),
  password: z.string().min(6),
  pdnConsent: z.literal("on"),
  items: z.string(),
});

type PostedItem = {
  sessionId: string;
  children: { name: string; age: number }[];
};

export async function createCheckout(formData: FormData) {
  const ip = clientIpFromHeaders(await headers());
  if (limited(`checkout:${ip}`, 8, 10 * 60_000)) {
    redirect("/checkout?error=unknown");
  }

  const parsed = schema.safeParse({
    parentName: formData.get("parentName"),
    parentPhone: formData.get("parentPhone"),
    parentEmail: formData.get("parentEmail") || "",
    password: formData.get("password"),
    pdnConsent: formData.get("pdnConsent"),
    items: formData.get("items"),
  });

  if (!parsed.success) {
    redirect("/checkout?error=validation");
  }

  if (!isValidRuPhone(parsed.data.parentPhone)) {
    redirect("/checkout?error=phone");
  }

  let items: PostedItem[] = [];
  try {
    items = JSON.parse(parsed.data.items) as PostedItem[];
  } catch {
    redirect("/checkout?error=cart");
  }

  if (!items.length) {
    redirect("/cart");
  }

  for (const item of items) {
    if (!item.children?.length) redirect("/checkout?error=children");
    for (const child of item.children) {
      const ok = childSchema.safeParse(child);
      if (!ok.success) redirect("/checkout?error=children");
    }
  }

  const phone = normalizePhone(parsed.data.parentPhone);
  const email = parsed.data.parentEmail || null;

  const result = await prisma.$transaction(async (tx) => {
    let parent = await tx.parent.findUnique({ where: { phone } });
    if (parent) {
      const valid = await verifyPassword(parsed.data.password, parent.passwordHash);
      if (!valid) {
        throw new Error("PHONE_PASSWORD");
      }
      parent = await tx.parent.update({
        where: { id: parent.id },
        data: { name: parsed.data.parentName, email: email || parent.email },
      });
    } else {
      parent = await tx.parent.create({
        data: {
          name: parsed.data.parentName,
          phone,
          email,
          passwordHash: await hashPassword(parsed.data.password),
        },
      });
    }

    let total = 0;
    const prepared = [];

    for (const item of items) {
      const session = await tx.session.findUnique({
        where: { id: item.sessionId },
        include: { location: true },
      });
      if (!session || !session.published) {
        throw new Error("SESSION");
      }
      const quantity = item.children.length;
      if (session.spotsLeft < quantity) {
        throw new Error("SPOTS");
      }
      const spotsLeft = session.spotsLeft - quantity;
      await tx.session.update({
        where: { id: session.id },
        data: {
          spotsLeft,
          status: deriveSessionStatus(spotsLeft, session.status),
        },
      });
      total += session.pricePerChild * quantity;
      prepared.push({
        sessionId: session.id,
        children: JSON.stringify(item.children),
        quantity,
        priceEach: session.pricePerChild,
        locationName: session.location.name,
      });
    }

    const order = await tx.order.create({
      data: {
        publicNumber: orderNumber(),
        parentId: parent.id,
        parentName: parsed.data.parentName,
        parentPhone: phone,
        parentEmail: email,
        pdnConsent: true,
        status: "pending",
        totalAmount: total,
        idempotencyKey: `order_${parent.id}_${Date.now()}`,
        items: {
          create: prepared.map((item) => ({
            sessionId: item.sessionId,
            children: item.children,
            quantity: item.quantity,
            priceEach: item.priceEach,
          })),
        },
      },
    });

    return { order, parent, prepared, total };
  }).catch((error: Error) => {
    if (error.message === "PHONE_PASSWORD") redirect("/checkout?error=password");
    if (error.message === "SPOTS") redirect("/checkout?error=spots");
    redirect("/checkout?error=unknown");
  });

  await createSession({
    role: "parent",
    parentId: result.parent.id,
    name: result.parent.name,
    phone: result.parent.phone,
  });

  const origin = await requestOrigin();
  const provider = await getPaymentProvider();
  const payment = await provider.createPayment({
    orderId: result.order.id,
    publicNumber: result.order.publicNumber,
    amount: result.total,
    description: `Уикенд ${result.order.publicNumber}`,
    returnUrl: `${origin}/pay/success?order=${result.order.id}`,
    failUrl: `${origin}/pay/fail?order=${result.order.id}`,
    metadata: { orderNumber: result.order.publicNumber },
  });

  await prisma.order.update({
    where: { id: result.order.id },
    data: {
      paymentId: payment.paymentId,
      paymentProvider: payment.provider,
    },
  });

  redirect(payment.confirmationUrl);
}
