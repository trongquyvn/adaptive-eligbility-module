"use client";

import React, { useState } from "react";

type Regimen = {
  id: string;
  domain_id: string;
  label: string;
};

type RegimenCreatorProps = {
  domains: { id: string; active: boolean }[];
};

export default function RegimenCreator({ domains }: RegimenCreatorProps) {
  const [regimens, setRegimens] = useState<Regimen[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Regimen>({
    id: "",
    domain_id: "",
    label: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id.trim() || !form.domain_id.trim() || !form.label.trim()) return;

    const newReg: Regimen = {
      id: form.id.trim(),
      domain_id: form.domain_id.trim(),
      label: form.label.trim(),
    };

    setRegimens((prev) => [...prev, newReg]);
    setForm({ id: "", domain_id: "", label: "" });
    setShowModal(false);
  };

  return (
    <div className="">
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
      >
        + Add Regimen
      </button>

      {/* List */}
      <div className="space-y-2">
        {regimens.map((r, i) => (
          <div key={i} className="p-2 border rounded-lg bg-gray-50">
            <div className="font-medium">{r.label}</div>
            <div className="text-xs text-gray-500">
              id: {r.id} • domain: {r.domain_id}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">Create Regimen</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Domain select */}
              <div>
                <label className="block text-sm font-medium">Domain</label>
                <select
                  value={form.domain_id}
                  onChange={(e) =>
                    setForm({ ...form, domain_id: e.target.value })
                  }
                  required
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm"
                >
                  <option value="">-- Select Domain --</option>
                  {domains.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.id} {d.active ? "" : "(inactive)"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Regimen ID */}
              <div>
                <label className="block text-sm font-medium">Regimen ID</label>
                <input
                  type="text"
                  value={form.id}
                  onChange={(e) => setForm({ ...form, id: e.target.value })}
                  required
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm"
                  placeholder="e.g. abx_a"
                />
              </div>

              {/* Label */}
              <div>
                <label className="block text-sm font-medium">Label</label>
                <input
                  type="text"
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  required
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm"
                  placeholder="e.g. ABX Regimen A"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
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
