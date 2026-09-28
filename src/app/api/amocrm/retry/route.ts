import { NextResponse } from "next/server";
import { processAmoJobs } from "@/lib/amocrm/client";
import { safeEqual } from "@/lib/crypto";

export async function POST(request: Request) {
  const expected = process.env.CRON_SECRET || "";
  const given = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
  if (!expected || !safeEqual(expected, given)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const ids = await processAmoJobs();
  return NextResponse.json({ ok: true, processed: ids.length });
}
