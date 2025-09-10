"use client";

import React, { useState } from "react";

type Domain = {
  id: string;
  active: boolean;
};

export default function DomainCreator() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Domain>({ id: "", active: true });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id.trim()) return;

    const newDomain: Domain = {
      id: form.id.trim(),
      active: form.active,
    };

    setDomains((prev) => [...prev, newDomain]);
    setForm({ id: "", active: true });
    setShowModal(false);
  };

  return (
    <div className="">
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        + Add Domain
      </button>

      {/* List */}
      <div className="space-y-2">
        {domains.map((d, i) => (
          <div key={i} className="p-2 border rounded-lg bg-gray-50">
            <div className="font-medium">{d.id}</div>
            <div className="text-xs text-gray-500">
              active: {d.active ? "true" : "false"}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">Create Domain</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* ID nhập trực tiếp */}
              <div>
                <label className="block text-sm font-medium">Domain ID</label>
                <input
                  type="text"
                  value={form.id}
                  onChange={(e) => setForm({ ...form, id: e.target.value })}
                  required
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm"
                  placeholder="e.g. antibiotics"
                />
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="rounded border-gray-300"
                />
                Active
              </label>

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
                  className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700"
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
