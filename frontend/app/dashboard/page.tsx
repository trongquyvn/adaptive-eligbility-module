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

export default function DashboardPage() {
  const { patients: initPatients } = usePatients();
  console.log('initPatients: ', initPatients);

  const [patients, setPatients] = useState<Patient[]>([
    { id: "#123A", site: "Site A", date: "00/00/0000", status: "Eligible" },
    { id: "#123B", site: "Site A", date: "00/00/0000", status: "Ineligible" },
    { id: "#123C", site: "Site A", date: "00/00/0000", status: "Pending" },
  ]);

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
        <h2 className="text-xl">REMAP-CAP v2.4</h2>

        <button
          onClick={handleCreatePatient}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          + Create New Patient
        </button>
      </div>

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
