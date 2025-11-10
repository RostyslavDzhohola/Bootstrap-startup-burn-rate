-- Add unique constraint on userId to enforce one clock per user
-- SQLite doesn't support ALTER COLUMN, so we recreate the table with the correct schema
-- Step 1: Create new table with NOT NULL userId and unique constraint
CREATE TABLE `clocks_new` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`name` text NOT NULL,
	`city` text,
	`runwayEndDate` text,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL
);
--> statement-breakpoint
-- Step 2: Copy data from old table (filter out rows with NULL userId)
-- Deduplicate: keep only the most recent clock per user (by updatedAt)
INSERT INTO `clocks_new` (`id`, `userId`, `name`, `city`, `runwayEndDate`, `createdAt`, `updatedAt`)
SELECT `id`, `userId`, `name`, `city`, `runwayEndDate`, `createdAt`, `updatedAt`
FROM (
	SELECT `id`, `userId`, `name`, `city`, `runwayEndDate`, `createdAt`, `updatedAt`,
		ROW_NUMBER() OVER (PARTITION BY `userId` ORDER BY `updatedAt` DESC) as rn
	FROM `clocks`
	WHERE `userId` IS NOT NULL
)
WHERE rn = 1;
--> statement-breakpoint
-- Step 3: Drop old table
DROP TABLE `clocks`;
--> statement-breakpoint
-- Step 4: Rename new table to original name
ALTER TABLE `clocks_new` RENAME TO `clocks`;
--> statement-breakpoint
-- Step 5: Create unique index on userId
CREATE UNIQUE INDEX `clocks_userId_unique` ON `clocks` (`userId`);