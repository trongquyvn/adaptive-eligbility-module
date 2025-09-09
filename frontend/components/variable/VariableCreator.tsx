"use client";

import React, { useState } from "react";
import { cateList } from "@/contanst";

type Variable = {
  id: string;
  name: string;
  type: string;
  cate: string;
};

export default function VariableCreator() {
  const [showModal, setShowModal] = useState(false);
  const [variables, setVariables] = useState<Variable[]>([]);

  const [form, setForm] = useState({
    cate: cateList[0].id,
    name: "",
    type: "BOOLEAN",
  });

  const generatedId = form.name.trim().toLowerCase().replace(/\s+/g, "_");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;

    const newVar: Variable = {
      id: generatedId,
      name: form.name,
      type: form.type,
      cate: form.cate,
    };

    setVariables((prev) => [...prev, newVar]);
    setForm({ cate: cateList[0].id, name: "", type: "BOOLEAN" });
    setShowModal(false);
  };

  return (
    <div className="">
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
      >
        + Add Variables
      </button>

      {/* List hiện tại */}
      <div className="space-y-2">
        {variables.map((v, i) => (
          <div
            key={i}
            className="p-2 border rounded-lg flex justify-between items-center"
          >
            <div>
              <div className="font-medium">{v.name}</div>
              <div className="text-xs text-gray-500">
                id: {v.id} • type: {v.type} • cate: {v.cate}
              </div>
            </div>
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
                  <option value="TIME_WINDOW">TIME_WINDOW</option>
                  <option value="NUMBER">NUMBER</option>
                  <option value="DATA">DATA</option>
                </select>
              </div>

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
