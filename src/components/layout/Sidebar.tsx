"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "لوحة التحكم", icon: "📊" },
  { href: "/employees", label: "الموظفين", icon: "👥" },
  { href: "/probation", label: "فترة الاختبار", icon: "⏳" },
  { href: "/contracts", label: "العقود", icon: "📄" },
  { href: "/import", label: "استيراد البيانات", icon: "📥" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-l border-gray-200 shadow-sm flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary">نظام إدارة الموظفين</h1>
        <p className="text-sm text-gray-500 mt-1">إدارة الاختبار والعقود</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-primary"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-400 text-center">© 2026 نظام إدارة الموظفين</p>
      </div>
    </aside>
  );
}
