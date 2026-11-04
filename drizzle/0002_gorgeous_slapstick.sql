ALTER TABLE `referral_requests` ADD `notification_status` text DEFAULT 'not_requested' NOT NULL;--> statement-breakpoint
ALTER TABLE `referral_requests` ADD `notification_attempted_at` text;