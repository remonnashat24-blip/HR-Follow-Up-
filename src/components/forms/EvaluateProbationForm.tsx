"use client";

import { useState } from "react";
import { updateProbation } from "@/app/actions";

export function EvaluateProbationForm({
  probationId,
  employeeName,
  department,
  directManager,
}: {
  probationId: number;
  employeeName: string | null;
  department: string | null;
  directManager: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await updateProbation(probationId, {
      status: formData.get("status") as string,
      taskPerformance: formData.get("taskPerformance") as string || undefined,
      taskCompletionRate: formData.get("taskCompletionRate") ? parseInt(formData.get("taskCompletionRate") as string) : undefined,
      taskNotes: formData.get("taskNotes") as string || undefined,
      departmentEvaluation: formData.get("departmentEvaluation") as string || undefined,
      supervisorEvaluation: formData.get("supervisorEvaluation") as string || undefined,
      evaluationNotes: formData.get("evaluationNotes") as string || undefined,
      evaluationDate: new Date().toISOString().split("T")[0],
      evaluatedBy: (formData.get("evaluatedBy") as string) || undefined,
    });
    setLoading(false);
    setIsOpen(false);
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
      >
        تقييم
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 my-8">
        <h2 className="text-lg font-bold mb-1">تقييم فترة الاختبار</h2>
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
          <span>{employeeName}</span>
          {department && <span>| {department}</span>}
          {directManager && <span>| المدير: {directManager}</span>}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Employee Info Card */}
          <div className="bg-blue-50 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-800">
              <strong>القسم:</strong> {department || "غير محدد"} | 
              <strong> المدير المباشر:</strong> {directManager || "غير محدد"}
            </p>
          </div>

          {/* Main Evaluation Result */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نتيجة التقييم *
            </label>
            <select
              name="status"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="passed">اجتاز فترة الاختبار ✅</option>
              <option value="failed">لم يجتز فترة الاختبار ❌</option>
              <option value="extended">تمديد فترة الاختبار 🔄</option>
            </select>
          </div>

          {/* Task Performance Section */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">📋 تقييم أداء المهام</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  أداء المهام
                </label>
                <select
                  name="taskPerformance"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">اختر التقييم</option>
                  <option value="excellent">ممتاز ⭐⭐⭐</option>
                  <option value="good">جيد ⭐⭐</option>
                  <option value="needs_improvement">يحتاج تحسين ⭐</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نسبة إكمال المهام (%)
                </label>
                <input
                  name="taskCompletionRate"
                  type="number"
                  min="0"
                  max="100"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="0-100"
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ملاحظات على أداء المهام
              </label>
              <textarea
                name="taskNotes"
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="صف أداء الموظف في المهام الموكلة إليه..."
              />
            </div>
          </div>

          {/* Department & Supervisor Evaluation */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">👥 تقييم المدير المباشر والقسم</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  تقييم المدير المباشر
                </label>
                <textarea
                  name="supervisorEvaluation"
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="تقييم المدير المباشر..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  تقييم رئيس القسم
                </label>
                <textarea
                  name="departmentEvaluation"
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="تقييم رئيس القسم..."
                />
              </div>
            </div>
          </div>

          {/* General Info */}
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  المقيّم
                </label>
                <input
                  name="evaluatedBy"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="اسم المقيّم"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ملاحظات عامة
                </label>
                <textarea
                  name="evaluationNotes"
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="ملاحظات إضافية..."
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {loading ? "جاري الحفظ..." : "حفظ التقييم"}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
