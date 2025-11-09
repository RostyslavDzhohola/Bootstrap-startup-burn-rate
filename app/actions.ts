"use server";

import { auth } from "@clerk/nextjs/server";
import { db, ensureDbMigrated } from "@/lib/db";
import { clocks } from "@/db/schema";
import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

const saveClockSchema = z.object({
  name: z.string().min(1),
  city: z.string().trim().optional(),
  runwayEndDate: z.string().optional(),
});

export async function saveClock(input: unknown) {
  await ensureDbMigrated();
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const validated = saveClockSchema.parse(input);
  const clockId = randomUUID();
  const now = new Date().toISOString();

  // Delete all existing clocks for this user to ensure only one clock at a time
  const existingClocks = await db
    .select({ id: clocks.id })
    .from(clocks)
    .where(eq(clocks.userId, userId));

  for (const existing of existingClocks) {
    await db.delete(clocks).where(eq(clocks.id, existing.id));
  }

  // Insert new clock
  await db.insert(clocks).values({
    id: clockId,
    userId,
    name: validated.name,
    city: validated.city,
    runwayEndDate: validated.runwayEndDate,
    createdAt: now,
    updatedAt: now,
  });

  return { id: clockId };
}

export async function getClock(id: string) {
  await ensureDbMigrated();
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const [clock] = await db
    .select()
    .from(clocks)
    .where(eq(clocks.id, id))
    .limit(1);

  if (!clock || clock.userId !== userId) {
    throw new Error("Clock not found");
  }

  return clock;
}

export async function getPublicClock(id: string) {
  await ensureDbMigrated();

  const [clock] = await db
    .select()
    .from(clocks)
    .where(eq(clocks.id, id))
    .limit(1);

  if (!clock) {
    throw new Error("Clock not found");
  }

  return clock;
}

export async function getUserClocks() {
  await ensureDbMigrated();
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const userClocks = await db
    .select({
      id: clocks.id,
      name: clocks.name,
      runwayEndDate: clocks.runwayEndDate,
    })
    .from(clocks)
    .where(eq(clocks.userId, userId))
    .orderBy(desc(clocks.createdAt));

  return userClocks;
}
