const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  passed: "bg-blue-100 text-blue-800",
  failed: "bg-red-100 text-red-800",
  extended: "bg-yellow-100 text-yellow-800",
  expired: "bg-gray-100 text-gray-800",
  renewed: "bg-purple-100 text-purple-800",
  terminated: "bg-red-100 text-red-800",
  inactive: "bg-gray-100 text-gray-800",
  fixed: "bg-blue-100 text-blue-800",
  indefinite: "bg-green-100 text-green-800",
};

const statusLabels: Record<string, string> = {
  active: "نشط",
  passed: "اجتاز",
  failed: "لم يجتز",
  extended: "ممدد",
  expired: "منتهي",
  renewed: "مجدد",
  terminated: "منهي",
  inactive: "غير نشط",
  fixed: "محدد المدة",
  indefinite: "غير محدد المدة",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        statusColors[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {statusLabels[status] || status}
    </span>
  );
}
