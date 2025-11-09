-- Ensure clocks table exists (migration 0003 should have created it)
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
-- Clean up any remaining old tables
DROP TABLE IF EXISTS `scenarios`;
--> statement-breakpoint
DROP TABLE IF EXISTS `expenses`;
--> statement-breakpoint
DROP TABLE IF EXISTS `incomes`;

