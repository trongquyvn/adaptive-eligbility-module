"use client";

import React from "react";
import { Pencil } from "lucide-react";
import { useNodes } from "@/context/NodeContext";

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
  // const filtered = variables.filter((v) => v.cate === cate);
  const filtered = variables;
  const { setVariableForm } = useNodes();

  if (filtered.length === 0) {
    return (
      <div className="p-4 text-gray-500 text-sm italic">
        No variables found for cate <span className="font-mono">{cate}</span>
      </div>
    );
  }

  const editVariable = (v: any) => {
    setVariableForm(v);
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <table className="w-full text-left border-t">
        <thead>
          <tr className="text-gray-500">
            <th className="py-3">ID</th>
            <th className="py-3">Name</th>
            <th className="py-3">Type</th>
            <th className="py-3"></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((v) => (
            <tr key={v.id + v.name} className="border-t">
              <td className="py-3 font-mono text-xs text-gray-800">{v.id}</td>
              <td className="py-3">{v.name}</td>
              <td className="py-3">{v.type}</td>
              <td className="py-3 flex gap-4">
                <Pencil
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => {
                    editVariable(v);
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
