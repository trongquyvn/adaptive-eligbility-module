"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { exportJsonToFile, formatISODate, statusStyle } from "@/lib/common";
import { useMemo, useState } from "react";
import FilterPopup from "./FilterPopup";

interface PatientTableProps {
  patients: any[];
}

export default function PatientTable({ patients }: PatientTableProps) {
  const [filters, setFilters] = useState({
    site: "",
    status: "",
    date: "",
  });
  const [searchName, setSearchName] = useState("");

  const exportData = () => {
    if (!patients?.length) return;
    exportJsonToFile(patients, "patients.json");
  };

  // Apply filter logic
  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const { eligibility, site } = p;
      const matchSite = !filters.site || site === filters.site;
      const matchStatus =
        !filters.status ||
        (filters.status === "Eligible" && eligibility?.isOnPass) ||
        (filters.status === "Ineligible" &&
          typeof eligibility?.isOnPass !== "undefined" &&
          !eligibility?.isOnPass) ||
        (filters.status === "Pending" &&
          typeof eligibility?.isOnPass === "undefined");
      const matchDate =
        !filters.date ||
        formatISODate(eligibility?.evaluated_at).startsWith(
          filters.date.split("-").reverse().join("/")
        );

      const matchName =
        !searchName || p.id?.toLowerCase().includes(searchName.toLowerCase());

      return matchSite && matchStatus && matchDate && matchName;
    });
  }, [patients, filters, searchName]);

  const getStyles = (isOnPass?: boolean) => {
    if (typeof isOnPass === "undefined") {
      return statusStyle["Pending"];
    }
    return statusStyle[isOnPass ? "Eligible" : "Ineligible"];
  };

  const getTitle = (isOnPass?: boolean) => {
    if (typeof isOnPass === "undefined") {
      return "Pending";
    }
    return isOnPass ? "Eligible" : "Ineligible";
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      {/* Search + Filters */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Patient id"
          value={searchName || ""}
          onChange={(e) => setSearchName(e.target.value)}
          className="border rounded-lg px-3 py-2 w-1/3"
        />
        <div className="flex gap-2">
          <FilterPopup onApply={setFilters} />
          <button className="px-4 py-2 border rounded-lg" onClick={exportData}>
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-left border-t">
        <thead>
          <tr className="text-gray-500">
            <th className="py-3">Patient ID</th>
            <th className="py-3">Jurisdiction</th>
            <th className="py-3">Created at</th>
            <th className="py-3">Status</th>
            <th className="py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.map((p, i) => (
            <tr key={i} className="border-t">
              <td className="py-3">{p.id}</td>
              <td className="py-3">
                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                  {p.site}
                </span>
              </td>
              <td className="py-3">
                {formatISODate(p?.eligibility?.evaluated_at)}
              </td>
              <td className="py-3">
                <span
                  className={`px-3 py-1 rounded-full ${getStyles(
                    p?.eligibility?.isOnPass
                  )}`}
                >
                  {getTitle(p?.eligibility?.isOnPass)}
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
