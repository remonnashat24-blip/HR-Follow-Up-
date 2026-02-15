"use client";

import { useState } from "react";
import { createContract } from "@/app/actions";

type Employee = {
  id: number;
  name: string;
  employeeNumber: string;
};

export function AddContractForm({ employees }: { employees: Employee[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contractType, setContractType] = useState("fixed");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const startDate = formData.get("startDate") as string;
    const type = formData.get("contractType") as string;
    const durationMonths = type === "fixed" ? parseInt(formData.get("durationMonths") as string) : undefined;

    let endDate: string | undefined;
    if (type === "fixed" && durationMonths) {
      const end = new Date(startDate);
      end.setMonth(end.getMonth() + durationMonths);
      endDate = end.toISOString().split("T")[0];
    }

    const salaryStr = formData.get("salary") as string;

    await createContract({
      employeeId: parseInt(formData.get("employeeId") as string),
      contractNumber: formData.get("contractNumber") as string,
      contractType: type,
      startDate,
      endDate,
      durationMonths,
      salary: salaryStr ? parseInt(salaryStr) : undefined,
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
        + إضافة عقد
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4">
        <h2 className="text-lg font-bold mb-4">إضافة عقد جديد</h2>
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
                رقم العقد *
              </label>
              <input
                name="contractNumber"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="CNT-001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                نوع العقد *
              </label>
              <select
                name="contractType"
                required
                value={contractType}
                onChange={(e) => setContractType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="fixed">محدد المدة</option>
                <option value="indefinite">غير محدد المدة</option>
              </select>
            </div>
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
            {contractType === "fixed" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  المدة (بالأشهر) *
                </label>
                <select
                  name="durationMonths"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="6">6 أشهر</option>
                  <option value="12">12 شهر</option>
                  <option value="24">24 شهر</option>
                  <option value="36">36 شهر</option>
                </select>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الراتب
            </label>
            <input
              name="salary"
              type="number"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="5000"
            />
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
