import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { clientIpFromHeaders, rateLimit } from "@/lib/rate-limit";

const COOKIE = "weekend_session";

async function isAdmin(token: string) {
  const secret =
    process.env.AUTH_SECRET ||
    (process.env.VERCEL
      ? `weekend-auth/${process.env.VERCEL_URL || "vercel"}/${process.env.VERCEL_GIT_COMMIT_SHA || "preview"}`
      : "");
  if (!secret || secret.length < 16) return false;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = clientIpFromHeaders(request.headers);

  if (!rateLimit(`ip:${ip}:${pathname.split("/")[1] || "root"}`, 120, 60_000).ok) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: { "Retry-After": "60" },
    });
  }

  if (pathname === "/admin/login" || pathname === "/account/login") {
    if (!rateLimit(`login:${ip}`, 8, 15 * 60_000).ok) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: { "Retry-After": "900" },
      });
    }
  }

  if (pathname.startsWith("/api/")) {
    if (!rateLimit(`api:${ip}`, 40, 60_000).ok) {
      return NextResponse.json({ ok: false, error: "rate_limit" }, { status: 429 });
    }
  }

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get(COOKIE)?.value;
    if (!token || !(await isAdmin(token))) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/login", "/api/:path*", "/checkout"],
};
