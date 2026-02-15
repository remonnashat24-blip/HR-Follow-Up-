"use client";

import { StatusBadge } from "@/components/ui/StatusBadge";
import { DeleteButton, DeleteAllButton } from "@/components/ui/DeleteButtons";
import { deleteContract, deleteAllContracts } from "@/app/actions";
import { RenewContractForm } from "@/components/forms/RenewContractForm";
import { useAuth } from "@/lib/auth-context";

type Contract = {
  id: number;
  employeeId: number;
  employeeName: string | null;
  employeeNumber: string | null;
  department: string | null;
  directManager: string | null;
  contractNumber: string;
  contractType: string;
  startDate: string;
  endDate: string | null;
  durationMonths: number | null;
  salary: number | null;
  status: string;
  renewalNotes: string | null;
};

function getDaysRemaining(endDate: string | null): { days: number; label: string; color: string } | null {
  if (!endDate) return null;
  const end = new Date(endDate);
  const today = new Date();
  const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diff < 0) return { days: diff, label: `متأخر ${Math.abs(diff)} يوم`, color: "text-red-600" };
  if (diff <= 30) return { days: diff, label: `${diff} يوم`, color: "text-red-600" };
  if (diff <= 90) return { days: diff, label: `${diff} يوم`, color: "text-yellow-600" };
  return { days: diff, label: `${diff} يوم`, color: "text-green-600" };
}

export function ContractTable({ contracts }: { contracts: Contract[] }) {
  const { isAdmin, permissions } = useAuth();
  
  // Filter contracts based on user permissions (for non-admin users)
  const filteredContracts = !isAdmin && permissions.department 
    ? contracts.filter(c => c.department === permissions.department)
    : contracts;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div>
          <span className="text-sm text-gray-500">{filteredContracts.length} عقد</span>
          {!isAdmin && permissions.department && (
            <span className="text-sm text-blue-600 mr-2">
              (القسم: {permissions.department})
            </span>
          )}
        </div>
        {isAdmin && (
          <DeleteAllButton
            onDeleteAll={async () => {
              await deleteAllContracts();
            }}
            entityName="العقود"
          />
        )}
      </div>
      {filteredContracts.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-4xl mb-3">📄</p>
          <p className="text-gray-500 text-lg">لا توجد عقود بعد</p>
          <p className="text-gray-400 text-sm mt-1">أضف عقد جديد لموظف</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  الموظف
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  المدير المباشر
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  القسم
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  رقم العقد
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  النوع
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  تاريخ البداية
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  تاريخ النهاية
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  المتبقي
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  الراتب
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
              {filteredContracts.map((c) => {
                const remaining = c.status === "active" ? getDaysRemaining(c.endDate) : null;
                return (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium">{c.employeeName}</p>
                      <p className="text-xs text-gray-500">{c.employeeNumber}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {c.directManager || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {c.department || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono">{c.contractNumber}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={c.contractType} />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{c.startDate}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {c.endDate || "غير محدد"}
                    </td>
                    <td className="px-4 py-3">
                      {remaining ? (
                        <span className={`text-sm font-medium ${remaining.color}`}>
                          {remaining.label}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {c.salary ? `${c.salary.toLocaleString()} ر.س` : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 items-center">
                        {c.status === "active" && c.contractType === "fixed" && permissions.canRenewContracts && (
                          <RenewContractForm
                            contractId={c.id}
                            employeeId={c.employeeId}
                            employeeName={c.employeeName}
                            currentEndDate={c.endDate}
                          />
                        )}
                        {isAdmin && (
                          <DeleteButton
                            onDelete={async () => {
                              await deleteContract(c.id);
                            }}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
