"use client";

import { useState } from "react";

interface Rule {
  trial: {
    id: string;
    version: string;
    jurisdiction: string[];
    effective_from: string;
  };
  metadata: {
    title: string;
    description: string;
    author: string;
    created_at: string;
  };
}

interface RuleCreatorProps {
  onCreate: (rule: Rule) => void;
  onCancel?: () => void;
  open: boolean;
}

export default function RuleCreator({
  open,
  onCreate,
  onCancel,
}: RuleCreatorProps) {
  const initForm = {
    trial: {
      id: "",
      version: "",
      jurisdiction: ["AU", "NZ", "UK"] as string[],
      effective_from: new Date().toISOString(),
    },
    metadata: {
      title: "",
      description: "",
      author: "admin",
      created_at: new Date().toISOString(),
    },
  };
  const [form, setForm] = useState(initForm);

  const handleChange = (
    section: "trial" | "metadata" | "root",
    field: string,
    value: string | boolean
  ) => {
    if (section === "trial") {
      setForm({
        ...form,
        trial: { ...form.trial, [field]: value },
      });
    } else if (section === "metadata") {
      setForm({
        ...form,
        metadata: { ...form.metadata, [field]: value },
      });
    } else {
      setForm({ ...form, [field]: value as boolean });
    }
  };

  const handleJurisdictionChange = (value: string) => {
    const arr = value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    setForm({ ...form, trial: { ...form.trial, jurisdiction: arr } });
  };

  const handleSubmit = () => {
    if (!form.trial.id || !form.trial.version || !form.metadata.title) return;
    onCreate(form);
    setForm(initForm);
  };
  const isValid = form.trial.id && form.trial.version && form.metadata.title;

  if (!open) return <></>;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold">Create New</h2>

        {/* Trial Info */}
        <div className="space-y-2">
          <h3 className="font-medium">Trial</h3>
          <input
            type="text"
            placeholder="Trial ID"
            value={form.trial.id}
            onChange={(e) =>
              handleChange("trial", "id", e.target.value.replace(/\s+/g, ""))
            }
            className="w-full border rounded px-3 py-1"
          />
          <input
            type="text"
            placeholder="Version"
            value={form.trial.version}
            onChange={(e) => handleChange("trial", "version", e.target.value)}
            className="w-full border rounded px-3 py-1"
          />
          <input
            type="text"
            placeholder="Jurisdiction (comma separated)"
            value={form.trial.jurisdiction.join(", ")}
            onChange={(e) => handleJurisdictionChange(e.target.value)}
            className="w-full border rounded px-3 py-1"
          />
          <input
            type="date"
            value={form.trial.effective_from.split("T")[0] || ""}
            onChange={(e) =>
              handleChange("trial", "effective_from", e.target.value)
            }
            className="w-full border rounded px-3 py-1"
          />
        </div>

        {/* Metadata */}
        <div className="space-y-2 mt-4">
          <h3 className="font-medium">Metadata</h3>
          <input
            type="text"
            placeholder="Title"
            value={form.metadata.title}
            onChange={(e) => handleChange("metadata", "title", e.target.value)}
            className="w-full border rounded px-3 py-1"
          />
          <textarea
            placeholder="Description"
            value={form.metadata.description}
            onChange={(e) =>
              handleChange("metadata", "description", e.target.value)
            }
            className="w-full border rounded px-3 py-1"
          />
          <input
            type="text"
            placeholder="Author"
            value={form.metadata.author}
            onChange={(e) => handleChange("metadata", "author", e.target.value)}
            className="w-full border rounded px-3 py-1"
          />
          <input
            type="date"
            value={form.metadata.created_at.split("T")[0]}
            onChange={(e) =>
              handleChange("metadata", "created_at", e.target.value)
            }
            className="w-full border rounded px-3 py-1"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className={`px-4 py-2 rounded text-white ${
              isValid
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
