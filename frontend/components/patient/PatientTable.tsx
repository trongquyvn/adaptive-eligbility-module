import Link from "next/link";
import { Eye } from "lucide-react";

interface PatientTableProps {
  patients: any[];
}

const statusStyle: any = {
  Eligible: "bg-green-100 text-green-700 text-white",
  Ineligible: "bg-red-100 text-red-700 text-white",
  Pending: "bg-gray-100 text-gray-600",
  Draft: "bg-gray-100 text-gray-600",
  Active: "bg-purple-600 text-gray-600 text-white",
};

export default function PatientTable({ patients }: PatientTableProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  return (
    <div className="bg-white rounded-xl shadow p-6">
      {/* Search + Filters */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Patient Name"
          className="border rounded-lg px-3 py-2 w-1/3"
        />
        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded-lg">Filters (3)</button>
          <button className="px-4 py-2 border rounded-lg">Export</button>
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-left border-t">
        <thead>
          <tr className="text-gray-500">
            <th className="py-3">Patient ID</th>
            <th className="py-3">Site</th>
            <th className="py-3">Date Screened</th>
            <th className="py-3">Status</th>
            <th className="py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p, i) => (
            <tr key={i} className="border-t">
              <td className="py-3">{p.id}</td>
              <td className="py-3">
                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                  {p.site}
                </span>
              </td>
              <td className="py-3">{p.date}</td>
              <td className="py-3">
                <span
                  className={`px-3 py-1 rounded-full ${
                    statusStyle[p?.eligibility?.isDraft ? "Draft" : "Active"]
                  }`}
                >
                  {p?.eligibility?.isDraft ? "Draft" : "Active"}
                </span>
              </td>
              <td className="py-3">
                <Link href={`/patient/${p.id.replace("#", "")}`}>
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
                    <Eye className="w-4 h-4" />
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
