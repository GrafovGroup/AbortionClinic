CREATE TABLE IF NOT EXISTS `provider_request_targets` (
	`request_id` text PRIMARY KEY NOT NULL,
	`provider_id` text NOT NULL,
	`provider_name` text NOT NULL,
	FOREIGN KEY (`request_id`) REFERENCES `provider_requests`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `source_link_checks` (
	`url` text PRIMARY KEY NOT NULL,
	`outcome` text NOT NULL,
	`http_status` integer,
	`checked_at` text NOT NULL
);
