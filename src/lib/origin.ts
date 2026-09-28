import { headers } from "next/headers";
import { appUrl } from "@/lib/utils";

function isAllowedHost(host: string) {
  const configured = appUrl().replace(/^https?:\/\//, "").split("/")[0];
  if (host === configured) return true;
  return host.endsWith(".vercel.app");
}

export async function requestOrigin() {
  const store = await headers();
  const host = (store.get("x-forwarded-host") || store.get("host") || "").split(",")[0].trim();
  const proto = store.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  if (host && isAllowedHost(host)) {
    return `${proto}://${host}`;
  }
  return appUrl();
}
