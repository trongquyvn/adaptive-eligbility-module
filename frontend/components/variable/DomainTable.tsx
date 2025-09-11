"use client";

import React from "react";

type Domain = {
  id: string;
  active: boolean;
};

interface DomainTableProps {
  domains: Domain[];
}

export default function DomainTable({ domains }: DomainTableProps) {
  if (domains.length === 0) {
    return (
      <div className="p-4 text-sm text-gray-500 italic">
        No domains created yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <table className="w-full text-left border-t">
        <thead>
          <tr className="text-gray-500">
            <th className="py-3">Domain ID</th>
            <th className="py-3">Active</th>
          </tr>
        </thead>
        <tbody>
          {domains.map((d) => (
            <tr key={d.id + Math.random()} className="border-t">
              <td className="py-3">{d.id}</td>
              <td className="py-3">{d.active ? "true" : "false"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
