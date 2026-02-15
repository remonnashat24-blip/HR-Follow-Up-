import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const userPermissions = sqliteTable("user_permissions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userName: text("user_name").notNull(),
  department: text("department"), // null means all departments
  canAddEmployees: integer("can_add_employees", { mode: "boolean" }).default(true),
  canEditEmployees: integer("can_edit_employees", { mode: "boolean" }).default(true),
  canDeleteEmployees: integer("can_delete_employees", { mode: "boolean" }).default(false),
  canAddProbations: integer("can_add_probations", { mode: "boolean" }).default(true),
  canEvaluateProbations: integer("can_evaluate_probations", { mode: "boolean" }).default(true),
  canDeleteProbations: integer("can_delete_probations", { mode: "boolean" }).default(false),
  canAddContracts: integer("can_add_contracts", { mode: "boolean" }).default(true),
  canRenewContracts: integer("can_renew_contracts", { mode: "boolean" }).default(true),
  canDeleteContracts: integer("can_delete_contracts", { mode: "boolean" }).default(false),
  canImportData: integer("can_import_data", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const employees = sqliteTable("employees", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  employeeNumber: text("employee_number").notNull().unique(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  location: text("location"),
  department: text("department"),
  position: text("position"),
  directManager: text("direct_manager"),
  socialSecurityNumber: text("social_security_number"),
  hireDate: text("hire_date").notNull(),
  status: text("status").notNull().default("active"), // active, inactive, terminated
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const probationPeriods = sqliteTable("probation_periods", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  employeeId: integer("employee_id")
    .notNull()
    .references(() => employees.id),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  durationMonths: integer("duration_months").notNull().default(3),
  status: text("status").notNull().default("active"), // active, passed, failed, extended
  // Performance evaluation fields
  taskPerformance: text("task_performance"), // excellent, good, needs_improvement
  taskCompletionRate: integer("task_completion_rate"), // percentage
  assignedTasks: text("assigned_tasks"), // JSON array of assigned tasks
  taskNotes: text("task_notes"), // notes about task performance
  departmentEvaluation: text("department_evaluation"), // department head evaluation
  supervisorEvaluation: text("supervisor_evaluation"), // direct supervisor evaluation
  evaluationNotes: text("evaluation_notes"),
  evaluationDate: text("evaluation_date"),
  evaluatedBy: text("evaluated_by"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const contracts = sqliteTable("contracts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  employeeId: integer("employee_id")
    .notNull()
    .references(() => employees.id),
  contractNumber: text("contract_number").notNull().unique(),
  contractType: text("contract_type").notNull(), // fixed, indefinite
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  durationMonths: integer("duration_months"),
  salary: integer("salary"),
  contractSequence: integer("contract_sequence").default(1),
  status: text("status").notNull().default("active"), // active, expired, renewed, terminated
  renewalNotes: text("renewal_notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
