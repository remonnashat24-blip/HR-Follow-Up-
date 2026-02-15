CREATE TABLE `contracts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`employee_id` integer NOT NULL,
	`contract_number` text NOT NULL,
	`contract_type` text NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text,
	`duration_months` integer,
	`salary` integer,
	`status` text DEFAULT 'active' NOT NULL,
	`renewal_notes` text,
	`created_at` integer,
	FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `contracts_contract_number_unique` ON `contracts` (`contract_number`);--> statement-breakpoint
CREATE TABLE `employees` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`employee_number` text NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`phone` text,
	`department` text,
	`position` text,
	`hire_date` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `employees_employee_number_unique` ON `employees` (`employee_number`);--> statement-breakpoint
CREATE TABLE `probation_periods` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`employee_id` integer NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`duration_months` integer DEFAULT 3 NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`evaluation_notes` text,
	`evaluation_date` text,
	`evaluated_by` text,
	`created_at` integer,
	FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action
);
