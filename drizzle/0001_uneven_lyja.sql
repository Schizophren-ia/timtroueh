CREATE TABLE `demo_accounts` (
	`email` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `demo_accounts_user_id_unique` ON `demo_accounts` (`user_id`);--> statement-breakpoint
CREATE TABLE `demo_otps` (
	`email` text PRIMARY KEY NOT NULL,
	`challenge` text NOT NULL,
	`code_hash` text NOT NULL,
	`purpose` text NOT NULL,
	`name` text NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`consumed` integer DEFAULT 0 NOT NULL,
	`expires_at` integer NOT NULL,
	`sent_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `demo_otps_challenge_unique` ON `demo_otps` (`challenge`);--> statement-breakpoint
CREATE TABLE `demo_sessions` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE no action
);
