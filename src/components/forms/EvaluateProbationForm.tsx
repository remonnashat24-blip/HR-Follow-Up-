"use client";

import { useState } from "react";
import { updateProbation } from "@/app/actions";

export function EvaluateProbationForm({
  probationId,
  employeeName,
}: {
  probationId: number;
  employeeName: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await updateProbation(probationId, {
      status: formData.get("status") as string,
      evaluationNotes: (formData.get("evaluationNotes") as string) || undefined,
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4">
        <h2 className="text-lg font-bold mb-1">تقييم فترة الاختبار</h2>
        <p className="text-sm text-gray-500 mb-4">{employeeName}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              ملاحظات التقييم
            </label>
            <textarea
              name="evaluationNotes"
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="أدخل ملاحظات التقييم..."
            />
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
