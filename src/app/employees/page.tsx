import { getEmployees } from "@/app/actions";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AddEmployeeForm } from "@/components/forms/AddEmployeeForm";

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

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {employees.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-4xl mb-3">👥</p>
            <p className="text-gray-500 text-lg">لا يوجد موظفين بعد</p>
            <p className="text-gray-400 text-sm mt-1">
              ابدأ بإضافة موظف جديد باستخدام الزر أعلاه
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    رقم الموظف
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    الاسم
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    القسم
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    المنصب
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    المدير المباشر
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    تاريخ التعيين
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    الحالة
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-mono">{emp.employeeNumber}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium">{emp.name}</p>
                        {emp.email && (
                          <p className="text-xs text-gray-500">{emp.email}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {emp.department || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {emp.position || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {emp.directManager || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{emp.hireDate}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={emp.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
