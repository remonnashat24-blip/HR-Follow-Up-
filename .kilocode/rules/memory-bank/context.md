# Active Context: Employee Management System

## Current State

**Application Status**: ✅ Deployed - Employee Probation & Contract Management System with Role-Based Access

The application is a full-featured Arabic RTL employee management system for tracking probation periods and contract renewals, with admin/user role-based permissions.

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

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Dashboard with stats & alerts | ✅ Ready |
| `src/app/employees/page.tsx` | Employee management | ✅ Ready |
| `src/app/probation/page.tsx` | Probation period tracking | ✅ Ready |
| `src/app/contracts/page.tsx` | Contract management & renewal | ✅ Ready |
| `src/app/actions.ts` | Server actions (all CRUD + delete) | ✅ Ready |
| `src/app/layout.tsx` | Root layout (Arabic RTL + AuthProvider) | ✅ Ready |
| `src/app/import/page.tsx` | Excel data import page | ✅ Ready |
| `src/db/schema.ts` | Database schema (3 tables) | ✅ Ready |
| `src/lib/auth-context.tsx` | Role-based auth context (admin/user) | ✅ Ready |
| `src/components/tables/EmployeeTable.tsx` | Employee table with delete buttons | ✅ Ready |
| `src/components/tables/ContractTable.tsx` | Contract table with delete + renew | ✅ Ready |
| `src/components/tables/ProbationTable.tsx` | Probation table with delete + evaluate | ✅ Ready |
| `src/components/ui/DeleteButtons.tsx` | DeleteButton + DeleteAllButton (admin only) | ✅ Ready |

## Database Schema

- **employees**: id, employeeNumber, name, email, phone, location, department, position, directManager, socialSecurityNumber, hireDate, status
- **probation_periods**: id, employeeId, startDate, endDate, durationMonths, status, evaluationNotes, evaluationDate, evaluatedBy
- **contracts**: id, employeeId, contractNumber, contractType, startDate, endDate, durationMonths, salary, contractSequence, status, renewalNotes

## Key Features

1. **Dashboard**: Overview stats, expiring probation alerts, expiring contract alerts
2. **Employee Management**: Add employees with full details, delete (admin only)
3. **Probation Tracking**: Create probation periods, evaluate (pass/fail/extend), track remaining days, delete (admin only)
4. **Contract Management**: Create contracts (fixed/indefinite), renew contracts, track expiry, delete (admin only)
5. **Role-Based Access**: Admin can delete records (individual + bulk), both roles can add/edit/view
6. **Excel Import**: Import employees and contracts from Excel files

## Role Permissions

| Action | Admin | End User |
|--------|-------|----------|
| View all data | ✅ | ✅ |
| Add employees/contracts/probation | ✅ | ✅ |
| Evaluate probation | ✅ | ✅ |
| Renew contracts | ✅ | ✅ |
| Delete individual records | ✅ | ❌ |
| Delete all data | ✅ | ❌ |
| Import data | ✅ | ✅ |

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| 2026-02-15 | Built complete employee probation & contract management system with Arabic RTL UI |
| 2026-02-15 | Added role-based auth, delete buttons (admin only), refactored pages to use client table components |
