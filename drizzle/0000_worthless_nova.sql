CREATE TABLE `provider_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`organization` text NOT NULL,
	`email` text NOT NULL,
	`evidence` text NOT NULL,
	`kind` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text NOT NULL,
	`reviewed_at` text,
	`reviewed_by` text
);
--> statement-breakpoint
CREATE INDEX `requests_created` ON `provider_requests` (`created_at`);