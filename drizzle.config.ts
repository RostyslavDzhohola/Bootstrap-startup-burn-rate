import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "turso",
  schema: "./db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.BURNRATE_TURSO_DATABASE_URL ?? "file:local.db",
    ...(process.env.BURNRATE_TURSO_AUTH_TOKEN && {
      authToken: process.env.BURNRATE_TURSO_AUTH_TOKEN,
    }),
  },
});
