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

  // Check if clock exists for this user
  const existingClock = await db
    .select({ id: clocks.id })
    .from(clocks)
    .where(eq(clocks.userId, userId))
    .limit(1);

  if (existingClock.length > 0) {
    // Update existing clock
    const [updated] = await db
      .update(clocks)
      .set({
        name: validated.name,
        city: validated.city,
        runwayEndDate: validated.runwayEndDate,
        updatedAt: now,
      })
      .where(eq(clocks.userId, userId))
      .returning({ id: clocks.id });

    return { id: updated.id };
  } else {
    // Insert new clock
    // Handle race condition: if another request inserts simultaneously,
    // catch the unique constraint violation and update instead
    try {
      const [newClock] = await db
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
        .returning({ id: clocks.id });

      return { id: newClock.id };
    } catch (error: unknown) {
      // If unique constraint violation, update instead
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        (error.code === "SQLITE_CONSTRAINT_UNIQUE" ||
          error.code === "SQLITE_CONSTRAINT" ||
          (typeof error.code === "string" && error.code.includes("UNIQUE")))
      ) {
        const [updated] = await db
          .update(clocks)
          .set({
            name: validated.name,
            city: validated.city,
            runwayEndDate: validated.runwayEndDate,
            updatedAt: now,
          })
          .where(eq(clocks.userId, userId))
          .returning({ id: clocks.id });

        return { id: updated.id };
      }
      // Re-throw if it's a different error
      throw error;
    }
  }
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

export async function resetClock(id: string) {
  await ensureDbMigrated();
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Verify the clock belongs to the user
  const [clock] = await db
    .select({ userId: clocks.userId })
    .from(clocks)
    .where(eq(clocks.id, id))
    .limit(1);

  if (!clock || clock.userId !== userId) {
    throw new Error("Clock not found or unauthorized");
  }

  // Reset the clock by clearing runwayEndDate and city
  await db
    .update(clocks)
    .set({
      runwayEndDate: null,
      city: null,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(clocks.id, id));

  return { success: true };
}
