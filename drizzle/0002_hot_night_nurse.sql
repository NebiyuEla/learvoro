ALTER TABLE `checkout_drafts` ADD `student_reference` text;--> statement-breakpoint
ALTER TABLE `checkout_drafts` ADD `learning_mode` text DEFAULT 'self-paced' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `idx_checkout_drafts_student_reference` ON `checkout_drafts` (`student_reference`);