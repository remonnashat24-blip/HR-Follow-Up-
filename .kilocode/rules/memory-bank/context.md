# Active Context: Employee Management System

## Current State

**Application Status**: ✅ Deployed - Employee Probation & Contract Management System with Role-Based Access & Department Permissions

The application is a full-featured Arabic RTL employee management system for tracking probation periods and contract renewals, with admin/user role-based permissions and department-based access control.

## Recently Completed

- [x] Database setup with Drizzle ORM + SQLite (employees, probation_periods, contracts tables)
- [x] Server actions for all CRUD operations
- [x] Dashboard with stats cards and urgent alerts (expiring probations & contracts within 30 days)
- [x] Employees management page (add, view employees)
- [x] Probation tracking page (add probation, evaluate with pass/fail/extend)
- [x] Contract management page (add contracts, renew fixed-term contracts)
- [x] Arabic RTL interface with sidebar navigation
- [x] Shared UI components (StatusBadge, StatCard)
- [x] Modal forms for all data entry
- [x] TypeScript strict mode passing
- [x] ESLint passing
- [x] Excel import functionality with new fields (location, socialSecurityNumber, contractSequence)
- [x] Import page for uploading employee and contract data from Excel files
- [x] Direct Manager field added to employees table and import
- [x] Downloadable Excel template on import page
- [x] Direct Manager column added to Employees, Contracts, and Probation pages
- [x] Role-based auth system (admin vs end-user) using React context + localStorage + useSyncExternalStore
- [x] Role switcher in sidebar (admin/user toggle)
- [x] Delete individual record buttons (admin only) on Employees, Contracts, and Probation pages
- [x] Delete all data buttons (admin only) with confirmation modal on all data pages
- [x] Server actions for delete operations (deleteEmployee, deleteProbation, deleteContract, deleteAllEmployees, deleteAllProbations, deleteAllContracts)
- [x] Client table components (EmployeeTable, ContractTable, ProbationTable) for interactive features
- [x] Contract renewal form accessible to both admin and end users
- [x] Performance evaluation form for probation accessible to both admin and end users
- [x] User permissions management panel for admins ([/permissions](/src/app/permissions/page.tsx))
- [x] Department-based permissions system - users can only see data from their assigned department
- [x] Detailed probation evaluation form with task performance, department & supervisor evaluation
- [x] User settings in sidebar - users can set their name and department
- [x] Separate admin and user views with role-based filtering
- [x] Fixed auth context SSR issues - created providers.tsx client wrapper component
- [x] Fixed client-side runtime errors with useSyncExternalStore and localStorage access

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Dashboard with stats & alerts | ✅ Ready |
| `src/app/employees/page.tsx` | Employee management | ✅ Ready |
| `src/app/probation/page.tsx` | Probation period tracking | ✅ Ready |
| `src/app/contracts/page.tsx` | Contract management & renewal | ✅ Ready |
| `src/app/import/page.tsx` | Excel data import page | ✅ Ready |
| `src/app/permissions/page.tsx` | User permissions management (admin only) | ✅ Ready |
| `src/app/actions.ts` | Server actions (all CRUD + delete + permissions) | ✅ Ready |
| `src/app/layout.tsx` | Root layout (Arabic RTL + AuthProvider) | ✅ Ready |
| `src/db/schema.ts` | Database schema (4 tables: employees, probation_periods, contracts, user_permissions) | ✅ Ready |
| `src/lib/auth-context.tsx` | Role-based auth context with permissions | ✅ Ready |
| `src/components/tables/EmployeeTable.tsx` | Employee table with role-based filtering | ✅ Ready |
| `src/components/tables/ContractTable.tsx` | Contract table with role-based filtering | ✅ Ready |
| `src/components/tables/ProbationTable.tsx` | Probation table with role-based filtering | ✅ Ready |
| `src/components/ui/DeleteButtons.tsx` | DeleteButton + DeleteAllButton (admin only) | ✅ Ready |
| `src/components/forms/EvaluateProbationForm.tsx` | Detailed probation evaluation with task performance | ✅ Ready |

## Database Schema

- **employees**: id, employeeNumber, name, email, phone, location, department, position, directManager, socialSecurityNumber, hireDate, status
- **probation_periods**: id, employeeId, startDate, endDate, durationMonths, status, taskPerformance, taskCompletionRate, assignedTasks, taskNotes, departmentEvaluation, supervisorEvaluation, evaluationNotes, evaluationDate, evaluatedBy
- **contracts**: id, employeeId, contractNumber, contractType, startDate, endDate, durationMonths, salary, contractSequence, status, renewalNotes
- **user_permissions**: id, userName, department, canAddEmployees, canEditEmployees, canDeleteEmployees, canAddProbations, canEvaluateProbations, canDeleteProbations, canAddContracts, canRenewContracts, canDeleteContracts, canImportData

## Key Features

1. **Dashboard**: Overview stats, expiring probation alerts, expiring contract alerts
2. **Employee Management**: Add employees with full details, delete (admin only)
3. **Probation Tracking**: Create probation periods, evaluate (pass/fail/extend), track remaining days, detailed performance evaluation with task assessment
4. **Contract Management**: Create contracts (fixed/indefinite), renew contracts, track expiry, delete (admin only)
5. **Role-Based Access**: Admin has full access, end users have filtered access based on department
6. **Department-Based Permissions**: Non-admin users can only see data from their assigned department
7. **Excel Import**: Import employees and contracts from Excel files
8. **Permissions Management**: Admin can manage user permissions per department

## Role Permissions

| Action | Admin | End User |
|--------|-------|----------|
| View all data (all departments) | ✅ | ❌ |
| View department data only | ✅ | ✅ (if assigned) |
| Add employees/contracts/probation | ✅ | ✅ (based on permissions) |
| Evaluate probation | ✅ | ✅ (based on permissions) |
| Renew contracts | ✅ | ✅ (based on permissions) |
| Delete individual records | ✅ | ❌ |
| Delete all data | ✅ | ❌ |
| Import data | ✅ | ✅ (based on permissions) |
| Manage user permissions | ✅ | ❌ |

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| 2026-02-15 | Built complete employee probation & contract management system with Arabic RTL UI |
| 2026-02-15 | Added role-based auth, delete buttons (admin only), refactored pages to use client table components |
| 2026-02-15 | Added user permissions panel, department-based filtering, detailed probation evaluation with task performance |
| 2026-02-15 | Fixed auth context SSR issues and client-side runtime errors with useSyncExternalStore and localStorage access |
