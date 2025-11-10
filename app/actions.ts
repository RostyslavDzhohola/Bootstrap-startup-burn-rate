"use server";

import { auth } from "@clerk/nextjs/server";
import { db, ensureDbMigrated } from "@/lib/db";
import { clocks } from "@/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";
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
  const now = new Date().toISOString();

  // Atomic upsert: insert or update on conflict
  await db
    .insert(clocks)
    .values({
      id: randomUUID(),
      userId,
      name: validated.name,
      city: validated.city,
      runwayEndDate: validated.runwayEndDate,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [clocks.userId],
      set: {
        name: validated.name,
        city: validated.city,
        runwayEndDate: validated.runwayEndDate,
        updatedAt: now,
      },
    });

  // Fetch the clock ID after upsert
  const [clock] = await db
    .select({ id: clocks.id })
    .from(clocks)
    .where(eq(clocks.userId, userId))
    .limit(1);

  return { id: clock.id };
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

export async function getUserClock() {
  await ensureDbMigrated();
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Return single clock per user (enforced by saveClock)
  const [userClock] = await db
    .select({
      id: clocks.id,
      name: clocks.name,
      runwayEndDate: clocks.runwayEndDate,
    })
    .from(clocks)
    .where(eq(clocks.userId, userId))
    .limit(1);

  return userClock || null;
}
