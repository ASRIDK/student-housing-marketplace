// One Prisma client for the whole app. Import `db` from here — never
// create your own PrismaClient.
//
// The Neon serverless driver talks to Postgres over WebSocket (port 443),
// which works on Vercel and on networks that block the usual 5432.

import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/generated/prisma/client";

function createClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set — copy .env.example to .env.local");
  }
  return new PrismaClient({ adapter: new PrismaNeon({ connectionString }) });
}

// `next dev` reloads modules on every change; keep a single instance on
// globalThis so we don't open a new pool each time.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
