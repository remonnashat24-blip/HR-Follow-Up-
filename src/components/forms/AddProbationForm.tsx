"use client";

import { useState } from "react";
import { createProbation } from "@/app/actions";

type Employee = {
  id: number;
  name: string;
  employeeNumber: string;
};

export function AddProbationForm({ employees }: { employees: Employee[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const startDate = formData.get("startDate") as string;
    const durationMonths = parseInt(formData.get("durationMonths") as string);

    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + durationMonths);

    await createProbation({
      employeeId: parseInt(formData.get("employeeId") as string),
      startDate,
      endDate: endDate.toISOString().split("T")[0],
      durationMonths,
    });
    setLoading(false);
    setIsOpen(false);
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
      >
        + إضافة فترة اختبار
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4">
        <h2 className="text-lg font-bold mb-4">إضافة فترة اختبار جديدة</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الموظف *
            </label>
            <select
              name="employeeId"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">اختر موظف</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.employeeNumber})
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                تاريخ البداية *
              </label>
              <input
                name="startDate"
                type="date"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                المدة (بالأشهر) *
              </label>
              <select
                name="durationMonths"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="3">3 أشهر</option>
                <option value="6">6 أشهر</option>
                <option value="12">12 شهر</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {loading ? "جاري الحفظ..." : "حفظ"}
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
