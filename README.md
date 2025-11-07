# Burn Rate Calculator

Calculate your startup burn rate and runway. See how long your savings will last based on your expenses and income.

## Features

- **Public Calculator**: Calculate burn rate without signing in
- **Save Scenarios**: Sign in to save your calculations and view a live countdown clock
- **Multi-Currency Support**: Calculate in USD, EUR, GBP, THB, and more

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Set up environment variables in `.env.local`:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
BURNRATE_TURSO_DATABASE_URL=libsql://...
BURNRATE_TURSO_AUTH_TOKEN=...
```

3. Run database migrations:

```bash
pnpm db:generate
pnpm db:migrate
```

4. Start the development server:

```bash
pnpm dev
```

5. Run tests:

```bash
pnpm test
```

## Tech Stack

- **Next.js 16** (App Router)
- **Tailwind CSS 4**
- **Clerk** (Authentication)
- **Turso** (Serverless SQLite via libSQL)
- **Drizzle ORM**
- **Vitest** (Testing)

## Database Setup

The app uses Turso (serverless SQLite) for the database. In development, it falls back to a local SQLite file if Turso credentials are not provided.

For production, connect your Turso database via the Vercel integration, which will automatically inject the required environment variables.
