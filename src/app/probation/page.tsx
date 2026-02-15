import { getProbationPeriods, getEmployees } from "@/app/actions";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AddProbationForm } from "@/components/forms/AddProbationForm";
import { EvaluateProbationForm } from "@/components/forms/EvaluateProbationForm";

function getDaysRemaining(endDate: string): { days: number; label: string; color: string } {
  const end = new Date(endDate);
  const today = new Date();
  const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diff < 0) return { days: diff, label: `متأخر ${Math.abs(diff)} يوم`, color: "text-red-600" };
  if (diff <= 7) return { days: diff, label: `${diff} أيام`, color: "text-red-600" };
  if (diff <= 30) return { days: diff, label: `${diff} يوم`, color: "text-yellow-600" };
  return { days: diff, label: `${diff} يوم`, color: "text-green-600" };
}

export default async function ProbationPage() {
  const [probations, employees] = await Promise.all([
    getProbationPeriods(),
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
          <h1 className="text-2xl font-bold text-gray-900">إدارة فترة الاختبار</h1>
          <p className="text-gray-500 mt-1">متابعة وتقييم فترات الاختبار للموظفين</p>
        </div>
        <AddProbationForm employees={employeeOptions} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {probations.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-4xl mb-3">⏳</p>
            <p className="text-gray-500 text-lg">لا توجد فترات اختبار</p>
            <p className="text-gray-400 text-sm mt-1">
              أضف فترة اختبار جديدة لموظف
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
                    القسم
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    تاريخ البداية
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    تاريخ النهاية
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    المدة
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                    المتبقي
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
                {probations.map((p) => {
                  const remaining = p.status === "active" ? getDaysRemaining(p.endDate) : null;
                  return (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium">{p.employeeName}</p>
                        <p className="text-xs text-gray-500">{p.employeeNumber}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {p.directManager || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {p.department || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{p.startDate}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{p.endDate}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {p.durationMonths} أشهر
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
                      <td className="px-4 py-3">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-4 py-3">
                        {p.status === "active" ? (
                          <EvaluateProbationForm
                            probationId={p.id}
                            employeeName={p.employeeName}
                          />
                        ) : (
                          <span className="text-xs text-gray-400">
                            {p.evaluatedBy && `بواسطة: ${p.evaluatedBy}`}
                          </span>
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
