"use client";

import React, { useState } from "react";
import { cateList } from "@/constants";
import Tooltip from "@/components/common/Tooltip";
import { Info, Pencil, XCircle } from "lucide-react";
import { useNodes } from "@/context/NodeContext";
import { canDeleteNode, flattenObj } from "@/lib/common";
import { usePatients } from "@/context/PatientContext";
import { updateRule } from "@/lib/rule";
import { useToast } from "@/context/ToastContext";

interface NodesTableProps {
  nodes: Record<string, any>;
  flow?: Record<string, any>[];
  cate?: string; // cate id (optional)
  canEdit?: boolean;
}

function renderData(node: any, getVariableInfo: any, getNodeInfo: any) {
  switch (node?.type) {
    case "BOOLEAN":
    case "NOT":
    case "DATABASE":
      return <div>Var: {getVariableInfo(node?.input?.var)?.name}</div>;

    case "COMPARE":
      return (
        <div>
          <div>Left: {getVariableInfo(node?.input?.var)?.name}</div>
          <div>Operator: {node?.operator}</div>
          <div>Right: {node?.right?.const}</div>
        </div>
      );

    case "DATA":
      return (
        <div>
          <div>Left: {getVariableInfo(node?.input?.var)?.name}</div>
          <div>Operator: =</div>
          <div>Right: {node?.right?.const}</div>
        </div>
      );

    case "ANY":
    case "ALL":
      return (
        <div>
          Children:{" "}
          <span className="font-semibold">
            {node?.children?.map((e: any) => getNodeInfo(e)?.name).join(", ")}
          </span>
        </div>
      );

    case "TIME_WINDOW":
      return (
        <div>
          <div>Var: {getVariableInfo(node?.input?.var)?.name}</div>
          <div>Max hours: {node?.window?.max_hours_since}</div>
          <div>Min hours: {node?.window?.min_hours_since}</div>
        </div>
      );

    case "IF":
      return (
        <div>
          <div>Condition: {getNodeInfo(node?.cond)?.name}</div>
          <div>Then: {getNodeInfo(node?.then)?.name}</div>
          <div>Else: {getNodeInfo(node?.else)?.name}</div>
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
                  <div className="inline">
                    Domain:{" "}
                    <span className="font-semibold">{item?.domain_id}</span>
                  </div>
                  <div className="inline">
                    Rule:{" "}
                    <span className="font-semibold">
                      {getNodeInfo(item?.rule)?.name}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      );

    case "REGIMEN_RESOLVE":
      return (
        <div className="space-y-1">
          <div>
            Input = {getNodeInfo(node?.input?.eligible_domains_ref)?.name}
          </div>
          <div>Require min = {node?.require_min_regimens || ""}</div>
          <div>
            Constraints:
            <ul className="list-disc list-inside space-y-1">
              {node?.constraints?.map((c: any, idx: number) => (
                <li key={idx}>
                  <div className="inline-flex flex-col">
                    <div className="inline">
                      Regimen:{" "}
                      <span className="font-semibold">{c?.regimen_id}</span>
                    </div>
                    <div className="inline">
                      Exclude If:{" "}
                      <span className="font-semibold">
                        {getNodeInfo(c?.exclude_if)?.name}
                      </span>
                    </div>
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

export default function NodesTable({ cate, canEdit }: NodesTableProps) {
  const { rule, updateActiveRule, getVariableInfo, getNodeInfo } =
    usePatients();
  const { showToast } = useToast();

  const nodes = rule?.logic?.nodes || {};
  const flow = rule?.logic?.flow || [];
  const [selectedCate, setSelectedCate] = useState<string>("all");
  const { setNoteForm } = useNodes();

  const cateMap: Record<string, string> = Object.fromEntries(
    cateList.map((c) => [c.id, c.name])
  );

  const activeCate = cate ?? selectedCate;

  const filteredNodes = Object.entries(nodes).filter(
    ([_, node]: [string, any]) =>
      node?.type !== "DATABASE"
        ? activeCate === "all"
          ? true
          : node?.cate === activeCate
        : false
  );

  const editNode = (node: any) => {
    setNoteForm({
      initType: node.type,
      initForm: flattenObj(node),
    });
  };

  const removeNode = async (nodeId: any) => {
    const canDel = canDeleteNode(nodeId, nodes, flow);
    if (canDel) {
      const next = confirm("Are you sure you want to delete this item?");
      if (next) {
        const newNodes = { ...nodes };
        delete newNodes[nodeId];
        const newRule = {
          ...rule,
          logic: {
            ...rule?.logic,
            nodes: newNodes,
          },
        };
        const result = await updateRule(rule._id, newRule);
        if (result) {
          updateActiveRule(result);
          showToast("Deleted Node!", "success");
        }
      }
    } else {
      alert("Can't delete used node");
    }
  };

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
            {canEdit && <th className="py-3"></th>}
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
              <td className="py-3">
                {renderData(node, getVariableInfo, getNodeInfo)}
              </td>
              {canEdit && (
                <td className="py-3 flex gap-4">
                  <Pencil
                    className="w-4 h-4 cursor-pointer"
                    onClick={() => {
                      editNode(node);
                    }}
                  />

                  <XCircle
                    className="w-4 h-4 cursor-pointer text-red-700"
                    onClick={() => {
                      removeNode(key);
                    }}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
