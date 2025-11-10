import { sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

export const clocks = sqliteTable(
  "clocks",
  {
    id: text("id").primaryKey(),
    userId: text("userId").notNull(),
    name: text("name").notNull(),
    city: text("city"),
    runwayEndDate: text("runwayEndDate"),
    createdAt: text("createdAt").notNull(),
    updatedAt: text("updatedAt").notNull(),
  },
  (table) => [unique().on(table.userId)]
);
