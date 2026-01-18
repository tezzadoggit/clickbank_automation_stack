CREATE TABLE `videoProjects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`offerId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`niche` enum('manifestation','woodworking','prepping','health','finance','other') NOT NULL,
	`script` text NOT NULL,
	`scriptWordCount` int,
	`promptTemplate` varchar(100),
	`voiceoverUrl` text,
	`voiceId` varchar(100),
	`voiceName` varchar(100),
	`videoUrl` text,
	`thumbnailUrl` text,
	`duration` int,
	`clickmagickUrl` text,
	`utmSource` varchar(100),
	`utmMedium` varchar(100),
	`utmCampaign` varchar(100),
	`utmTerm` varchar(100),
	`utmContent` varchar(100),
	`views` int NOT NULL DEFAULT 0,
	`clicks` int NOT NULL DEFAULT 0,
	`conversions` int NOT NULL DEFAULT 0,
	`adSpend` int NOT NULL DEFAULT 0,
	`revenue` int NOT NULL DEFAULT 0,
	`status` enum('draft','generating','ready','published','archived') NOT NULL DEFAULT 'draft',
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `videoProjects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `voices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`elevenLabsVoiceId` varchar(100) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`previewUrl` text,
	`gender` enum('male','female','neutral'),
	`age` enum('young','middle','old'),
	`accent` varchar(100),
	`useCase` text,
	`usageCount` int NOT NULL DEFAULT 0,
	`isFavorite` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `voices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `videoProjects` ADD CONSTRAINT `videoProjects_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `videoProjects` ADD CONSTRAINT `videoProjects_offerId_offers_id_fk` FOREIGN KEY (`offerId`) REFERENCES `offers`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `voices` ADD CONSTRAINT `voices_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;