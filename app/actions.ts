"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { scenarios, expenses, incomes } from "@/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

const saveScenarioSchema = z.object({
  name: z.string().min(1),
  currency: z.string().default("USD"),
  startingCashCents: z.number().int().min(0),
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
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const validated = saveScenarioSchema.parse(input);
  const scenarioId = randomUUID();
  const now = new Date().toISOString();

  // Insert scenario and related items in a transaction-like manner
  // Note: libSQL doesn't support transactions the same way, so we'll do sequential inserts
  await db.insert(scenarios).values({
    id: scenarioId,
    userId,
    name: validated.name,
    currency: validated.currency,
    startingCashCents: validated.startingCashCents,
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

