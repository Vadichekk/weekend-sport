import { createHmac, createHash, timingSafeEqual } from "node:crypto";

export function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function sha256Hex(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function hmacSha256Base64(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64");
}
