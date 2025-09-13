"use client";

import { useState } from "react";
import PatientTable from "@/components/patient/PatientTable";
import CreatePatientDialog from "@/components/patient/CreatePatientDialog";
import { usePatients } from "@/context/PatientContext";
import { useToast } from "@/context/ToastContext";
import { API_BASE_URL } from "@/constants";

async function savePatients(body: any) {
  const res = await fetch(`${API_BASE_URL}/api/patient`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Failed to save patients");
  return res.json();
}

export default function PatientPage() {
  const { activeDataKey, patients: initPatients, addPatient } = usePatients();
  const { showToast } = useToast();

  const patients = initPatients.map((e) => {
    return {
      id: e.patient_id,
      site: e.site || "Site A",
      date: e.createAt || "",
      eligibility: {
        isDraft: e?.eligibility?.isDraft,
      },
    };
  });

  const [isCreatePatientModalOpen, setIsCreatePatientModalOpen] =
    useState(false);

  const handleCreatePatient = () => {
    setIsCreatePatientModalOpen(true);
  };

  const handleCreatePatientSubmit = async (
    patientData: any,
    isDraft: boolean
  ) => {
    // Generate patient ID
    const patientId = `${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(3, "0")}${String.fromCharCode(
      65 + Math.floor(Math.random() * 26)
    )}`;

    const jurisdiction = patientData.jurisdiction;
    delete patientData.jurisdiction;
    const newPatient: any = {
      patient_id: patientId,
      jurisdiction,
      data: {
        [activeDataKey]: patientData,
      },
      eligibility: {
        isDraft,
      },
    };

    const result = await savePatients(newPatient);
    if (result) {
      addPatient(result);
      showToast("Patient is save", "success");
    }
  };

  return (
    <section>
      <div className="mb-4 flex justify-between">
        <h2 className="text-xl">
          REMAP-CAP
          <span className="text-xs"> v2.4</span>
        </h2>

        <button
          onClick={handleCreatePatient}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          + Create New Patient
        </button>
      </div>

      <br />

      <PatientTable patients={patients} />

      {/* Create Patient Modal */}
      <CreatePatientDialog
        isOpen={isCreatePatientModalOpen}
        onClose={() => setIsCreatePatientModalOpen(false)}
        onCreatePatient={(e, a) => {
          handleCreatePatientSubmit(e, a);
        }}
      />
    </section>
  );
}
