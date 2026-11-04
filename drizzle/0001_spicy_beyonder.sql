CREATE TABLE `referral_events` (
	`id` text PRIMARY KEY NOT NULL,
	`referral_id` text NOT NULL,
	`status` text NOT NULL,
	`provider_id` text,
	`connection_method` text,
	`created_at` text NOT NULL,
	`actor` text NOT NULL,
	FOREIGN KEY (`referral_id`) REFERENCES `referral_requests`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `referral_events_request` ON `referral_events` (`referral_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `referral_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`token_hash` text NOT NULL,
	`name` text NOT NULL,
	`contact` text NOT NULL,
	`method` text NOT NULL,
	`language` text NOT NULL,
	`provider_id` text,
	`assigned_provider_id` text,
	`connection_method` text,
	`source_path` text NOT NULL,
	`locale` text NOT NULL,
	`voicemail` integer DEFAULT 0 NOT NULL,
	`share_consent` integer DEFAULT 0 NOT NULL,
	`consent_version` text NOT NULL,
	`consented_at` text NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`version` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `referrals_token` ON `referral_requests` (`token_hash`);--> statement-breakpoint
CREATE INDEX `referrals_created` ON `referral_requests` (`created_at`);--> statement-breakpoint
CREATE INDEX `referrals_contact_created` ON `referral_requests` (`contact`,`created_at`);