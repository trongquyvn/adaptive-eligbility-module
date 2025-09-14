"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { usePatients } from "@/context/PatientContext";

interface FilterValues {
  site: string;
  status: string;
  date: string;
}


export default function FilterPopup({
  onApply,
}: {
  onApply: (filters: FilterValues) => void;
}) {
  const { rule } = usePatients();
  const siteOptions = rule?.trial?.jurisdiction;

  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({
    site: "",
    status: "",
    date: "",
  });

  const clearFilters = () => {
    setFilters({ site: "", status: "", date: "" });
  };

  const applyFilters = () => {
    onApply(filters);
    setOpen(false);
  };

  const count =
    (filters.site ? 1 : 0) + (filters.status ? 1 : 0) + (filters.date ? 1 : 0);
  return (
    <div>
      {/* Button */}
      <button
        className="px-4 py-2 border rounded-lg"
        onClick={() => setOpen(true)}
      >
        Filters {count}
      </button>

      {/* Popup */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl shadow-lg w-96 p-6 relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filters ({count})</h2>
              <button onClick={() => setOpen(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Site */}
            <div className="mb-4">
              <label className="block text-sm mb-1">Jurisdiction</label>
              <select
                value={filters.site}
                onChange={(e) =>
                  setFilters({ ...filters, site: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              >
                <option value="">All sites</option>
                {siteOptions.map((s: any) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="mb-4">
              <label className="block text-sm mb-2">ELIGIBILITY STATUS</label>
              <div className="flex gap-2">
                {["Eligible", "Ineligible", "Pending"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`px-4 py-1.5 rounded-full border ${
                      filters.status === s
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                    onClick={() => setFilters({ ...filters, status: s })}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Date */}
            <div className="mb-4">
              <label className="block text-sm mb-1">DATE SCREENED</label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) =>
                  setFilters({ ...filters, date: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-between mt-6">
              <button
                className="px-4 py-2 border rounded-lg"
                onClick={clearFilters}
              >
                Clear All
              </button>
              <button
                className="px-4 py-2 bg-purple-600 text-white rounded-lg"
                onClick={applyFilters}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
