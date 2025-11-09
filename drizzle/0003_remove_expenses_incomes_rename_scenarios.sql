-- Drop expenses table
DROP TABLE IF EXISTS `expenses`;
--> statement-breakpoint
-- Drop incomes table
DROP TABLE IF EXISTS `incomes`;
--> statement-breakpoint
-- Create clocks table with same structure as scenarios
CREATE TABLE IF NOT EXISTS `clocks` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text,
	`name` text NOT NULL,
	`city` text,
	`runwayEndDate` text,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL
);
--> statement-breakpoint
-- Drop old scenarios table (data will be copied in next migration if needed)
DROP TABLE IF EXISTS `scenarios`;

