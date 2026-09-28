import { headers } from "next/headers";
import { appUrl } from "@/lib/utils";

function configuredOrigin() {
  return appUrl().replace(/\/$/, "");
}

export async function requestOrigin() {
  const configured = configuredOrigin();
  if (process.env.NODE_ENV === "production") {
    return configured;
  }

  const store = await headers();
  const host = store.get("x-forwarded-host") || store.get("host") || "";
  const local = host.startsWith("localhost") || host.startsWith("127.0.0.1");
  if (!local) return configured;
  const proto = store.get("x-forwarded-proto") || "http";
  return `${proto}://${host}`;
}
