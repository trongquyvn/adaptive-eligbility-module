"use client";

import React, { useState } from "react";
import TagInput from "@/components/common/TagInput";

type Variable = {
  id: string;
  name: string;
  type: string;
  list?: { id: string; name: string }[];
  multiple?: boolean;
};

export default function VariableCreator() {
  const [showModal, setShowModal] = useState(false);
  const [variables, setVariables] = useState<Variable[]>([]);

  const [form, setForm] = useState({
    name: "",
    type: "BOOLEAN",
  });

  const [listValues, setListValues] = useState<string[]>([]);
  const [multiple, setMultiple] = useState(false);

  const generatedId = form.name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const newVar: Variable = {
      id: generatedId,
      name: form.name.trim(),
      type: form.type,
    };

    if (form.type === "LIST") {
      newVar.list = listValues.map((val, idx) => ({
        id: String(idx + 1),
        name: val,
      }));
      newVar.multiple = multiple;
    }

    setVariables((prev) => [...prev, newVar]);

    // reset
    setForm({ name: "", type: "BOOLEAN" });
    setListValues([]);
    setMultiple(false);
    setShowModal(false);
  };

  return (
    <div className="">
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
      >
        + Add Variable
      </button>

      {/* List hiển thị */}
      <div className="space-y-2">
        {variables.map((v, i) => (
          <div
            key={i}
            className="p-2 border rounded-lg flex flex-col gap-1 bg-gray-50"
          >
            <div className="font-medium">{v.name}</div>
            <div className="text-xs text-gray-500">
              id: {v.id} • type: {v.type}
              {v.type === "LIST" && v.multiple && " • multiple: true"}
            </div>
            {v.type === "LIST" && v.list && (
              <div className="text-xs text-gray-700">
                List:{" "}
                {v.list.map((item) => (
                  <span
                    key={item.id}
                    className="inline-block px-2 py-0.5 mr-1 rounded-full bg-purple-100 text-purple-700"
                  >
                    {item.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">Create Variable</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm"
                  required
                />
              </div>

              {/* ID (auto) */}
              <div>
                <label className="block text-sm font-medium">ID</label>
                <input
                  type="text"
                  value={generatedId}
                  disabled
                  className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-100 shadow-sm text-gray-600"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm"
                >
                  <option value="BOOLEAN">BOOLEAN</option>
                  <option value="TIME">TIME</option>
                  <option value="NUMBER">NUMBER</option>
                  <option value="DATA">DATA</option>
                  <option value="LIST">LIST</option>
                </select>
              </div>

              {/* List Input nếu chọn LIST */}
              {form.type === "LIST" && (
                <div className="space-y-3">
                  <TagInput
                    label="List Items"
                    value={listValues}
                    onChange={setListValues}
                    placeholder="Nhập item và Enter"
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
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
