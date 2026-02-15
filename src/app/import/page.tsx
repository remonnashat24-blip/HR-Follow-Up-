"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { importExcelData, type ImportRow } from "../actions";

export default function ImportPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    employeesCreated: number;
    contractsCreated: number;
    errors: string[];
  } | null>(null);
  const [fileName, setFileName] = useState("");

  const downloadTemplate = () => {
    // Create template data with sample headers
    const templateData = [
      {
        "Employee Code": "EMP-001",
        "Name": "أحمد محمد",
        "Location": "الرياض",
        "Department": "تقنية المعلومات",
        "Job Title": "مطور برمجيات",
        "Direct Manager": "خالد العمر",
        "Employee Social Security Number": "1234567890",
        "Date of Hiring": "2024-01-15",
        "Contract Duration": 12,
        "Contract Start Date": "2024-01-15",
        "Contract End Date": "2025-01-15",
        "Contract Sequence": 1,
      },
    ];

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(templateData);

    // Set column widths
    worksheet["!cols"] = [
      { wch: 15 }, // Employee Code
      { wch: 25 }, // Name
      { wch: 15 }, // Location
      { wch: 20 }, // Department
      { wch: 20 }, // Job Title
      { wch: 20 }, // Direct Manager
      { wch: 25 }, // Employee Social Security Number
      { wch: 15 }, // Date of Hiring
      { wch: 15 }, // Contract Duration
      { wch: 18 }, // Contract Start Date
      { wch: 18 }, // Contract End Date
      { wch: 15 }, // Contract Sequence
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

    // Download the file
    XLSX.writeFile(workbook, "employee_template.xlsx");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsLoading(true);
    setResult(null);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<string, unknown>[];

      // Map Excel columns to our import format
      // Expected columns:
      // - Employee Code (or كود الموظف)
      // - Name (or الاسم)
      // - Location (or الموقع)
      // - Department (or القسم)
      // - Job Title (or المسمى الوظيفي)
      // - Direct Manager (or المدير المباشر)
      // - Employee Social Security Number (or رقم التأمين الاجتماعي)
      // - Date of Hiring (or تاريخ التعيين)
      // - Contract Duration (or مدة العقد)
      // - Contract Start Date (or تاريخ بداية العقد)
      // - Contract End Date (or تاريخ نهاية العقد)
      // - Contract Sequence (or رقم العقد)
      // - Gap Start Date (or تاريخ بداية الفترة)
      // - Gap End Date (or تاريخ نهاية الفترة)

      const rows: ImportRow[] = jsonData.map((row) => ({
        employeeCode: String(row["Employee Code"] || row["كود الموظف"] || row["employeeCode"] || ""),
        name: String(row["Name"] || row["الاسم"] || row["name"] || ""),
        location: String(row["Location"] || row["الموقع"] || row["location"] || ""),
        department: String(row["Department"] || row["القسم"] || row["department"] || ""),
        jobTitle: String(row["Job Title"] || row["المسمى الوظيفي"] || row["jobTitle"] || ""),
        directManager: String(row["Direct Manager"] || row["المدير المباشر"] || row["directManager"] || ""),
        socialSecurityNumber: String(
          row["Employee Social Security Number"] ||
            row["رقم التأمين الاجتماعي"] ||
            row["socialSecurityNumber"] ||
            ""
        ),
        hireDate: String(
          row["Date of Hiring"] ||
            row["تاريخ التعيين"] ||
            row["hireDate"] ||
            ""
        ),
        contractDuration: row["Contract Duration"]
          ? Number(row["Contract Duration"] || row["مدة العقد"])
          : undefined,
        contractStartDate: String(
          row["Contract Start Date"] ||
            row["تاريخ بداية العقد"] ||
            row["contractStartDate"] ||
            ""
        ),
        contractEndDate: row["Contract End Date"]
          ? String(row["Contract End Date"] || row["تاريخ نهاية العقد"] || "")
          : undefined,
        contractSequence: row["Contract Sequence"]
          ? Number(row["Contract Sequence"] || row["رقم العقد"])
          : undefined,
        gapStartDate: row["Gap Start Date"]
          ? String(row["Gap Start Date"] || row["تاريخ بداية الفترة"])
          : undefined,
        gapEndDate: row["Gap End Date"]
          ? String(row["Gap End Date"] || row["تاريخ نهاية الفترة"])
          : undefined,
      }));

      // Filter out empty rows
      const validRows = rows.filter((r) => r.employeeCode && r.name && r.hireDate);

      if (validRows.length === 0) {
        setResult({
          employeesCreated: 0,
          contractsCreated: 0,
          errors: ["No valid rows found in the Excel file. Please check the column headers."],
        });
        setIsLoading(false);
        return;
      }

      const importResult = await importExcelData(validRows);
      setResult(importResult);
    } catch (error) {
      setResult({
        employeesCreated: 0,
        contractsCreated: 0,
        errors: [`Error processing file: ${error}`],
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">استيراد البيانات من Excel</h1>
        <p className="text-gray-600">
          قم برفع ملف Excel يحتوي على بيانات الموظفين والعقود
        </p>
      </div>

      {/* Upload Box */}
      <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 text-center hover:border-blue-400 transition-colors">
        <div className="mb-4">
          <span className="text-4xl">📄</span>
        </div>
        <label className="cursor-pointer">
          <span className="text-blue-600 hover:text-blue-700 font-medium">
            klik untuk memilih file
          </span>
          <span className="text-gray-500"> atau drag dan drop</span>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isLoading}
          />
        </label>
        <p className="text-sm text-gray-400 mt-2">Mendukung file .xlsx, .xls, .csv</p>
      </div>

      {fileName && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center gap-2">
          <span>📎</span>
          <span className="text-sm text-blue-700">{fileName}</span>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="mt-6 text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Sedang memproses data...</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Hasil Import</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{result.employeesCreated}</p>
              <p className="text-sm text-green-700">الموظفين المضافين</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{result.contractsCreated}</p>
              <p className="text-sm text-blue-700">العقود المضافة</p>
            </div>
          </div>

          {result.errors.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium text-red-600 mb-2">الأخطاء:</h3>
              <ul className="text-sm text-red-500 space-y-1">
                {result.errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Template Download */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg">قالب ملف Excel</h3>
          <button
            onClick={downloadTemplate}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <span>📥</span>
            تحميل القالب
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          استخدم القالب التالي لضمان صحة البيانات:
        </p>
        <div className="bg-white rounded border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-right font-medium">العمود</th>
                <th className="px-4 py-2 text-right font-medium">الوصف</th>
                <th className="px-4 py-2 text-right font-medium">مطلوب</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-4 py-2">Employee Code / كود الموظف</td>
                <td className="px-4 py-2">رقم الموظف الفريد</td>
                <td className="px-4 py-2 text-green-600">نعم</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">Name / الاسم</td>
                <td className="px-4 py-2">اسم الموظف الكامل</td>
                <td className="px-4 py-2 text-green-600">نعم</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">Location / الموقع</td>
                <td className="px-4 py-2">موقع العمل</td>
                <td className="px-4 py-2 text-gray-400">اختياري</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">Department / القسم</td>
                <td className="px-4 py-2">القسم التابع له</td>
                <td className="px-4 py-2 text-gray-400">اختياري</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">Job Title / المسمى الوظيفي</td>
                <td className="px-4 py-2">المنصب الوظيفي</td>
                <td className="px-4 py-2 text-gray-400">اختياري</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">Direct Manager / المدير المباشر</td>
                <td className="px-4 py-2">اسم المدير المباشر</td>
                <td className="px-4 py-2 text-gray-400">اختياري</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">Employee Social Security Number / رقم التأمين الاجتماعي</td>
                <td className="px-4 py-2">رقم التأمين الاجتماعي</td>
                <td className="px-4 py-2 text-gray-400">اختياري</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">Date of Hiring / تاريخ التعيين</td>
                <td className="px-4 py-2">تاريخ التعيين (YYYY-MM-DD)</td>
                <td className="px-4 py-2 text-green-600">نعم</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">Contract Duration / مدة العقد</td>
                <td className="px-4 py-2">مدة العقد بالأشهر</td>
                <td className="px-4 py-2 text-gray-400">اختياري</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">Contract Start Date / تاريخ بداية العقد</td>
                <td className="px-4 py-2">تاريخ بداية العقد (YYYY-MM-DD)</td>
                <td className="px-4 py-2 text-gray-400">اختياري</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">Contract End Date / تاريخ نهاية العقد</td>
                <td className="px-4 py-2">تاريخ نهاية العقد (YYYY-MM-DD)</td>
                <td className="px-4 py-2 text-gray-400">اختياري</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">Contract Sequence / رقم العقد</td>
                <td className="px-4 py-2">رقم تسلسلي للعقد</td>
                <td className="px-4 py-2 text-gray-400">اختياري</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
