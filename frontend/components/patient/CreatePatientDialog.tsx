"use client";

import { useState, useMemo, useEffect } from "react";
import Modal from "../common/Modal";
import TagInput from "../common/TagInput";
import SingleTagSelect from "../common/SingleTagSelect";
import { collectInputVars, objExpandKeys } from "@/lib/common";
import { usePatients } from "@/context/PatientContext";
import {
  // Calendar,
  CheckCircle,
  Hash,
  FileText,
  Tags,
} from "lucide-react";

interface CreatePatientDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePatient: (data: Record<string, any>, a: boolean) => void;
  initForm?: Record<string, any>;
}

export default function CreatePatientDialog({
  isOpen,
  onClose,
  onCreatePatient,
  initForm = {}, // default {}
}: CreatePatientDialogProps) {
  const { rule } = usePatients();
  const varDefs = rule.variables;
  const inputVars = collectInputVars(rule);

  // Group variables by prefix (e.g., feat.fever and feat.registry → feat)
  const groups = useMemo(
    () => groupVariablesByPrefix(varDefs, inputVars),
    [varDefs, inputVars]
  );

  // Store form state
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (isOpen) {
      setFormData(initForm);
    }
  }, [isOpen]);

  const handleSubmit = (isDraft: boolean = false) => {
    const form = { ...formData };

    // Validate all required fields
    const name = [];
    if (!form["jurisdiction"]) {
      name.push("Jurisdiction");
    }

    const keys = Object.keys(groups);
    keys.forEach((k) => {
      if (groups[k].length === 1) {
        const node = groups[k][0];
        if (!form[node.id]) {
          name.push(node.name);
        } else {
          if (node.type === "TIME_WINDOW") {
            form[node.id] = new Date(form[node.id]).toISOString();
          }
        }
      } else {
        form[k] = {};
        groups[k].forEach((e) => {
          if (formData?.[k]?.includes(e.name)) {
            form[e.id] = true;
          }
        });
      }
    });

    if (name.length && !isDraft) {
      alert(`Fields: ${name.join(", ")} is(are) required!`);
      return;
    }

    const newNodeData = objExpandKeys(form);
    onCreatePatient(newNodeData, isDraft);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col h-full">
        <div className="flex items-start gap-3 border-b pb-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100">
            <span className="text-purple-600 text-xl font-bold">(x)</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Create New Patient
            </h2>
            <p className="text-sm text-gray-500">
              Worem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
        </div>

        <div className="space-y-4 overflow-y-auto mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">ID *</label>
            <div className="">
              <input
                type="text"
                value={formData["id"] || ''}
                onChange={(e) => handleChange("id", e.target.value)}
                className="w-full pl-2 pr-3 py-2 border rounded-md"
              />
            </div>
          </div>

          <div className="">
            <SingleTagSelect
              label="Jurisdiction"
              value={formData["jurisdiction"] || []}
              onChange={(val) => handleChange("jurisdiction", val)}
              options={rule?.trial?.jurisdiction.map((e: any) => {
                return {
                  label: e,
                  value: e,
                  color: "green",
                };
              })}
              placeholder="Select jurisdiction"
            />
          </div>

          {Object.entries(groups).map(([prefix, defs]) => {
            // If multiple vars share the same prefix → TagInput with icon
            if (defs.length > 1) {
              return (
                <div key={prefix}>
                  <label className="block text-sm font-medium mb-1">
                    {prefix} *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500">
                      <Tags className="w-5 h-5" />
                    </span>
                    <div className="pl-8">
                      <TagInput
                        label=""
                        value={formData[prefix] || []}
                        onChange={(val) => handleChange(prefix, val)}
                        options={defs.map((d) => d.name)}
                        color="blue"
                      />
                    </div>
                  </div>
                </div>
              );
            }

            // Single variable → render based on type
            const def = defs[0];
            const val = formData[def.id] ?? "";

            switch (def.type) {
              case "BOOLEAN":
                return (
                  <div key={def.id}>
                    <label className="block text-sm font-medium mb-1">
                      {def.name} *
                    </label>
                    <div className="flex items-center gap-4">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={def.id}
                          value="true"
                          checked={val === "true"}
                          onChange={(e) => handleChange(def.id, e.target.value)}
                        />
                        Yes
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={def.id}
                          value="false"
                          checked={val === "false"}
                          onChange={(e) => handleChange(def.id, e.target.value)}
                        />
                        No
                      </label>
                    </div>
                  </div>
                );

              case "TIME_WINDOW":
                return (
                  <div key={def.id}>
                    <label className="block text-sm font-medium mb-1">
                      {def.name} *
                    </label>
                    <div className="">
                      <input
                        type="datetime-local"
                        value={val}
                        onChange={(e) => handleChange(def.id, e.target.value)}
                        className="w-full pl-2 pr-3 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                );

              case "NUMBER":
                return (
                  <div key={def.id}>
                    <label className="block text-sm font-medium mb-1">
                      {def.name} *
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500">
                        <Hash className="w-5 h-5" />
                      </span>
                      <input
                        type="number"
                        value={val}
                        onChange={(e) => handleChange(def.id, e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                );

              case "DATA":
              default:
                return (
                  <div key={def.id}>
                    <label className="block text-sm font-medium mb-1">
                      {def.name} *
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500">
                        <FileText className="w-5 h-5" />
                      </span>
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => handleChange(def.id, e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                );
            }
          })}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>

            {!Object.keys(initForm).length ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    handleSubmit(true);
                  }}
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Save draft
                </button>

                <button
                  onClick={() => {
                    handleSubmit(false);
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Create Patient
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    handleSubmit(false);
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Update Patient
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

function groupVariablesByPrefix(varDefs: any[], inputVars: string[]) {
  const groups: Record<string, any[]> = {};
  inputVars.forEach((id) => {
    const def = varDefs.find((d) => d.id === id);
    if (!def) return;
    if (def.type === "BOOLEAN") {
      const prefix = id.includes(".") ? id.split(".")[0] : id;
      if (!groups[prefix]) groups[prefix] = [];
      groups[prefix].push(def);
    } else {
      groups[def.id] = [def];
    }
  });
  return groups;
}
