import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const scenarios = sqliteTable("scenarios", {
  id: text("id").primaryKey(),
  userId: text("userId"),
  name: text("name").notNull(),
  city: text("city"),
  runwayEndDate: text("runwayEndDate"),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});

export const expenses = sqliteTable("expenses", {
  id: text("id").primaryKey(),
  scenarioId: text("scenarioId")
    .notNull()
    .references(() => scenarios.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  amountMonthlyCents: integer("amountMonthlyCents").notNull(),
});

export const incomes = sqliteTable("incomes", {
  id: text("id").primaryKey(),
  scenarioId: text("scenarioId")
    .notNull()
    .references(() => scenarios.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  amountMonthlyCents: integer("amountMonthlyCents").notNull(),
});
