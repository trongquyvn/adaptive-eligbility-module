"use client";

import React, { useState } from "react";
import { cateList } from "@/constants";
import Tooltip from "@/components/common/Tooltip";
import { Info } from "lucide-react";

interface NodesTableProps {
  nodes: Record<string, any>;
  cate?: string; // cate id (optional)
}

function renderData(node: any) {
  switch (node?.type) {
    case "BOOLEAN":
    case "NOT":
    case "DATABASE":
      return <div>Var: {node?.input?.var}</div>;

    case "COMPARE":
      return (
        <div>
          <div>Left: {node?.input?.var}</div>
          <div>Operator: {node?.operator}</div>
          <div>Right: {node?.right?.const}</div>
        </div>
      );

    case "ANY":
    case "ALL":
      return <div>Children: {node?.children?.join(", ")}</div>;

    case "TIME_WINDOW":
      return (
        <div>
          <div>Var: {node?.input?.var}</div>
          <div>Max hours: {node?.window?.max_hours_since}</div>
          <div>Min hours: {node?.window?.min_hours_since}</div>
        </div>
      );

    case "IF":
      return (
        <div>
          <div>Condition: {node?.cond}</div>
          <div>Then: {node?.then}</div>
          <div>Else: {node?.else}</div>
        </div>
      );

    case "DOMAIN_MAP":
      return (
        <div className="space-y-1">
          Items:
          <ul className="list-disc list-inside">
            {node?.items?.map((item: any, idx: number) => (
              <li key={idx}>
                <div className="inline-flex flex-col">
                  <div className="inline">Domain: {item?.domain_id}</div>
                  <div className="inline">Rule: {item?.rule}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      );

    case "REGIMEN_RESOLVE":
      return (
        <div className="space-y-1">
          <div>Input = {node?.input?.eligible_domains_ref}</div>
          <div>Require min = {node?.require_min_regimens || ""}</div>
          <div>
            Constraints:
            <ul className="list-disc list-inside space-y-1">
              {node?.constraints?.map((c: any, idx: number) => (
                <li key={idx}>
                  <div className="inline-flex flex-col">
                    <div className="inline">Regimen: {c?.regimen_id}</div>
                    <div className="inline">Exclude If: {c?.exclude_if}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );

    default:
      return <div>-</div>;
  }
}

export default function NodesTable({ nodes, cate }: NodesTableProps) {
  const [selectedCate, setSelectedCate] = useState<string>("all");

  const cateMap: Record<string, string> = Object.fromEntries(
    cateList.map((c) => [c.id, c.name])
  );

  const activeCate = cate ?? selectedCate;

  const filteredNodes = Object.entries(nodes).filter(
    ([_, node]: [string, any]) =>
      activeCate === "all" ? true : node?.cate === activeCate
  );

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-4">
      {!cate && (
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Filter by Cate:</label>
          <select
            value={selectedCate}
            onChange={(e) => setSelectedCate(e.target.value)}
            className="rounded border border-gray-300 text-sm px-2 py-1"
          >
            <option value="all">All</option>
            {cateList.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Table */}
      <table className="w-full text-left border-t">
        <thead>
          <tr className="text-gray-500">
            <th className="py-3">Id</th>
            <th className="py-3">Name</th>
            <th className="py-3">Type</th>
            <th className="py-3">Cate</th>
            <th className="py-3">Data</th>
          </tr>
        </thead>
        <tbody>
          {filteredNodes.map(([key, node]: [string, any]) => (
            <tr key={key} className="border-t align-top">
              <td className="py-3 font-semibold">{key}</td>
              <td className="py-3 pr-2 max-w-[200px] truncate">
                <div className="flex items-center gap-1">
                  <span className="truncate">{node?.name}</span>
                  {node?.name && node?.name.length > 35 && (
                    <Tooltip content={node?.name}>
                      <Info className="w-4 h-4 text-gray-400 cursor-pointer flex-shrink-0" />
                    </Tooltip>
                  )}
                </div>
              </td>
              <td className="py-3">{node?.type}</td>
              <td className="py-3">
                {node?.cate ? cateMap[node?.cate] || node?.cate : "-"}
              </td>
              <td className="py-3">{renderData(node)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
