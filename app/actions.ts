"use server";

import { auth } from "@clerk/nextjs/server";
import { db, ensureDbMigrated } from "@/lib/db";
import { scenarios, expenses, incomes } from "@/db/schema";
import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

const saveScenarioSchema = z.object({
  name: z.string().min(1),
  currency: z.string().default("USD"),
  startingCashCents: z.number().int().min(0),
  city: z.string().trim().optional(),
  runwayEndDate: z.string().optional(),
  expenses: z.array(
    z.object({
      name: z.string().min(1),
      amountMonthlyCents: z.number().int().min(0),
    })
  ),
  incomes: z.array(
    z.object({
      name: z.string().min(1),
      amountMonthlyCents: z.number().int().min(0),
    })
  ),
});

export async function saveScenario(input: unknown) {
  await ensureDbMigrated();
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const validated = saveScenarioSchema.parse(input);
  const scenarioId = randomUUID();
  const now = new Date().toISOString();

  // Delete all existing scenarios for this user to ensure only one clock at a time
  // Cascade delete will automatically remove associated expenses and incomes
  const existingScenarios = await db
    .select({ id: scenarios.id })
    .from(scenarios)
    .where(eq(scenarios.userId, userId));

  for (const existing of existingScenarios) {
    await db.delete(scenarios).where(eq(scenarios.id, existing.id));
  }

  // Insert new scenario and related items
  await db.insert(scenarios).values({
    id: scenarioId,
    userId,
    name: validated.name,
    currency: validated.currency,
    startingCashCents: validated.startingCashCents,
    city: validated.city,
    runwayEndDate: validated.runwayEndDate,
    createdAt: now,
    updatedAt: now,
  });

  if (validated.expenses.length > 0) {
    await db.insert(expenses).values(
      validated.expenses.map((expense) => ({
        id: randomUUID(),
        scenarioId,
        name: expense.name,
        amountMonthlyCents: expense.amountMonthlyCents,
      }))
    );
  }

  if (validated.incomes.length > 0) {
    await db.insert(incomes).values(
      validated.incomes.map((income) => ({
        id: randomUUID(),
        scenarioId,
        name: income.name,
        amountMonthlyCents: income.amountMonthlyCents,
      }))
    );
  }

  return { id: scenarioId };
}

export async function getScenario(id: string) {
  await ensureDbMigrated();
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const [scenario] = await db
    .select()
    .from(scenarios)
    .where(eq(scenarios.id, id))
    .limit(1);

  if (!scenario || scenario.userId !== userId) {
    throw new Error("Scenario not found");
  }

  const scenarioExpenses = await db
    .select()
    .from(expenses)
    .where(eq(expenses.scenarioId, id));

  const scenarioIncomes = await db
    .select()
    .from(incomes)
    .where(eq(incomes.scenarioId, id));

  return {
    ...scenario,
    expenses: scenarioExpenses,
    incomes: scenarioIncomes,
  };
}

export async function getPublicScenario(id: string) {
  await ensureDbMigrated();

  const [scenario] = await db
    .select()
    .from(scenarios)
    .where(eq(scenarios.id, id))
    .limit(1);

  if (!scenario) {
    throw new Error("Scenario not found");
  }

  const scenarioExpenses = await db
    .select()
    .from(expenses)
    .where(eq(expenses.scenarioId, id));

  const scenarioIncomes = await db
    .select()
    .from(incomes)
    .where(eq(incomes.scenarioId, id));

  return {
    ...scenario,
    expenses: scenarioExpenses,
    incomes: scenarioIncomes,
  };
}

export async function getUserScenarios() {
  await ensureDbMigrated();
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const userScenarios = await db
    .select({
      id: scenarios.id,
      name: scenarios.name,
      runwayEndDate: scenarios.runwayEndDate,
    })
    .from(scenarios)
    .where(eq(scenarios.userId, userId))
    .orderBy(desc(scenarios.createdAt));

  return userScenarios;
}
