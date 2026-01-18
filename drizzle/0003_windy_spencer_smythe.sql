ALTER TABLE `offers` MODIFY COLUMN `clickbankId` varchar(100);--> statement-breakpoint
ALTER TABLE `offers` ADD `source` enum('clickbank','custom') DEFAULT 'clickbank' NOT NULL;--> statement-breakpoint
ALTER TABLE `offers` ADD `sourceUrl` text;