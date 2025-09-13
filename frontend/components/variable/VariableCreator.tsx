"use client";

import React, { useEffect, useState } from "react";
import TagInput from "@/components/common/TagInput";
import { usePatients } from "@/context/PatientContext";
import { useToast } from "@/context/ToastContext";
import { updateRule } from "@/lib/rule";

type Variable = any;

interface VariableCreatorProps {
  initForm?: Variable | null;
  trigger?: React.ReactNode; // optional: custom button
  onClose?: () => void;
}

export default function VariableCreator({
  initForm,
  trigger,
  onClose,
}: VariableCreatorProps) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "BOOLEAN",
  });
  const { rule, updateActiveRule } = usePatients();
  const { showToast } = useToast();

  const [listValues, setListValues] = useState<string[]>([]);
  const [multiple, setMultiple] = useState(false);

  // fill data khi edit
  useEffect(() => {
    if (initForm) {
      setShowModal(true);
      setForm({ name: initForm.name, type: initForm.type });
      // setListValues(initForm.codes || []);
      // setMultiple(!!initForm.multiple);
    }
  }, [initForm]);

  const generatedId = form.name.trim().toLowerCase().replace(/\s+/g, ".");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const newVar: Variable = {
      id: generatedId,
      name: form.name.trim(),
      type: form.type,
    };

    if (form.type === "CODES") {
      newVar.codes = listValues;
      newVar.multiple = multiple;
    }

    let newVariables;
    if (initForm) {
      // update mode
      newVariables = rule.variables.map((v: any) =>
        v.id === initForm.id ? newVar : v
      );
    } else {
      // create mode
      const check = rule.variables.find((e: any) => e.id === newVar.id);
      if (check) {
        showToast("Variable already exists!", "info");
        return;
      }
      newVariables = [...rule.variables, newVar];
    }

    const newRule = {
      ...rule,
      variables: newVariables,
    };

    const result = await updateRule(rule._id, newRule);
    if (result) {
      updateActiveRule(result);
      showToast(initForm ? "Updated Variable!" : "Added Variable!", "success");
    }

    // reset
    setForm({ name: "", type: "BOOLEAN" });
    setListValues([]);
    setMultiple(false);
    setShowModal(false);
  };

  return (
    <div>
      {trigger ? (
        <span onClick={() => setShowModal(true)}>{trigger}</span>
      ) : (
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white shadow hover:bg-blue-700"
        >
          {initForm ? "Edit Variable" : "+ Add Variable"}
        </button>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">
              {initForm ? "Edit Variable" : "Create Variable"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={
                    "mt-1 block w-full border rounded " + !!initForm ? "disabled" : ""
                  }
                  required
                  disabled={!!initForm}
                />
              </div>

              {/* ID (auto) */}
              <div>
                <label className="block text-sm font-medium">ID</label>
                <input
                  type="text"
                  value={generatedId}
                  disabled
                  className="mt-1 block w-full border-gray-200 bg-gray-100 shadow-sm text-gray-600"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="mt-1 block w-full border-gray-300 shadow-sm"
                >
                  <option value="BOOLEAN">BOOLEAN</option>
                  <option value="TIME_WINDOW">TIME_WINDOW</option>
                  <option value="NUMBER">NUMBER</option>
                  <option value="DATA">DATA</option>
                  {/* <option value="CODES">CODES</option> */}
                </select>
              </div>

              {form.type === "CODES" && (
                <div className="space-y-3">
                  <TagInput
                    label="List Items"
                    value={listValues}
                    onChange={setListValues}
                    placeholder="Fill and Enter"
                    color="purple"
                  />
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={multiple}
                      onChange={(e) => setMultiple(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    Allow Multiple Selection
                  </label>
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    onClose?.();
                    setShowModal(false);
                  }}
                  className="px-3 py-1.5 border border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700"
                >
                  {initForm ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
