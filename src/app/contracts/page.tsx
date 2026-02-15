import { getContracts, getEmployees } from "@/app/actions";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AddContractForm } from "@/components/forms/AddContractForm";
import { RenewContractForm } from "@/components/forms/RenewContractForm";

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

export default async function ContractsPage() {
  const [contracts, employees] = await Promise.all([
    getContracts(),
    getEmployees(),
  ]);

  const employeeOptions = employees.map((e) => ({
    id: e.id,
    name: e.name,
    employeeNumber: e.employeeNumber,
  }));

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة العقود</h1>
          <p className="text-gray-500 mt-1">عرض وإدارة وتجديد عقود الموظفين</p>
        </div>
        <AddContractForm employees={employeeOptions} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {contracts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-4xl mb-3">📄</p>
            <p className="text-gray-500 text-lg">لا توجد عقود بعد</p>
            <p className="text-gray-400 text-sm mt-1">
              أضف عقد جديد لموظف
            </p>
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
                {contracts.map((c) => {
                  const remaining = c.status === "active" ? getDaysRemaining(c.endDate) : null;
                  return (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium">{c.employeeName}</p>
                        <p className="text-xs text-gray-500">{c.department}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {c.directManager || "-"}
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
                        {c.status === "active" && c.contractType === "fixed" && (
                          <RenewContractForm
                            contractId={c.id}
                            employeeId={c.employeeId}
                            employeeName={c.employeeName}
                            currentEndDate={c.endDate}
                          />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
