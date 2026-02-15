import { getEmployees } from "@/app/actions";
import { AddEmployeeForm } from "@/components/forms/AddEmployeeForm";
import { EmployeeTable } from "@/components/tables/EmployeeTable";

export default async function EmployeesPage() {
  const employees = await getEmployees();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الموظفين</h1>
          <p className="text-gray-500 mt-1">عرض وإدارة بيانات الموظفين</p>
        </div>
        <AddEmployeeForm />
      </div>

      <EmployeeTable employees={employees} />
    </div>
  );
}
