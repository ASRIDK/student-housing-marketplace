import { existsSync } from "node:fs";
import { defineConfig } from "prisma/config";

// The Prisma CLI (migrate, seed, studio) reads this file. Next.js loads
// .env.local on its own, but the CLI does not, so we load it here when
// it exists (locally). On Vercel the variables come from the project.
if (existsSync(".env.local")) {
  process.loadEnvFile(".env.local");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Migrations must use the direct (non-pooled) connection — see
    // https://neon.com/docs/connect/connection-pooling. The app itself
    // uses the pooled DATABASE_URL in src/lib/db.ts.
    url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL,
  },
});
