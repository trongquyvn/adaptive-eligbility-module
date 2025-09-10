"use client";

import React from "react";

type Regimen = {
  id: string;
  domain_id: string;
  label: string;
};

interface RegimenTableProps {
  regimens: Regimen[];
}

export default function RegimenTable({ regimens }: RegimenTableProps) {
  if (regimens.length === 0) {
    return (
      <div className="p-4 text-sm text-gray-500 italic">
        No regimens created yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <table className="w-full text-left border-t">
        <thead>
          <tr className="text-gray-500">
            <th className="py-3">Regimen ID</th>
            <th className="py-3">Label</th>
            <th className="py-3">Domain</th>
          </tr>
        </thead>
        <tbody>
          {regimens.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="py-3 font-mono text-xs text-gray-800">{r.id}</td>
              <td className="py-3">{r.label}</td>
              <td className="py-3">{r.domain_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
