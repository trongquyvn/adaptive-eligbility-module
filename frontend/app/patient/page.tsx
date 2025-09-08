"use client";

import { useState } from "react";
import PatientTable from "@/components/patient/PatientTable";
import CreatePatientDialog from "@/components/patient/CreatePatientDialog";
import { usePatients } from "@/context/PatientContext";

interface Patient {
  id: string;
  site: string;
  date: string;
  status: string;
}

export default function PatientPage() {
  const { patients: initPatients } = usePatients();

  const viewPatients = initPatients.map((e) => {
    return {
      id: e.id,
      site: e.site || "Site A",
      date: e.createAt || '',
      status: e?.eligibility?.status,
    };
  });

  const [patients, setPatients] = useState<Patient[]>(viewPatients);

  const [isCreatePatientModalOpen, setIsCreatePatientModalOpen] =
    useState(false);

  const handleCreatePatient = () => {
    setIsCreatePatientModalOpen(true);
  };

  const handleCreatePatientSubmit = (patientData: Omit<Patient, "id">) => {
    // Generate patient ID
    const patientId = `#${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(3, "0")}${String.fromCharCode(
      65 + Math.floor(Math.random() * 26)
    )}`;

    const newPatient: Patient = {
      id: patientId,
      ...patientData,
    };

    setPatients((prev) => [...prev, newPatient]);
    setIsCreatePatientModalOpen(false);
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
        onCreatePatient={handleCreatePatientSubmit}
      />
    </section>
  );
}
