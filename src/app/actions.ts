"use server";

import { db } from "@/db";
import { employees, probationPeriods, contracts, userPermissions } from "@/db/schema";
import { eq, and } from "drizzle-orm";
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
  directManager?: string;
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
      directManager: employees.directManager,
      startDate: probationPeriods.startDate,
      endDate: probationPeriods.endDate,
      durationMonths: probationPeriods.durationMonths,
      status: probationPeriods.status,
      taskPerformance: probationPeriods.taskPerformance,
      taskCompletionRate: probationPeriods.taskCompletionRate,
      taskNotes: probationPeriods.taskNotes,
      departmentEvaluation: probationPeriods.departmentEvaluation,
      supervisorEvaluation: probationPeriods.supervisorEvaluation,
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
    taskPerformance?: string;
    taskCompletionRate?: number;
    taskNotes?: string;
    departmentEvaluation?: string;
    supervisorEvaluation?: string;
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
      directManager: employees.directManager,
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

// ============ DELETE OPERATIONS ============

export async function deleteProbation(id: number) {
  await db.delete(probationPeriods).where(eq(probationPeriods.id, id));
  revalidatePath("/probation");
  revalidatePath("/");
}

export async function deleteContract(id: number) {
  await db.delete(contracts).where(eq(contracts.id, id));
  revalidatePath("/contracts");
  revalidatePath("/");
}

export async function deleteAllEmployees() {
  await db.delete(probationPeriods);
  await db.delete(contracts);
  await db.delete(employees);
  revalidatePath("/employees");
  revalidatePath("/probation");
  revalidatePath("/contracts");
  revalidatePath("/");
}

export async function deleteAllProbations() {
  await db.delete(probationPeriods);
  revalidatePath("/probation");
  revalidatePath("/");
}

export async function deleteAllContracts() {
  await db.delete(contracts);
  revalidatePath("/contracts");
  revalidatePath("/");
}

// ============ IMPORT DATA ============

export type ImportRow = {
  employeeCode: string;
  name: string;
  location?: string;
  department?: string;
  jobTitle?: string;
  directManager?: string;
  socialSecurityNumber?: string;
  hireDate: string;
  contractDuration?: number;
  contractStartDate: string;
  contractEndDate?: string;
  contractSequence?: number;
  gapStartDate?: string;
  gapEndDate?: string;
};

export async function importExcelData(rows: ImportRow[]) {
  const results = {
    employeesCreated: 0,
    contractsCreated: 0,
    errors: [] as string[],
  };

  // Track employees by code to handle gaps between contracts
  const employeeMap = new Map<string, number>();

  for (const row of rows) {
    try {
      // Validate required fields
      if (!row.employeeCode || !row.name || !row.hireDate) {
        results.errors.push(`Missing required fields for row: ${row.employeeCode || row.name}`);
        continue;
      }

      // Check if employee already exists
      let employeeId = employeeMap.get(row.employeeCode);
      
      if (!employeeId) {
        const existingEmployee = await db
          .select()
          .from(employees)
          .where(eq(employees.employeeNumber, row.employeeCode));

        if (existingEmployee.length > 0) {
          employeeId = existingEmployee[0].id;
          employeeMap.set(row.employeeCode, employeeId);
        } else {
          // Create new employee
          const insertResult = await db
            .insert(employees)
            .values({
              employeeNumber: row.employeeCode,
              name: row.name,
              location: row.location,
              department: row.department,
              position: row.jobTitle,
              directManager: row.directManager,
              socialSecurityNumber: row.socialSecurityNumber,
              hireDate: row.hireDate,
              status: "active",
            })
            .returning({ id: employees.id });

          employeeId = insertResult[0].id;
          employeeMap.set(row.employeeCode, employeeId);
          results.employeesCreated++;
        }
      }

      // Create contract if contract dates are provided
      if (row.contractStartDate) {
        const contractNumber = `${row.employeeCode}-${row.contractSequence || 1}`;
        
        await db.insert(contracts).values({
          employeeId,
          contractNumber,
          contractType: row.contractEndDate ? "fixed" : "indefinite",
          startDate: row.contractStartDate,
          endDate: row.contractEndDate,
          durationMonths: row.contractDuration,
          contractSequence: row.contractSequence || 1,
          status: row.contractEndDate && new Date(row.contractEndDate) < new Date() ? "expired" : "active",
        });
        results.contractsCreated++;
      }
    } catch (error) {
      results.errors.push(`Error processing row ${row.employeeCode}: ${error}`);
    }
  }

  revalidatePath("/employees");
  revalidatePath("/contracts");
  revalidatePath("/");

  return results;
}

// ============ USER PERMISSIONS ============

export async function getUserPermissions() {
  return db.select().from(userPermissions).orderBy(userPermissions.userName);
}

export async function createUserPermission(data: {
  userName: string;
  department?: string;
  canAddEmployees?: boolean;
  canEditEmployees?: boolean;
  canDeleteEmployees?: boolean;
  canAddProbations?: boolean;
  canEvaluateProbations?: boolean;
  canDeleteProbations?: boolean;
  canAddContracts?: boolean;
  canRenewContracts?: boolean;
  canDeleteContracts?: boolean;
  canImportData?: boolean;
}) {
  await db.insert(userPermissions).values(data);
  revalidatePath("/permissions");
}

export async function updateUserPermission(
  id: number,
  data: {
    userName?: string;
    department?: string;
    canAddEmployees?: boolean;
    canEditEmployees?: boolean;
    canDeleteEmployees?: boolean;
    canAddProbations?: boolean;
    canEvaluateProbations?: boolean;
    canDeleteProbations?: boolean;
    canAddContracts?: boolean;
    canRenewContracts?: boolean;
    canDeleteContracts?: boolean;
    canImportData?: boolean;
  }
) {
  await db.update(userPermissions).set(data).where(eq(userPermissions.id, id));
  revalidatePath("/permissions");
}

export async function deleteUserPermission(id: number) {
  await db.delete(userPermissions).where(eq(userPermissions.id, id));
  revalidatePath("/permissions");
}

// ============ GET EMPLOYEES BY DEPARTMENT (for user filtering) ============

export async function getEmployeesByDepartment(department: string) {
  return db
    .select()
    .from(employees)
    .where(eq(employees.department, department))
    .orderBy(employees.name);
}

export async function getProbationPeriodsByDepartment(department: string) {
  return db
    .select({
      id: probationPeriods.id,
      employeeId: probationPeriods.employeeId,
      employeeName: employees.name,
      employeeNumber: employees.employeeNumber,
      department: employees.department,
      position: employees.position,
      directManager: employees.directManager,
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
    .where(eq(employees.department, department))
    .orderBy(probationPeriods.endDate);
}

export async function getContractsByDepartment(department: string) {
  return db
    .select({
      id: contracts.id,
      employeeId: contracts.employeeId,
      employeeName: employees.name,
      employeeNumber: employees.employeeNumber,
      department: employees.department,
      directManager: employees.directManager,
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
    .where(eq(employees.department, department))
    .orderBy(contracts.endDate);
}
