"use client";

import { useEffect, useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { usePatients } from "@/context/PatientContext";
import Modal from "../common/Modal";

interface CompareNode {
  id: string;
  name: string;
  rightConst: any;
}

interface Override {
  when: { jurisdiction: string };
  patch: {
    op: string;
    path: string;
    value?: any;
  }[];
}

export default function OverrideButton({
  initForm,
  onSave,
}: {
  initForm?: Override[];
  onSave?: (overrides: Override[]) => void;
}) {
  const { rule } = usePatients();
  const [open, setOpen] = useState(false);
  const [overrides, setOverrides] = useState<Override[]>([
    {
      when: { jurisdiction: "" },
      patch: [{ op: "replace", path: "", value: "" }],
    },
  ]);

  useEffect(() => {
    if (initForm?.length) {
      setOverrides(initForm);
    } else {
      setOverrides([
        {
          when: { jurisdiction: "" },
          patch: [{ op: "replace", path: "", value: "" }],
        },
      ]);
    }
  }, [initForm]);

  // Extract COMPARE nodes
  const compareNodes: CompareNode[] = Object.entries(rule?.logic?.nodes || {})
    .filter(([_, n]: any) => n.type === "COMPARE")
    .map(([id, n]: any) => ({
      id,
      name: n?.name,
      rightConst: n?.right?.const,
    }));

  const jurisdictionOptions: string[] = rule?.trial?.jurisdiction || [];

  const handleSave = () => {
    onSave?.(overrides);
    setOpen(false);
  };

  const updateOverride = (
    oIdx: number,
    pIdx: number,
    key: "op" | "path" | "value" | "jurisdiction",
    value: any
  ) => {
    const copy = [...overrides];
    if (key === "jurisdiction") {
      copy[oIdx].when.jurisdiction = value;
    } else {
      copy[oIdx].patch[pIdx][key] = value;
    }
    setOverrides(copy);
  };

  const addOverride = () => {
    setOverrides([
      ...overrides,
      {
        when: { jurisdiction: "" },
        patch: [{ op: "replace", path: "", value: "" }],
      },
    ]);
  };

  const removeOverride = (idx: number) => {
    const copy = [...overrides];
    copy.splice(idx, 1);
    setOverrides(copy);
  };

  return (
    <div>
      {/* Button */}
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700"
      >
        Overrides
      </button>

      {/* Popup */}
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {initForm ? "Edit Overrides" : "Create Overrides"}
          </h2>
          <button onClick={() => setOpen(false)}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Overrides list */}
        <div className="space-y-6">
          {overrides.map((ovr, oIdx) => (
            <div
              key={oIdx}
              className="border rounded-lg p-4 bg-gray-50 relative"
            >
              {/* Jurisdiction */}
              <div className="mb-4">
                <label className="block text-sm mb-1">Jurisdiction</label>
                <select
                  value={ovr.when.jurisdiction}
                  onChange={(e) =>
                    updateOverride(oIdx, 0, "jurisdiction", e.target.value)
                  }
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select jurisdiction</option>
                  {jurisdictionOptions.map((j) => (
                    <option key={j} value={j}>
                      {j}
                    </option>
                  ))}
                </select>
              </div>

              {/* Patch list */}
              <div className="space-y-4">
                {ovr.patch.map((p, pIdx) => (
                  <div
                    key={pIdx}
                    className="border p-3 rounded-md bg-white relative"
                  >
                    {/* Node */}
                    <div className="mb-3">
                      <label className="block text-sm mb-1">Target Node</label>
                      <select
                        value={p.path}
                        onChange={(e) =>
                          updateOverride(oIdx, pIdx, "path", e.target.value)
                        }
                        className="w-full border rounded px-3 py-2"
                      >
                        <option value="">Select Node</option>
                        {compareNodes.map((n) => (
                          <option
                            key={n.id}
                            value={`/logic/nodes/${n.id}/right/const`}
                          >
                            {n.name} (const={n.rightConst})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Operation */}
                    <div className="mb-3">
                      <label className="block text-sm mb-1">Operation</label>
                      <select
                        value={p.op}
                        onChange={(e) =>
                          updateOverride(oIdx, pIdx, "op", e.target.value)
                        }
                        className="w-full border rounded px-3 py-2"
                      >
                        <option value="replace">replace</option>
                        {/* <option value="add">add</option>
                            <option value="remove">remove</option> */}
                      </select>
                    </div>

                    {/* Value */}
                    {p.op !== "remove" && (
                      <div className="mb-3">
                        <label className="block text-sm mb-1">Value</label>
                        <input
                          type="text"
                          value={p.value}
                          onChange={(e) =>
                            updateOverride(oIdx, pIdx, "value", e.target.value)
                          }
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Remove override */}
              <button
                onClick={() => removeOverride(oIdx)}
                className="absolute top-2 right-2 text-red-600 hover:bg-red-50 rounded-full p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add new override */}
        <div className="mt-4">
          <button
            onClick={addOverride}
            className="flex items-center gap-1 text-sm px-3 py-1 border rounded hover:bg-gray-100"
          >
            <Plus className="w-4 h-4" /> Add Override
          </button>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg"
          >
            Save
          </button>
        </div>
      </Modal>
    </div>
  );
}
