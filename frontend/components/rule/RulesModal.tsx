"use client";

import { useState } from "react";

interface RulesModalProps {
  active: number;
  open: boolean;
  rules: Record<string, any>[];
  onClose: () => void;
  onCreate: () => void;
  onActive: (n: number) => void;
}

export default function RulesModal({
  active,
  open,
  rules,
  onClose,
  onCreate,
  onActive,
}: RulesModalProps) {
  return (
    <div>
      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          {/* Modal box */}
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">List</h2>
              <button
                onClick={() => {
                  onCreate();
                }}
                className="px-4 py-2 border rounded-lg"
              >
                Create Trial Builder
              </button>
            </div>

            {rules.map((rule, idx) => (
              <div
                key={idx}
                className="border rounded-lg p-4 mb-4 bg-gray-50 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-purple-700">
                    {rule?.metadata.title}
                  </div>
                  {active === idx && (
                    <span className="px-2 py-0.5 text-xs rounded bg-green-100 text-green-700">
                      Active
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600 italic">
                  {rule?.metadata.description}
                </div>

                <div className="text-sm">
                  <span className="font-medium">ID:</span> {rule?.trial.id} (
                  {rule?.trial.version})
                </div>
                <div className="text-sm">
                  <span className="font-medium">Jurisdiction:</span>{" "}
                  {rule?.trial.jurisdiction.join(", ")}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Effective From:</span>{" "}
                  {new Date(rule?.trial.effective_from).toLocaleDateString()}
                </div>

                <div className="text-sm">
                  <span className="font-medium">Author:</span>{" "}
                  {rule?.metadata.author}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Created At:</span>{" "}
                  {new Date(rule?.metadata.created_at).toLocaleDateString()}
                </div>

                <button
                  onClick={() => {
                    onActive(idx);
                  }}
                  className="text-purple-700 border rounded-lg p-1 font-semibold"
                >
                  Set active
                </button>
              </div>
            ))}

            <div className="mt-6 text-right">
              <button onClick={onClose} className="px-4 py-2 rounded-lg">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
