"use client";

import { useState } from "react";
import { renewContract } from "@/app/actions";

export function RenewContractForm({
  contractId,
  employeeId,
  employeeName,
  currentEndDate,
}: {
  contractId: number;
  employeeId: number;
  employeeName: string | null;
  currentEndDate: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const startDate = formData.get("startDate") as string;
    const durationMonths = parseInt(formData.get("durationMonths") as string);
    const end = new Date(startDate);
    end.setMonth(end.getMonth() + durationMonths);

    const salaryStr = formData.get("salary") as string;

    await renewContract(contractId, {
      employeeId,
      contractNumber: formData.get("contractNumber") as string,
      contractType: "fixed",
      startDate,
      endDate: end.toISOString().split("T")[0],
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
        className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-lg hover:bg-green-100 transition-colors"
      >
        تجديد
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4">
        <h2 className="text-lg font-bold mb-1">تجديد العقد</h2>
        <p className="text-sm text-gray-500 mb-4">
          {employeeName} - ينتهي في {currentEndDate}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              رقم العقد الجديد *
            </label>
            <input
              name="contractNumber"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="CNT-002"
            />
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
                defaultValue={currentEndDate || ""}
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
                <option value="6">6 أشهر</option>
                <option value="12">12 شهر</option>
                <option value="24">24 شهر</option>
                <option value="36">36 شهر</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الراتب الجديد
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
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? "جاري التجديد..." : "تجديد العقد"}
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
