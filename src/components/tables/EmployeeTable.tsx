"use client";

import { StatusBadge } from "@/components/ui/StatusBadge";
import { DeleteButton, DeleteAllButton } from "@/components/ui/DeleteButtons";
import { deleteEmployee, deleteAllEmployees } from "@/app/actions";
import { useAuth } from "@/lib/auth-context";

type Employee = {
  id: number;
  employeeNumber: string;
  name: string;
  email: string | null;
  phone: string | null;
  location: string | null;
  department: string | null;
  position: string | null;
  directManager: string | null;
  socialSecurityNumber: string | null;
  hireDate: string;
  status: string;
  createdAt: Date | null;
};

export function EmployeeTable({ employees }: { employees: Employee[] }) {
  const { isAdmin, permissions } = useAuth();
  
  // Filter employees based on user permissions (for non-admin users)
  const filteredEmployees = !isAdmin && permissions.department 
    ? employees.filter(e => e.department === permissions.department)
    : employees;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div>
          <span className="text-sm text-gray-500">{filteredEmployees.length} موظف</span>
          {!isAdmin && permissions.department && (
            <span className="text-sm text-blue-600 mr-2">
              (القسم: {permissions.department})
            </span>
          )}
        </div>
        {isAdmin && (
          <DeleteAllButton
            onDeleteAll={async () => {
              await deleteAllEmployees();
            }}
            entityName="الموظفين"
          />
        )}
      </div>
      {filteredEmployees.length === 0 ? (
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
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmployees.map((emp) => (
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
                  <td className="px-4 py-3">
                    {isAdmin && (
                      <DeleteButton
                        onDelete={async () => {
                          await deleteEmployee(emp.id);
                        }}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
