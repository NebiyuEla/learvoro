CREATE TABLE `checkout_drafts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`course_id` text NOT NULL,
	`email` text NOT NULL,
	`full_name` text NOT NULL,
	`country_code` text NOT NULL,
	`address_line_1` text NOT NULL,
	`city` text NOT NULL,
	`postal_code` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_checkout_drafts_user_course` ON `checkout_drafts` (`user_id`,`course_id`);