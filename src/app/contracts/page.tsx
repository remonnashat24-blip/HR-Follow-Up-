import { getContracts, getEmployees } from "@/app/actions";
import { AddContractForm } from "@/components/forms/AddContractForm";
import { ContractTable } from "@/components/tables/ContractTable";

export default async function ContractsPage() {
  const [contracts, employees] = await Promise.all([
    getContracts(),
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
          <h1 className="text-2xl font-bold text-gray-900">إدارة العقود</h1>
          <p className="text-gray-500 mt-1">عرض وإدارة وتجديد عقود الموظفين</p>
        </div>
        <AddContractForm employees={employeeOptions} />
      </div>

      <ContractTable contracts={contracts} />
    </div>
  );
}
