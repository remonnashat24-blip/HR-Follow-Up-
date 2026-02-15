import { getProbationPeriods, getEmployees } from "@/app/actions";
import { AddProbationForm } from "@/components/forms/AddProbationForm";
import { ProbationTable } from "@/components/tables/ProbationTable";

export default async function ProbationPage() {
  const [probations, employees] = await Promise.all([
    getProbationPeriods(),
    getEmployees(),
  ]);

  const employeeOptions = employees.map((e) => ({
    id: e.id,
    name: e.name,
    employeeNumber: e.employeeNumber,
  }));

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة فترة الاختبار</h1>
          <p className="text-gray-500 mt-1">متابعة وتقييم فترات الاختبار للموظفين</p>
        </div>
        <AddProbationForm employees={employeeOptions} />
      </div>

      <ProbationTable probations={probations} />
    </div>
  );
}
