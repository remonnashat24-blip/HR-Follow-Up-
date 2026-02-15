"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

export function DeleteButton({
  onDelete,
  label = "حذف",
}: {
  onDelete: () => Promise<void>;
  label?: string;
}) {
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  if (!isAdmin) return null;

  async function handleDelete() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setLoading(true);
    await onDelete();
    setLoading(false);
    setConfirming(false);
  }

  return (
    <div className="inline-flex gap-1">
      {confirming && (
        <button
          onClick={() => setConfirming(false)}
          className="text-xs px-2 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          إلغاء
        </button>
      )}
      <button
        onClick={handleDelete}
        disabled={loading}
        className={`text-xs px-2 py-1 rounded-md transition-colors disabled:opacity-50 ${
          confirming
            ? "bg-red-600 text-white hover:bg-red-700"
            : "bg-red-50 text-red-600 hover:bg-red-100"
        }`}
      >
        {loading ? "جاري الحذف..." : confirming ? "تأكيد الحذف" : label}
      </button>
    </div>
  );
}

export function DeleteAllButton({
  onDeleteAll,
  entityName,
}: {
  onDeleteAll: () => Promise<void>;
  entityName: string;
}) {
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  if (!isAdmin) return null;

  async function handleDeleteAll() {
    setLoading(true);
    await onDeleteAll();
    setLoading(false);
    setIsOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors font-medium"
      >
        🗑️ حذف الكل
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="text-center mb-4">
              <p className="text-4xl mb-3">⚠️</p>
              <h2 className="text-lg font-bold text-gray-900">تأكيد حذف جميع {entityName}</h2>
              <p className="text-sm text-gray-500 mt-2">
                هذا الإجراء لا يمكن التراجع عنه. سيتم حذف جميع {entityName} نهائياً.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAll}
                disabled={loading}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? "جاري الحذف..." : "نعم، حذف الكل"}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
