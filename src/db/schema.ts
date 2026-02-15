import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const employees = sqliteTable("employees", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  employeeNumber: text("employee_number").notNull().unique(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  department: text("department"),
  position: text("position"),
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
  status: text("status").notNull().default("active"), // active, expired, renewed, terminated
  renewalNotes: text("renewal_notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
