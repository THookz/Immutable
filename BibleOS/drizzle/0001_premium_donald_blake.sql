CREATE TABLE `historical_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`event_id` varchar(64) NOT NULL,
	`name` varchar(200) NOT NULL,
	`date` varchar(64) NOT NULL,
	`description` text NOT NULL,
	`significance` text NOT NULL,
	`related_symbols` text,
	`source_url` varchar(500),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `historical_events_id` PRIMARY KEY(`id`),
	CONSTRAINT `historical_events_event_id_unique` UNIQUE(`event_id`)
);
--> statement-breakpoint
CREATE TABLE `language_dictionaries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`strong_id` varchar(16) NOT NULL,
	`language` varchar(16) NOT NULL,
	`explanation` text NOT NULL,
	`usage` text,
	`nuance_note` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `language_dictionaries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `language_packs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`language_code` varchar(16) NOT NULL,
	`language_name` varchar(64) NOT NULL,
	`ui_translations` text NOT NULL,
	`is_active` int NOT NULL DEFAULT 1,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `language_packs_id` PRIMARY KEY(`id`),
	CONSTRAINT `language_packs_language_code_unique` UNIQUE(`language_code`)
);
--> statement-breakpoint
CREATE TABLE `lemmas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`strong_id` varchar(16) NOT NULL,
	`language` enum('hebrew','greek','aramaic') NOT NULL,
	`lemma` varchar(100) NOT NULL,
	`transliteration` varchar(100),
	`pronunciation` varchar(100),
	`definition` text NOT NULL,
	`root` varchar(16),
	`morphology` varchar(100),
	`hebrew_comparison` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `lemmas_id` PRIMARY KEY(`id`),
	CONSTRAINT `lemmas_strong_id_unique` UNIQUE(`strong_id`)
);
--> statement-breakpoint
CREATE TABLE `symbols` (
	`id` int AUTO_INCREMENT NOT NULL,
	`symbol_id` varchar(64) NOT NULL,
	`name` varchar(100) NOT NULL,
	`original_terms` text NOT NULL,
	`definition` text NOT NULL,
	`biblical_usage` text NOT NULL,
	`misinterpretations` text,
	`historical_context` text,
	`typology` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `symbols_id` PRIMARY KEY(`id`),
	CONSTRAINT `symbols_symbol_id_unique` UNIQUE(`symbol_id`)
);
--> statement-breakpoint
CREATE TABLE `translations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`verse_id` varchar(32) NOT NULL,
	`translation` varchar(16) NOT NULL,
	`language` varchar(16) NOT NULL,
	`text` text NOT NULL,
	`word_alignment` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `translations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_bookmarks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`verse_id` varchar(32) NOT NULL,
	`note` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_bookmarks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `verses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`verse_id` varchar(32) NOT NULL,
	`book` varchar(32) NOT NULL,
	`chapter` int NOT NULL,
	`verse` int NOT NULL,
	`language` enum('hebrew','greek','aramaic') NOT NULL,
	`text` text NOT NULL,
	`word_alignment` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `verses_id` PRIMARY KEY(`id`),
	CONSTRAINT `verses_verse_id_unique` UNIQUE(`verse_id`)
);
