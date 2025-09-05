"use client";

import { useState } from "react";
import Modal from "../common/Modal";
import TagInput from "../common/TagInput";
import SingleTagSelect from "../common/SingleTagSelect";

interface Patient {
  id: string;
  age: string;
  sex: string;
  site: string;
  date: string;
  status: string;
  reason: string;
}

interface CreatePatientDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePatient: (patient: Omit<Patient, "id">) => void;
}

export default function CreatePatientDialog({
  isOpen,
  onClose,
  onCreatePatient,
}: CreatePatientDialogProps) {
  const [formData, setFormData] = useState({
    createdId: "#1234",
    age: "",
    sex: "",
    capFeatures: [] as string[],
    contraindications: [] as string[],
    icuTimings: [] as string[],
    consent: "",
    clinicalState: [] as string[],
    site: "",
    dateScreened: "",
    eligibilityStatus: "",
    reason: "",
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onCreatePatient({
      age: formData.age,
      sex: formData.sex,
      site: formData.site,
      date: formData.dateScreened,
      status: formData.eligibilityStatus,
      reason: formData.reason,
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col h-full">
        {/* Header */}
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

        {/* Body (scrollable if needed) */}
        <div className="flex-1 overflow-y-auto py-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Created ID */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Created ID
              </label>
              <input
                type="text"
                value={formData.createdId}
                disabled
                className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-600"
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium mb-1">Age *</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleChange("age", e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter age"
              />
            </div>

            {/* Sex */}
            <div>
              <label className="block text-sm font-medium mb-1">Sex *</label>
              <select
                value={formData.sex}
                onChange={(e) => handleChange("sex", e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select sex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* CAP Features */}
            <TagInput
              label="CAP Features"
              value={formData.capFeatures}
              onChange={(val) => handleChange("capFeatures", val)}
              required
              options={[
                "Cough",
                "Fever",
                "Shortness of breath",
                "Chest pain",
                "Sputum production",
              ]}
              color="blue"
            />

            {/* Contraindications */}
            <TagInput
              label="Contraindications"
              value={formData.contraindications}
              onChange={(val) => handleChange("contraindications", val)}
              required
              color="red"
            />

            {/* ICU Timings */}
            <TagInput
              label="ICU Timings"
              value={formData.icuTimings}
              onChange={(val) => handleChange("icuTimings", val)}
              required
              color="green"
            />

            {/* Consent */}
            <div>
              <SingleTagSelect
                label="Consent"
                value={formData.consent}
                onChange={(val) => handleChange("consent", val)}
                required
                options={[
                  { label: "Obtained", value: "Obtained", color: "blue" },
                  {
                    label: "Not obtained",
                    value: "Not obtained",
                    color: "red",
                  },
                ]}
              />
            </div>

            {/* Clinical State */}
            <TagInput
              label="Clinical State"
              value={formData.clinicalState}
              onChange={(val) => handleChange("clinicalState", val)}
              required
              color="green"
            />

            {/* Site */}
            <div>
              <label className="block text-sm font-medium mb-1">Site *</label>
              <select
                value={formData.site}
                onChange={(e) => handleChange("site", e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select Site</option>
                <option value="Site A">Site A</option>
                <option value="Site B">Site B</option>
              </select>
            </div>

            {/* Date screened */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Date screened *
              </label>
              <input
                type="date"
                value={formData.dateScreened}
                onChange={(e) => handleChange("dateScreened", e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            {/* Eligibility Status */}
            <div>
              <SingleTagSelect
                label="Eligibility Status"
                value={formData.eligibilityStatus}
                onChange={(val) => handleChange("eligibilityStatus", val)}
                required
                options={[
                  { label: "Eligible", value: "Eligible", color: "green" },
                  { label: "Ineligible", value: "Ineligible", color: "red" },
                  { label: "Pending", value: "Pending", color: "gray" },
                ]}
              />
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium mb-1">Reason *</label>
              <textarea
                value={formData.reason}
                onChange={(e) => handleChange("reason", e.target.value)}
                placeholder="What has been decided?"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </form>
        </div>

        {/* Footer (fixed at bottom) */}
        <div className="flex justify-end gap-3 border-t pt-4 pb-4 sticky bottom-0 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="createPatientForm"
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Create Patient
          </button>
        </div>
      </div>
    </Modal>
  );
}
