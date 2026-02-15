"use client";

import { useState, useEffect } from "react";
import { useAuth, UserPermissions } from "@/lib/auth-context";
import {
  getUserPermissions,
  createUserPermission,
  updateUserPermission,
  deleteUserPermission,
} from "@/app/actions";

interface PermissionRecord {
  id: number;
  userName: string;
  department: string | null;
  canAddEmployees: number | boolean;
  canEditEmployees: number | boolean;
  canDeleteEmployees: number | boolean;
  canAddProbations: number | boolean;
  canEvaluateProbations: number | boolean;
  canDeleteProbations: number | boolean;
  canAddContracts: number | boolean;
  canRenewContracts: number | boolean;
  canDeleteContracts: number | boolean;
  canImportData: number | boolean;
}

export default function PermissionsPage() {
  const { isAdmin } = useAuth();
  const [permissions, setPermissions] = useState<PermissionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<UserPermissions>>({
    userName: "",
    department: "",
    canAddEmployees: true,
    canEditEmployees: true,
    canDeleteEmployees: false,
    canAddProbations: true,
    canEvaluateProbations: true,
    canDeleteProbations: false,
    canAddContracts: true,
    canRenewContracts: true,
    canDeleteContracts: false,
    canImportData: true,
  });

  useEffect(() => {
    loadPermissions();
  }, []);

  async function loadPermissions() {
    try {
      const data = await getUserPermissions();
      setPermissions(data as PermissionRecord[]);
    } catch (error) {
      console.error("Error loading permissions:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingId) {
        await updateUserPermission(editingId, formData as any);
      } else {
        await createUserPermission(formData as any);
      }
      setShowForm(false);
      setEditingId(null);
      resetForm();
      loadPermissions();
    } catch (error) {
      console.error("Error saving permission:", error);
    }
  }

  async function handleDelete(id: number) {
    if (confirm("هل أنت متأكد من حذف هذا الإذن؟")) {
      try {
        await deleteUserPermission(id);
        loadPermissions();
      } catch (error) {
        console.error("Error deleting permission:", error);
      }
    }
  }

  function handleEdit(perm: PermissionRecord) {
    setFormData({
      userName: perm.userName,
      department: perm.department || "",
      canAddEmployees: Boolean(perm.canAddEmployees),
      canEditEmployees: Boolean(perm.canEditEmployees),
      canDeleteEmployees: Boolean(perm.canDeleteEmployees),
      canAddProbations: Boolean(perm.canAddProbations),
      canEvaluateProbations: Boolean(perm.canEvaluateProbations),
      canDeleteProbations: Boolean(perm.canDeleteProbations),
      canAddContracts: Boolean(perm.canAddContracts),
      canRenewContracts: Boolean(perm.canRenewContracts),
      canDeleteContracts: Boolean(perm.canDeleteContracts),
      canImportData: Boolean(perm.canImportData),
    });
    setEditingId(perm.id);
    setShowForm(true);
  }

  function resetForm() {
    setFormData({
      userName: "",
      department: "",
      canAddEmployees: true,
      canEditEmployees: true,
      canDeleteEmployees: false,
      canAddProbations: true,
      canEvaluateProbations: true,
      canDeleteProbations: false,
      canAddContracts: true,
      canRenewContracts: true,
      canDeleteContracts: false,
      canImportData: true,
    });
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">لا تملك صلاحية الوصول لهذه الصفحة</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة صلاحيات المستخدمين</h1>
          <p className="text-gray-500 mt-1">تحكم في صلاحيات كل مستخدم والأقسام التي يمكنه الوصول إليها</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            resetForm();
          }}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          + إضافة مستخدم
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">
            {editingId ? "تعديل صلاحيات مستخدم" : "إضافة مستخدم جديد"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  اسم المستخدم *
                </label>
                <input
                  type="text"
                  required
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder="أدخل اسم المستخدم"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  القسم (اتركه فارغاً للصلاحيات العامة)
                </label>
                <input
                  type="text"
                  value={formData.department || ""}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value || undefined })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder="مثل: الموارد البشرية، المالية"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">صلاحيات الموظفين</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.canAddEmployees}
                    onChange={(e) => setFormData({ ...formData, canAddEmployees: e.target.checked })}
                    className="rounded"
                  />
                  إضافة موظفين
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.canEditEmployees}
                    onChange={(e) => setFormData({ ...formData, canEditEmployees: e.target.checked })}
                    className="rounded"
                  />
                  تعديل موظفين
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.canDeleteEmployees}
                    onChange={(e) => setFormData({ ...formData, canDeleteEmployees: e.target.checked })}
                    className="rounded"
                  />
                  حذف موظفين
                </label>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">صلاحيات فترة الاختبار</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.canAddProbations}
                    onChange={(e) => setFormData({ ...formData, canAddProbations: e.target.checked })}
                    className="rounded"
                  />
                  إضافة فترة اختبار
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.canEvaluateProbations}
                    onChange={(e) => setFormData({ ...formData, canEvaluateProbations: e.target.checked })}
                    className="rounded"
                  />
                  تقييم فترة الاختبار
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.canDeleteProbations}
                    onChange={(e) => setFormData({ ...formData, canDeleteProbations: e.target.checked })}
                    className="rounded"
                  />
                  حذف فترة اختبار
                </label>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">صلاحيات العقود</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.canAddContracts}
                    onChange={(e) => setFormData({ ...formData, canAddContracts: e.target.checked })}
                    className="rounded"
                  />
                  إضافة عقد
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.canRenewContracts}
                    onChange={(e) => setFormData({ ...formData, canRenewContracts: e.target.checked })}
                    className="rounded"
                  />
                  تجديد العقد
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.canDeleteContracts}
                    onChange={(e) => setFormData({ ...formData, canDeleteContracts: e.target.checked })}
                    className="rounded"
                  />
                  حذف عقد
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.canImportData}
                    onChange={(e) => setFormData({ ...formData, canImportData: e.target.checked })}
                    className="rounded"
                  />
                  استيراد بيانات
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                {editingId ? "تحديث" : "حفظ"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  resetForm();
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">جاري التحميل...</p>
        </div>
      ) : permissions.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
          <p className="text-gray-500">لا توجد صلاحيات محددة. يمكنك إضافة مستخدمين وصلاحياتهم.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">المستخدم</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">القسم</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">الصلاحيات</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {permissions.map((perm) => (
                <tr key={perm.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">{perm.userName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {perm.department || "الكل (عام)"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex flex-wrap gap-1">
                      {perm.canAddEmployees && (
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">إضافة موظفين</span>
                      )}
                      {perm.canEvaluateProbations && (
                        <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded">تقييم</span>
                      )}
                      {perm.canRenewContracts && (
                        <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded">تجديد عقود</span>
                      )}
                      {perm.canDeleteEmployees && (
                        <span className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded">حذف</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(perm)}
                        className="text-xs text-primary hover:underline"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(perm.id)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        حذف
                      </button>
                    </div>
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
