"use client";

import { usePatients } from "@/context/PatientContext";
import { useEffect, useState } from "react";
import DeleteConfirm from "@/components/common/DeleteConfirm";
import { useToast } from "@/context/ToastContext";
import { updateRule } from "@/lib/rule";

type NodePopupProps = {
  nodeId: string;
  open: boolean;
  onClose: () => void;
};

export default function NodePopup({
  nodeId,
  open,
  onClose: onInitClose,
}: NodePopupProps) {
  const { rule, updateActiveRule } = usePatients();
  const { showToast } = useToast();
  const nodes = rule?.logic?.nodes || {};
  const nodeOptions = Object.keys(nodes);

  const nodeData = nodes[nodeId] || {};
  const flowStep = rule?.logic?.flow?.find((f: any) => f.id === nodeId) || {};

  const [editMode, setEditMode] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // State form
  const [passType, setPassType] = useState<"next" | "outcome">("next");
  const [onPassNext, setOnPassNext] = useState("");
  const [onPassOutcome, setOnPassOutcome] = useState("");
  const [onPassCode, setOnPassCode] = useState("");

  const [failType, setFailType] = useState<"next" | "outcome">("next");
  const [onFailNext, setOnFailNext] = useState("");
  const [onFailOutcome, setOnFailOutcome] = useState("");
  const [onFailCode, setOnFailCode] = useState("");

  const [onStartCode, setOnStartCode] = useState("");

  useEffect(() => {
    if (!nodeId) return;
    if (nodeId === "start") {
      const flowStep = rule?.logic?.flow?.find((f: any) => f.start) || {};
      setOnStartCode(flowStep.id);
    } else {
      setOnPassNext(flowStep?.on_pass?.next || "");
      setOnPassOutcome(flowStep?.on_pass?.outcome || "");
      setOnPassCode(flowStep?.on_pass?.code || "");
      setOnFailNext(flowStep?.on_fail?.next || "");
      setOnFailOutcome(flowStep?.on_fail?.outcome || "");
      setOnFailCode(flowStep?.on_fail?.code || "");
    }

    setEditMode(false);
  }, [nodeId]);

  const handleSave = async () => {
    if (passType === "next") {
      if (nodeId === onPassNext) {
        showToast("Can't update to existing node!", "error");
        return;
      }
    }

    if (failType === "next") {
      if (nodeId === onFailNext) {
        showToast("Can't update to existing node!", "error");
        return;
      }
    }

    const newNode = {
      id: nodeId,
      on_pass: {
        ...(passType === "next"
          ? { next: onPassNext }
          : { outcome: onPassOutcome, code: onPassCode }),
      },
      on_fail: {
        ...(failType === "next"
          ? { next: onFailNext }
          : { outcome: onFailOutcome, code: onFailCode }),
      },
      start: Boolean(flowStep?.start),
    };

    const flow = rule?.logic?.flow;
    const newFlow = flow.filter((e: any) => e.id !== nodeId);
    newFlow.push(newNode);

    const newRule = { ...rule };
    newRule.logic.flow = newFlow;

    const result = await updateRule(rule._id, newRule);
    if (result) {
      updateActiveRule(result);
      showToast("Update!", "success");
    }

    onClose();
  };

  const handleDelete = () => {
    setConfirmOpen(true);
  };

  const onConfirmDelete = async () => {
    const flow = rule?.logic?.flow;
    let newFlow = flow.filter((e: any) => e.id !== nodeId);
    newFlow = newFlow.map((e: any) => {
      if (e?.on_pass?.next === nodeId) e.on_pass.next = "";
      if (e?.on_fail?.next === nodeId) e.on_fail.next = "";
      return e;
    });
    const newRule = { ...rule };
    newRule.logic.flow = newFlow;

    const result = await updateRule(rule._id, newRule);
    if (result) {
      updateActiveRule(result);
      showToast("Delete!", "success");
    }

    setConfirmOpen(false);
    onClose();
  };

  const onCancelDelete = () => {
    setConfirmOpen(false);
  };

  const onClose = () => {
    setEditMode(false);
    onInitClose();
  };

  const onSaveStart = async () => {
    const flow = rule?.logic?.flow;
    let hasStart = false;
    const newFlow = flow.map((e: any) => {
      if (e.id === onStartCode) {
        hasStart = true;
      }
      return {
        ...e,
        start: e.id === onStartCode,
      };
    });

    if (!hasStart) {
      newFlow.push({
        id: onStartCode,
        on_pass: {},
        on_fail: {},
        start: true,
      });
    }

    const newRule = { ...rule };
    newRule.logic.flow = newFlow;

    const result = await updateRule(rule._id, newRule);
    if (result) {
      updateActiveRule(result);
      showToast("Update!", "success");
    }
    onClose();
  };

  if (!open || !nodeId) return null;
  return (
    <>
      <DeleteConfirm
        open={confirmOpen}
        message={`Are you sure you want to delete this item? "${nodeId}"?`}
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
      />
      <div
        className="absolute inset-0 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div
          className="absolute bg-white border rounded-lg w-full max-w-lg p-3 top-2 right-2 z-90"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
          {nodeId === "start" ? (
            <>
              <h2 className="text-xl font-bold mb-4">Start diagram</h2>
              <div>
                <label className="block text-sm font-medium">Next</label>
                <select
                  value={onStartCode}
                  onChange={(e) => setOnStartCode(e.target.value)}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="">-- none --</option>
                  {nodeOptions.map((id) => (
                    <option key={id} value={id}>
                      {nodes?.[id]?.name}
                    </option>
                  ))}
                </select>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={onSaveStart}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-2">{nodeData.name} </h2>
              {nodeData ? (
                <div className="space-y-4">
                  {/* Node info */}
                  <div className="text-sm">
                    <p>
                      <span className="font-semibold">Id:</span> {nodeId}
                    </p>
                    <p>
                      <span className="font-semibold">Type:</span>{" "}
                      {nodeData.type}
                    </p>
                    <p>
                      <span className="font-semibold">Var:</span>{" "}
                      {nodeData?.input?.var}
                    </p>
                    {nodeData.type === "COMPARE" && (
                      <>
                        <p>
                          <span className="font-semibold">Operator:</span>{" "}
                          {nodeData?.operator}
                        </p>
                        <p>
                          <span className="font-semibold">Var:</span>{" "}
                          {nodeData?.right?.const}
                        </p>
                      </>
                    )}
                    <p>
                      <span className="font-semibold">Cate:</span>{" "}
                      {nodeData.cate}
                    </p>
                  </div>

                  {!editMode ? (
                    <div className="space-y-2">
                      <h3 className="font-semibold">Flow</h3>
                      <p>
                        <span className="font-medium">On Pass:</span>{" "}
                        {flowStep?.on_pass?.next
                          ? `Next → ${nodes?.[flowStep.on_pass.next]?.name}`
                          : flowStep?.on_pass?.outcome
                          ? `Outcome → ${flowStep.on_pass.outcome}`
                          : "(none)"}
                        {flowStep?.on_pass?.code
                          ? ` | Code: ${flowStep.on_pass.code}`
                          : ""}
                      </p>

                      <p>
                        <span className="font-medium">On Fail:</span>{" "}
                        {flowStep?.on_fail?.next
                          ? `Next → ${nodes?.[flowStep.on_fail.next]?.name}`
                          : flowStep?.on_fail?.outcome
                          ? `Outcome → ${flowStep.on_fail.outcome}`
                          : "(none)"}
                        {flowStep?.on_fail?.code
                          ? ` | Code: ${flowStep.on_fail.code}`
                          : ""}
                      </p>
                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          onClick={() => setEditMode(true)}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={handleDelete}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="font-semibold">Edit Flow</h3>

                      {/* On Pass */}
                      <div className="border rounded p-3">
                        <h4 className="font-medium mb-2">On Pass</h4>
                        <div className="flex items-center gap-4 mb-2">
                          <label className="flex items-center gap-1">
                            <input
                              type="radio"
                              checked={passType === "next"}
                              onChange={() => setPassType("next")}
                            />
                            Next
                          </label>
                          <label className="flex items-center gap-1">
                            <input
                              type="radio"
                              checked={passType === "outcome"}
                              onChange={() => setPassType("outcome")}
                            />
                            Outcome
                          </label>
                        </div>
                        {passType === "next" ? (
                          <select
                            value={onPassNext}
                            onChange={(e) => setOnPassNext(e.target.value)}
                            className="w-full border rounded px-2 py-1"
                          >
                            <option value="">-- none --</option>
                            {nodeOptions.map((id) => (
                              <option key={id} value={id}>
                                {nodes?.[id]?.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <>
                            <input
                              type="text"
                              value={onPassOutcome}
                              onChange={(e) => setOnPassOutcome(e.target.value)}
                              className="w-full border rounded px-2 py-1"
                              placeholder="Outcome"
                            />
                            <div className="mt-2">
                              <label className="block text-sm font-medium">
                                Code
                              </label>
                              <input
                                type="text"
                                value={onPassCode}
                                onChange={(e) => setOnPassCode(e.target.value)}
                                className="w-full border rounded px-2 py-1"
                              />
                            </div>
                          </>
                        )}
                      </div>

                      {/* On Fail */}
                      {nodeData.type !== "DOMAIN_MAP" && (
                        <div className="border rounded p-3">
                          <h4 className="font-medium mb-2">On Fail</h4>
                          <div className="flex items-center gap-4 mb-2">
                            <label className="flex items-center gap-1">
                              <input
                                type="radio"
                                checked={failType === "next"}
                                onChange={() => setFailType("next")}
                              />
                              Next
                            </label>
                            <label className="flex items-center gap-1">
                              <input
                                type="radio"
                                checked={failType === "outcome"}
                                onChange={() => setFailType("outcome")}
                              />
                              Outcome
                            </label>
                          </div>
                          {failType === "next" ? (
                            <select
                              value={onFailNext}
                              onChange={(e) => setOnFailNext(e.target.value)}
                              className="w-full border rounded px-2 py-1"
                            >
                              <option value="">-- none --</option>
                              {nodeOptions.map((id) => (
                                <option key={id} value={id}>
                                  {nodes?.[id]?.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <>
                              <input
                                type="text"
                                value={onFailOutcome}
                                onChange={(e) =>
                                  setOnFailOutcome(e.target.value)
                                }
                                className="w-full border rounded px-2 py-1"
                                placeholder="Outcome"
                              />
                              <div className="mt-2">
                                <label className="block text-sm font-medium">
                                  Code
                                </label>
                                <input
                                  type="text"
                                  value={onFailCode}
                                  onChange={(e) =>
                                    setOnFailCode(e.target.value)
                                  }
                                  className="w-full border rounded px-2 py-1"
                                />
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          onClick={() => setEditMode(false)}
                          className="px-4 py-2 border rounded hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p></p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
