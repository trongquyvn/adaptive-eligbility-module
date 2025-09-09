"use client";

import React from "react";

type Variable = {
  id: string;
  name: string;
  type: string;
  cate?: string | null;
};

interface VariableTableProps {
  variables: Variable[];
  cate: string;
}

export default function VariableTable({ variables, cate }: VariableTableProps) {
  const filtered = variables.filter((v) => v.cate === cate);

  if (filtered.length === 0) {
    return (
      <div className="p-4 text-gray-500 text-sm italic">
        No variables found for cate <span className="font-mono">{cate}</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <table className="w-full text-left border-t">
        <thead>
          <tr className="text-gray-500">
            <th className="py-3">ID</th>
            <th className="py-3">Name</th>
            <th className="py-3">Type</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((v) => (
            <tr
              key={v.id + v.name}
              className="border-t"
            >
              <td className="py-3 font-mono text-xs text-gray-800">
                {v.id}
              </td>
              <td className="py-3">{v.name}</td>
              <td className="py-3">{v.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
