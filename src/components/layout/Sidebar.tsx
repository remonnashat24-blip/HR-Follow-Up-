"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";

const navItems = [
  { href: "/", label: "لوحة التحكم", icon: "📊" },
  { href: "/employees", label: "الموظفين", icon: "👥" },
  { href: "/probation", label: "فترة الاختبار", icon: "⏳" },
  { href: "/contracts", label: "العقود", icon: "📄" },
  { href: "/import", label: "استيراد البيانات", icon: "📥" },
];

const adminNavItems = [
  { href: "/permissions", label: "الصلاحيات", icon: "🔐" },
];

// Common departments for selection
const departments = [
  "الموارد البشرية",
  "المالية",
  "التقنية",
  "التسويق",
  "المبيعات",
  "العمليات",
  "خدمة العملاء",
  "الإدارة",
];

export function Sidebar() {
  const pathname = usePathname();
  const { role, setRole, isAdmin, userName, setUserName, permissions, setPermissions } = useAuth();
  const [showUserSettings, setShowUserSettings] = useState(false);

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
        {isAdmin && (
          <>
            <div className="border-t border-gray-200 my-2" />
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-red-50 text-red-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </>
        )}
      </nav>
      <div className="p-4 border-t border-gray-200 space-y-3">
        {/* Role Switcher */}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs font-medium text-gray-500 mb-2">الصلاحية</p>
          <div className="flex gap-1">
            <button
              onClick={() => setRole("admin")}
              className={`flex-1 text-xs px-2 py-1.5 rounded-md font-medium transition-colors ${
                isAdmin
                  ? "bg-red-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              🔑 مدير
            </button>
            <button
              onClick={() => setRole("user")}
              className={`flex-1 text-xs px-2 py-1.5 rounded-md font-medium transition-colors ${
                !isAdmin
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              👤 مستخدم
            </button>
          </div>
        </div>

        {/* User Settings - for non-admin users */}
        {!isAdmin && (
          <div className="bg-blue-50 rounded-lg p-3">
            <button
              onClick={() => setShowUserSettings(!showUserSettings)}
              className="w-full text-xs font-medium text-blue-700 mb-2 flex items-center justify-between"
            >
              <span>⚙️ إعدادات المستخدم</span>
              <span>{showUserSettings ? "▲" : "▼"}</span>
            </button>
            {showUserSettings && (
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">اسم المستخدم</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded px-2 py-1"
                    placeholder="أدخل اسمك"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">القسم</label>
                  <select
                    value={permissions.department || ""}
                    onChange={(e) => setPermissions({ ...permissions, department: e.target.value || null })}
                    className="w-full text-xs border border-gray-200 rounded px-2 py-1"
                  >
                    <option value="">الكل (عام)</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        )}
        <p className="text-xs text-gray-400 text-center">© 2026 نظام إدارة الموظفين</p>
      </div>
    </aside>
  );
}
