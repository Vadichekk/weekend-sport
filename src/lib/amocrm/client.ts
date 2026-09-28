import { prisma } from "@/lib/prisma";
import { formatRange } from "@/lib/dates";
import { getSettings } from "@/lib/settings";

type Child = { name: string; age: number };

type LeadPayload = {
  locationName: string;
  startDate: string;
  endDate: string;
  childName: string;
  childAge: number;
  parentName: string;
  parentPhone: string;
  parentEmail?: string | null;
  orderNumber: string;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function amoRequest(
  domain: string,
  token: string,
  path: string,
  init?: RequestInit,
) {
  const response = await fetch(`https://${domain}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`amoCRM ${response.status}: ${text.slice(0, 240)}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

async function findPipelineId(domain: string, token: string, name: string) {
  const data = (await amoRequest(domain, token, "/api/v4/leads/pipelines")) as {
    _embedded?: { pipelines?: { id: number; name: string }[] };
  };
  const pipelines = data._embedded?.pipelines || [];
  const match = pipelines.find((item) => item.name.toLowerCase() === name.toLowerCase());
  return match?.id ?? pipelines[0]?.id ?? null;
}

export async function enqueueAmoJobs(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { session: { include: { location: true } } } },
    },
  });
  if (!order) return;

  for (const item of order.items) {
    const children = JSON.parse(item.children) as Child[];
    for (const child of children) {
      const payload: LeadPayload = {
        locationName: item.session.location.name,
        startDate: item.session.startDate.toISOString(),
        endDate: item.session.endDate.toISOString(),
        childName: child.name,
        childAge: child.age,
        parentName: order.parentName,
        parentPhone: order.parentPhone,
        parentEmail: order.parentEmail,
        orderNumber: order.publicNumber,
      };
      await prisma.amoJob.create({
        data: { orderId, payload: JSON.stringify(payload) },
      });
    }
  }

  await processAmoJobs();
}

async function createLead(payload: LeadPayload) {
  const settings = await getSettings();
  const title = `${payload.locationName} ${formatRange(new Date(payload.startDate), new Date(payload.endDate))} ${payload.childName} ${payload.childAge}л ${payload.parentPhone}`;

  if (!settings.amoEnabled || !settings.amoAccessToken) {
    console.info("[amoCRM mock]", title);
    return `mock_${Date.now()}`;
  }

  const pipelineId = await findPipelineId(
    settings.amoDomain,
    settings.amoAccessToken,
    settings.amoPipelineName,
  );

  const contact = (await amoRequest(settings.amoDomain, settings.amoAccessToken, "/api/v4/contacts", {
    method: "POST",
    body: JSON.stringify([
      {
        name: payload.parentName,
        custom_fields_values: [
          {
            field_code: "PHONE",
            values: [{ value: payload.parentPhone, enum_code: "WORK" }],
          },
          ...(payload.parentEmail
            ? [
                {
                  field_code: "EMAIL",
                  values: [{ value: payload.parentEmail, enum_code: "WORK" }],
                },
              ]
            : []),
        ],
      },
    ]),
  })) as { _embedded?: { contacts?: { id: number }[] } };

  const contactId = contact._embedded?.contacts?.[0]?.id;

  const lead = (await amoRequest(settings.amoDomain, settings.amoAccessToken, "/api/v4/leads", {
    method: "POST",
    body: JSON.stringify([
      {
        name: title,
        pipeline_id: pipelineId ?? undefined,
        tags: [{ name: "уикенд" }],
        _embedded: contactId ? { contacts: [{ id: contactId }] } : undefined,
        custom_fields_values: [
          {
            field_name: "Заказ",
            values: [{ value: payload.orderNumber }],
          },
        ],
      },
    ]),
  })) as { _embedded?: { leads?: { id: number }[] } };

  return String(lead._embedded?.leads?.[0]?.id || `unknown_${Date.now()}`);
}

export async function processAmoJobs() {
  const jobs = await prisma.amoJob.findMany({
    where: {
      status: { in: ["pending", "failed"] },
      OR: [{ nextRetry: null }, { nextRetry: { lte: new Date() } }],
    },
    take: 10,
  });

  const leadIds: string[] = [];

  for (const job of jobs) {
    try {
      const payload = JSON.parse(job.payload) as LeadPayload;
      const leadId = await createLead(payload);
      await prisma.amoJob.update({
        where: { id: job.id },
        data: { status: "done", lastError: null },
      });
      leadIds.push(leadId);
      const order = await prisma.order.findUnique({ where: { id: job.orderId } });
      const current = JSON.parse(order?.amoLeadIds || "[]") as string[];
      await prisma.order.update({
        where: { id: job.orderId },
        data: { amoLeadIds: JSON.stringify([...current, leadId]) },
      });
    } catch (error) {
      const attempts = job.attempts + 1;
      const delay = Math.min(30 * 60 * 1000, 15_000 * 2 ** Math.min(attempts, 5));
      await prisma.amoJob.update({
        where: { id: job.id },
        data: {
          status: attempts >= 6 ? "failed" : "pending",
          attempts,
          lastError: error instanceof Error ? error.message : "unknown",
          nextRetry: new Date(Date.now() + delay),
        },
      });
      await sleep(250);
    }
  }

  return leadIds;
}
