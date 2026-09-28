import { copyFileSync, existsSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

function datasourceUrl() {
  if (!process.env.VERCEL) {
    return process.env.DATABASE_URL;
  }
  const source = path.join(process.cwd(), "prisma", "dev.db");
  const target = "/tmp/prisma-dev.db";
  if (existsSync(source) && !existsSync(target)) {
    copyFileSync(source, target);
  }
  return "file:/tmp/prisma-dev.db";
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: datasourceUrl(),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
