import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const clocks = sqliteTable("clocks", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull().unique(),
  name: text("name").notNull(),
  city: text("city"),
  runwayEndDate: text("runwayEndDate"),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});
