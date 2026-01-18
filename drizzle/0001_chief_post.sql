CREATE TABLE `adCopyVariations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`landingPageId` int NOT NULL,
	`headline` text NOT NULL,
	`bodyCopy` text NOT NULL,
	`callToAction` varchar(255) NOT NULL,
	`impressions` int NOT NULL DEFAULT 0,
	`clicks` int NOT NULL DEFAULT 0,
	`conversions` int NOT NULL DEFAULT 0,
	`isControl` int NOT NULL DEFAULT 0,
	`status` enum('active','paused','winner','archived') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `adCopyVariations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `emailSequences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`offerId` int,
	`name` varchar(255) NOT NULL,
	`niche` enum('manifestation','woodworking','prepping','health','finance','other') NOT NULL,
	`description` text,
	`emailCount` int NOT NULL,
	`daysBetweenEmails` int NOT NULL DEFAULT 1,
	`status` enum('draft','active','paused','archived') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `emailSequences_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `emails` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sequenceId` int NOT NULL,
	`dayNumber` int NOT NULL,
	`subject` varchar(255) NOT NULL,
	`preheader` varchar(255),
	`body` text NOT NULL,
	`sent` int NOT NULL DEFAULT 0,
	`opened` int NOT NULL DEFAULT 0,
	`clicked` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `emails_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `landingPages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`offerId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`headline` text NOT NULL,
	`subheadline` text,
	`bodyCopy` text NOT NULL,
	`callToAction` varchar(255) NOT NULL,
	`thumbnailUrl` text,
	`heroImageUrl` text,
	`template` varchar(100) NOT NULL,
	`niche` enum('manifestation','woodworking','prepping','health','finance','other') NOT NULL,
	`views` int NOT NULL DEFAULT 0,
	`clicks` int NOT NULL DEFAULT 0,
	`conversions` int NOT NULL DEFAULT 0,
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `landingPages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `nicheStrategies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`niche` enum('manifestation','woodworking','prepping','health','finance','other') NOT NULL,
	`title` varchar(255) NOT NULL,
	`category` enum('hook','traffic_source','marketing_angle','audience_profile','content_type') NOT NULL,
	`description` text NOT NULL,
	`examples` text,
	`tips` text,
	`effectiveness` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `nicheStrategies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `offers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`productName` varchar(255) NOT NULL,
	`vendor` varchar(255) NOT NULL,
	`clickbankId` varchar(100) NOT NULL,
	`niche` enum('manifestation','woodworking','prepping','health','finance','other') NOT NULL,
	`gravity` int,
	`avgEarningsPerSale` int,
	`avgConversionValue` int,
	`commissionRate` int,
	`rebillRate` int,
	`salesPageUrl` text,
	`affiliatePageUrl` text,
	`description` text,
	`targetAudience` text,
	`evaluationScore` int,
	`recommendationStatus` enum('recommended','caution','avoid','pending') DEFAULT 'pending',
	`notes` text,
	`status` enum('active','paused','archived') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `offers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `performanceMetrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`offerId` int NOT NULL,
	`landingPageId` int,
	`date` timestamp NOT NULL,
	`impressions` int NOT NULL DEFAULT 0,
	`clicks` int NOT NULL DEFAULT 0,
	`uniqueVisitors` int NOT NULL DEFAULT 0,
	`conversions` int NOT NULL DEFAULT 0,
	`revenue` int NOT NULL DEFAULT 0,
	`adSpend` int NOT NULL DEFAULT 0,
	`ctr` int,
	`conversionRate` int,
	`epc` int,
	`cpc` int,
	`roi` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `performanceMetrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `adCopyVariations` ADD CONSTRAINT `adCopyVariations_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `adCopyVariations` ADD CONSTRAINT `adCopyVariations_landingPageId_landingPages_id_fk` FOREIGN KEY (`landingPageId`) REFERENCES `landingPages`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `emailSequences` ADD CONSTRAINT `emailSequences_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `emailSequences` ADD CONSTRAINT `emailSequences_offerId_offers_id_fk` FOREIGN KEY (`offerId`) REFERENCES `offers`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `emails` ADD CONSTRAINT `emails_sequenceId_emailSequences_id_fk` FOREIGN KEY (`sequenceId`) REFERENCES `emailSequences`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `landingPages` ADD CONSTRAINT `landingPages_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `landingPages` ADD CONSTRAINT `landingPages_offerId_offers_id_fk` FOREIGN KEY (`offerId`) REFERENCES `offers`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `offers` ADD CONSTRAINT `offers_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `performanceMetrics` ADD CONSTRAINT `performanceMetrics_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `performanceMetrics` ADD CONSTRAINT `performanceMetrics_offerId_offers_id_fk` FOREIGN KEY (`offerId`) REFERENCES `offers`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `performanceMetrics` ADD CONSTRAINT `performanceMetrics_landingPageId_landingPages_id_fk` FOREIGN KEY (`landingPageId`) REFERENCES `landingPages`(`id`) ON DELETE set null ON UPDATE no action;