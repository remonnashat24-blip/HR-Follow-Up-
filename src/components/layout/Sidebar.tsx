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
  const {
    role,
    setRole,
    isAdmin,
    userName,
    setUserName,
    permissions,
    setPermissions,
  } = useAuth();

  const [showUserSettings, setShowUserSettings] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const isActiveRoute = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-white border-l border-gray-200 shadow-sm flex flex-col transition-all duration-300`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        {!collapsed && (
          <div>
            <h1 className="text-lg font-bold text-blue-700">
              نظام إدارة الموظفين
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              إدارة الاختبار والعقود
            </p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          {collapsed ? "➡️" : "⬅️"}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = isActiveRoute(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-100 text-blue-700 border-r-4 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}

        {isAdmin && (
          <>
            <div className="border-t border-gray-200 my-2" />
            {adminNavItems.map((item) => {
              const isActive = isActiveRoute(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-red-100 text-red-700 border-r-4 border-red-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200 space-y-3">
          {/* Role Switcher */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs font-medium text-gray-500 mb-2">
              الصلاحية الحالية
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setRole("admin")}
                className={`flex-1 text-xs px-2 py-1.5 rounded-md font-medium transition-all ${
                  isAdmin
                    ? "bg-red-600 text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                🔑 مدير
              </button>
              <button
                onClick={() => setRole("user")}
                className={`flex-1 text-xs px-2 py-1.5 rounded-md font-medium transition-all ${
                  !isAdmin
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                👤 مستخدم
              </button>
            </div>
          </div>

          {/* User Settings */}
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
                    <label className="block text-xs text-gray-600 mb-1">
                      اسم المستخدم
                    </label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full text-xs border border-gray-200 rounded px-2 py-1"
                      placeholder="أدخل اسمك"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      القسم
                    </label>
                    <select
                      value={permissions?.department || ""}
                      onChange={(e) =>
                        setPermissions({
                          ...permissions,
                          department: e.target.value || null,
                        })
                      }
                      className="w-full text-xs border border-gray-200 rounded px-2 py-1"
                    >
                      <option value="">الكل (عام)</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          <p className="text-xs text-gray-400 text-center">
            © 2026 نظام إدارة الموظفين
          </p>
        </div>
      )}
    </aside>
  );
}
