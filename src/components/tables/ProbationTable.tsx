"use client";

import { StatusBadge } from "@/components/ui/StatusBadge";
import { DeleteButton, DeleteAllButton } from "@/components/ui/DeleteButtons";
import { deleteProbation, deleteAllProbations } from "@/app/actions";
import { EvaluateProbationForm } from "@/components/forms/EvaluateProbationForm";
import { useAuth } from "@/lib/auth-context";

type Probation = {
  id: number;
  employeeId: number;
  employeeName: string | null;
  employeeNumber: string | null;
  department: string | null;
  position: string | null;
  directManager: string | null;
  startDate: string;
  endDate: string;
  durationMonths: number;
  status: string;
  evaluationNotes: string | null;
  evaluationDate: string | null;
  evaluatedBy: string | null;
  taskPerformance: string | null;
  taskCompletionRate: number | null;
  departmentEvaluation: string | null;
  supervisorEvaluation: string | null;
};

function getDaysRemaining(endDate: string): { days: number; label: string; color: string } {
  const end = new Date(endDate);
  const today = new Date();
  const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diff < 0) return { days: diff, label: `متأخر ${Math.abs(diff)} يوم`, color: "text-red-600" };
  if (diff <= 7) return { days: diff, label: `${diff} أيام`, color: "text-red-600" };
  if (diff <= 30) return { days: diff, label: `${diff} يوم`, color: "text-yellow-600" };
  return { days: diff, label: `${diff} يوم`, color: "text-green-600" };
}

export function ProbationTable({ 
  probations, 
  showDepartmentFilter = false 
}: { 
  probations: Probation[]; 
  showDepartmentFilter?: boolean;
}) {
  const { isAdmin, permissions } = useAuth();
  
  // Filter probations based on user permissions (for non-admin users)
  const filteredProbations = !isAdmin && permissions.department 
    ? probations.filter(p => p.department === permissions.department)
    : probations;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div>
          <span className="text-sm text-gray-500">{filteredProbations.length} فترة اختبار</span>
          {!isAdmin && permissions.department && (
            <span className="text-sm text-blue-600 mr-2">
              (القسم: {permissions.department})
            </span>
          )}
        </div>
        {isAdmin && (
          <DeleteAllButton
            onDeleteAll={async () => {
              await deleteAllProbations();
            }}
            entityName="فترات الاختبار"
          />
        )}
      </div>
      {filteredProbations.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-4xl mb-3">⏳</p>
          <p className="text-gray-500 text-lg">لا توجد فترات اختبار</p>
          <p className="text-gray-400 text-sm mt-1">أضف فترة اختبار جديدة لموظف</p>
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
              {filteredProbations.map((p) => {
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
                      <div className="flex gap-1 items-center">
                        {p.status === "active" && permissions.canEvaluateProbations && (
                          <EvaluateProbationForm
                            probationId={p.id}
                            employeeName={p.employeeName}
                            department={p.department}
                            directManager={p.directManager}
                          />
                        )}
                        {p.status !== "active" && (
                          <span className="text-xs text-gray-400">
                            {p.evaluatedBy && `بواسطة: ${p.evaluatedBy}`}
                          </span>
                        )}
                        {isAdmin && (
                          <DeleteButton
                            onDelete={async () => {
                              await deleteProbation(p.id);
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
