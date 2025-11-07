CREATE TABLE `expenses` (
	`id` text PRIMARY KEY NOT NULL,
	`scenarioId` text NOT NULL,
	`name` text NOT NULL,
	`amountMonthlyCents` integer NOT NULL,
	FOREIGN KEY (`scenarioId`) REFERENCES `scenarios`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `incomes` (
	`id` text PRIMARY KEY NOT NULL,
	`scenarioId` text NOT NULL,
	`name` text NOT NULL,
	`amountMonthlyCents` integer NOT NULL,
	FOREIGN KEY (`scenarioId`) REFERENCES `scenarios`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `scenarios` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text,
	`name` text NOT NULL,
	`currency` text DEFAULT 'USD' NOT NULL,
	`startingCashCents` integer NOT NULL,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL
);
