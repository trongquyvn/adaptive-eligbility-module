"use client";

import { usePatients } from "@/context/PatientContext";
import { useToast } from "@/context/ToastContext";
import { updateRule } from "@/lib/rule";
import React, { useState } from "react";

type Domain = {
  id: string;
  active: boolean;
};

export default function DomainCreator() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Domain>({ id: "", active: true });
  const { rule, updateActiveRule } = usePatients();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id.trim()) return;

    const newDomain: Domain = {
      id: form.id.trim(),
      active: form.active,
    };
    const check = rule.domain_catalog.find((e: any) => e.id === newDomain.id);
    if (check) {
      showToast("Domain already exists!", "info");
    } else {
      const newRule = {
        ...rule,
        domain_catalog: [...rule.domain_catalog, newDomain],
      };

      const result = await updateRule(rule._id, newRule);
      if (result) {
        updateActiveRule(result);
        showToast("Add domain!", "success");
      }
    }

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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">Create Domain</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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

              {/* <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="rounded border-gray-300"
                />
                Active
              </label> */}

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
