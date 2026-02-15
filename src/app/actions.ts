"use server";

import { db } from "@/db";
import { employees, probationPeriods, contracts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// ============ EMPLOYEES ============

export async function getEmployees() {
  return db.select().from(employees).orderBy(employees.name);
}

export async function getEmployee(id: number) {
  const result = await db.select().from(employees).where(eq(employees.id, id));
  return result[0] || null;
}

export async function createEmployee(data: {
  employeeNumber: string;
  name: string;
  email?: string;
  phone?: string;
  department?: string;
  position?: string;
  hireDate: string;
}) {
  await db.insert(employees).values(data);
  revalidatePath("/employees");
  revalidatePath("/");
}

export async function updateEmployee(
  id: number,
  data: {
    name?: string;
    email?: string;
    phone?: string;
    department?: string;
    position?: string;
    status?: string;
  }
) {
  await db.update(employees).set(data).where(eq(employees.id, id));
  revalidatePath("/employees");
  revalidatePath("/");
}

export async function deleteEmployee(id: number) {
  await db.delete(employees).where(eq(employees.id, id));
  revalidatePath("/employees");
  revalidatePath("/");
}

// ============ PROBATION PERIODS ============

export async function getProbationPeriods() {
  return db
    .select({
      id: probationPeriods.id,
      employeeId: probationPeriods.employeeId,
      employeeName: employees.name,
      employeeNumber: employees.employeeNumber,
      department: employees.department,
      position: employees.position,
      startDate: probationPeriods.startDate,
      endDate: probationPeriods.endDate,
      durationMonths: probationPeriods.durationMonths,
      status: probationPeriods.status,
      evaluationNotes: probationPeriods.evaluationNotes,
      evaluationDate: probationPeriods.evaluationDate,
      evaluatedBy: probationPeriods.evaluatedBy,
    })
    .from(probationPeriods)
    .leftJoin(employees, eq(probationPeriods.employeeId, employees.id))
    .orderBy(probationPeriods.endDate);
}

export async function createProbation(data: {
  employeeId: number;
  startDate: string;
  endDate: string;
  durationMonths: number;
}) {
  await db.insert(probationPeriods).values(data);
  revalidatePath("/probation");
  revalidatePath("/");
}

export async function updateProbation(
  id: number,
  data: {
    status?: string;
    evaluationNotes?: string;
    evaluationDate?: string;
    evaluatedBy?: string;
    endDate?: string;
  }
) {
  await db.update(probationPeriods).set(data).where(eq(probationPeriods.id, id));
  revalidatePath("/probation");
  revalidatePath("/");
}

// ============ CONTRACTS ============

export async function getContracts() {
  return db
    .select({
      id: contracts.id,
      employeeId: contracts.employeeId,
      employeeName: employees.name,
      employeeNumber: employees.employeeNumber,
      department: employees.department,
      contractNumber: contracts.contractNumber,
      contractType: contracts.contractType,
      startDate: contracts.startDate,
      endDate: contracts.endDate,
      durationMonths: contracts.durationMonths,
      salary: contracts.salary,
      status: contracts.status,
      renewalNotes: contracts.renewalNotes,
    })
    .from(contracts)
    .leftJoin(employees, eq(contracts.employeeId, employees.id))
    .orderBy(contracts.endDate);
}

export async function createContract(data: {
  employeeId: number;
  contractNumber: string;
  contractType: string;
  startDate: string;
  endDate?: string;
  durationMonths?: number;
  salary?: number;
}) {
  await db.insert(contracts).values(data);
  revalidatePath("/contracts");
  revalidatePath("/");
}

export async function updateContract(
  id: number,
  data: {
    status?: string;
    renewalNotes?: string;
    endDate?: string;
  }
) {
  await db.update(contracts).set(data).where(eq(contracts.id, id));
  revalidatePath("/contracts");
  revalidatePath("/");
}

export async function renewContract(
  oldContractId: number,
  newContract: {
    employeeId: number;
    contractNumber: string;
    contractType: string;
    startDate: string;
    endDate?: string;
    durationMonths?: number;
    salary?: number;
  }
) {
  await db
    .update(contracts)
    .set({ status: "renewed" })
    .where(eq(contracts.id, oldContractId));
  await db.insert(contracts).values(newContract);
  revalidatePath("/contracts");
  revalidatePath("/");
}

// ============ DASHBOARD ============

function getDateRanges() {
  const today = new Date().toISOString().split("T")[0];
  const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  return { today, thirtyDaysFromNow };
}

export async function getDashboardStats() {
  const allEmployees = await db.select().from(employees);
  const allProbations = await db.select().from(probationPeriods);
  const allContracts = await db.select().from(contracts);

  const { today, thirtyDaysFromNow } = getDateRanges();

  const activeProbations = allProbations.filter((p) => p.status === "active");
  const expiringProbations = activeProbations.filter(
    (p) => p.endDate <= thirtyDaysFromNow && p.endDate >= today
  );

  const activeContracts = allContracts.filter((c) => c.status === "active");
  const expiringContracts = activeContracts.filter(
    (c) => c.endDate && c.endDate <= thirtyDaysFromNow && c.endDate >= today
  );

  return {
    totalEmployees: allEmployees.filter((e) => e.status === "active").length,
    activeProbations: activeProbations.length,
    expiringProbations: expiringProbations.length,
    activeContracts: activeContracts.length,
    expiringContracts: expiringContracts.length,
  };
}

export async function getUrgentProbations() {
  const probations = await getProbationPeriods();
  const { today, thirtyDaysFromNow } = getDateRanges();
  return probations.filter(
    (p) => p.status === "active" && p.endDate <= thirtyDaysFromNow && p.endDate >= today
  );
}

export async function getUrgentContracts() {
  const allContracts = await getContracts();
  const { today, thirtyDaysFromNow } = getDateRanges();
  return allContracts.filter(
    (c) => c.status === "active" && c.endDate && c.endDate <= thirtyDaysFromNow && c.endDate >= today
  );
}
