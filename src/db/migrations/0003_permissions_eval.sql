-- Migration: Add user_permissions table and performance evaluation fields
-- Created: 2026-02-15

-- Create user_permissions table
CREATE TABLE IF NOT EXISTS `user_permissions` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  `user_name` TEXT NOT NULL,
  `department` TEXT,
  `can_add_employees` INTEGER DEFAULT 1,
  `can_edit_employees` INTEGER DEFAULT 1,
  `can_delete_employees` INTEGER DEFAULT 0,
  `can_add_probations` INTEGER DEFAULT 1,
  `can_evaluate_probations` INTEGER DEFAULT 1,
  `can_delete_probations` INTEGER DEFAULT 0,
  `can_add_contracts` INTEGER DEFAULT 1,
  `can_renew_contracts` INTEGER DEFAULT 1,
  `can_delete_contracts` INTEGER DEFAULT 0,
  `can_import_data` INTEGER DEFAULT 1,
  `created_at` INTEGER
);

-- Add performance evaluation fields to probation_periods
ALTER TABLE `probation_periods` ADD COLUMN `task_performance` TEXT;
ALTER TABLE `probation_periods` ADD COLUMN `task_completion_rate` INTEGER;
ALTER TABLE `probation_periods` ADD COLUMN `assigned_tasks` TEXT;
ALTER TABLE `probation_periods` ADD COLUMN `task_notes` TEXT;
ALTER TABLE `probation_periods` ADD COLUMN `department_evaluation` TEXT;
ALTER TABLE `probation_periods` ADD COLUMN `supervisor_evaluation` TEXT;
