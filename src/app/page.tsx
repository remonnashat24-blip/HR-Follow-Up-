import { getDashboardStats, getUrgentProbations, getUrgentContracts } from "./actions";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import Link from "next/link";

export default async function DashboardPage() {
  const [stats, urgentProbations, urgentContracts] = await Promise.all([
    getDashboardStats(),
    getUrgentProbations(),
    getUrgentContracts(),
  ]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
        <p className="text-gray-500 mt-1">نظرة عامة على حالة الموظفين والعقود</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        <StatCard
          title="إجمالي الموظفين"
          value={stats.totalEmployees}
          icon="👥"
          color="blue"
        />
        <StatCard
          title="فترات اختبار نشطة"
          value={stats.activeProbations}
          icon="⏳"
          color="yellow"
        />
        <StatCard
          title="اختبار ينتهي قريباً"
          value={stats.expiringProbations}
          icon="⚠️"
          color="red"
          subtitle="خلال 30 يوم"
        />
        <StatCard
          title="عقود نشطة"
          value={stats.activeContracts}
          icon="📄"
          color="green"
        />
        <StatCard
          title="عقود تنتهي قريباً"
          value={stats.expiringContracts}
          icon="🔔"
          color="red"
          subtitle="خلال 30 يوم"
        />
      </div>

      {/* Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Probation Alerts */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">⏳ فترات اختبار تنتهي قريباً</h2>
            <Link href="/probation" className="text-sm text-primary hover:underline">
              عرض الكل
            </Link>
          </div>
          <div className="p-4">
            {urgentProbations.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">
                لا توجد فترات اختبار تنتهي قريباً
              </p>
            ) : (
              <div className="space-y-3">
                {urgentProbations.slice(0, 5).map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-100"
                  >
                    <div>
                      <p className="font-medium text-sm">{p.employeeName}</p>
                      <p className="text-xs text-gray-500">{p.department}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-yellow-700">{p.endDate}</p>
                      <StatusBadge status={p.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contract Alerts */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">📄 عقود تنتهي قريباً</h2>
            <Link href="/contracts" className="text-sm text-primary hover:underline">
              عرض الكل
            </Link>
          </div>
          <div className="p-4">
            {urgentContracts.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">
                لا توجد عقود تنتهي قريباً
              </p>
            ) : (
              <div className="space-y-3">
                {urgentContracts.slice(0, 5).map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100"
                  >
                    <div>
                      <p className="font-medium text-sm">{c.employeeName}</p>
                      <p className="text-xs text-gray-500">
                        {c.contractNumber} - {c.department}
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-red-700">{c.endDate}</p>
                      <StatusBadge status={c.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
