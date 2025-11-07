import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { createClient, LibsqlError } from "@libsql/client";
import path from "path";

// Get database URL from environment
const tursoUrl = process.env.BURNRATE_TURSO_DATABASE_URL?.trim();
const tursoAuthToken = process.env.BURNRATE_TURSO_AUTH_TOKEN?.trim();

// Determine which database to use
let url: string;
let authToken: string | undefined;

if (tursoUrl && tursoUrl.length > 0) {
  // Use Turso remote database
  url = tursoUrl;
  authToken = tursoAuthToken;

  // Validate URL format
  if (
    !url.startsWith("libsql://") &&
    !url.startsWith("https://") &&
    !url.startsWith("http://")
  ) {
    throw new Error(
      `Invalid BURNRATE_TURSO_DATABASE_URL format. Expected URL starting with libsql://, https://, or http://. ` +
        `Got: "${url}". ` +
        `Please set BURNRATE_TURSO_DATABASE_URL in your .env.local file with a valid Turso database URL. ` +
        `Get your URL from: https://turso.tech/app`
    );
  }

  if (!authToken || authToken.length === 0) {
    throw new Error(
      `BURNRATE_TURSO_AUTH_TOKEN is required when using BURNRATE_TURSO_DATABASE_URL. ` +
        `Please set BURNRATE_TURSO_AUTH_TOKEN in your .env.local file. ` +
        `Get your token from: https://turso.tech/app`
    );
  }
} else {
  // Fall back to local SQLite file
  const localDbPath = path.join(process.cwd(), "local.db");
  url = `file:${localDbPath}`;
  authToken = undefined;

  console.warn(
    "⚠️  BURNRATE_TURSO_DATABASE_URL not set. Using local SQLite database (file:local.db). " +
      "For production, set BURNRATE_TURSO_DATABASE_URL and BURNRATE_TURSO_AUTH_TOKEN in your .env.local file."
  );
}

// Create client with error handling
let client;
try {
  client = createClient({ url, authToken });
} catch (error) {
  if (error instanceof LibsqlError) {
    if (error.code === "URL_INVALID") {
      throw new Error(
        `Database connection failed: Invalid URL format. ` +
          `URL: "${url}". ` +
          `Please check your BURNRATE_TURSO_DATABASE_URL in .env.local. ` +
          `Valid formats: libsql://your-db.turso.io, https://your-db.turso.io, or file:local.db`
      );
    }
    throw new Error(
      `Database connection failed: ${error.message} (code: ${error.code})`
    );
  }
  throw error;
}

export const db = drizzle(client);

const globalForDb = globalThis as unknown as {
  __drizzleMigrationPromise?: Promise<void>;
};

async function runMigrationsOnce() {
  if (!globalForDb.__drizzleMigrationPromise) {
    const migrationsFolder = path.join(process.cwd(), "drizzle");
    globalForDb.__drizzleMigrationPromise = migrate(db, {
      migrationsFolder,
    }).catch((error) => {
      console.error("Database migration failed", error);
      globalForDb.__drizzleMigrationPromise = undefined;
      throw error;
    });
  }
  return globalForDb.__drizzleMigrationPromise;
}

export async function ensureDbMigrated() {
  await runMigrationsOnce();
}
