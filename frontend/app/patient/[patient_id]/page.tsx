"use client";

import PatientDetailPage from "@/components/patient/PatientDetailPage";
import { usePatients } from "@/context/PatientContext";
import { use } from "react";

export default function PatientDetail({ params }: { params: Promise<{ patient_id: string }> }) {
  const { patient_id } = use(params);
  const { patients } = usePatients();
  const patient = patients.find((e) => e.id === patient_id);

  // Enhanced error handling with user-friendly messages
  if (!patient) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            Patient Not Found
          </h2>
          <p className="text-red-600">
            Unable to find patient with ID:{" "}
            <span className="font-mono bg-red-100 px-2 py-1 rounded">
              {patient_id}
            </span>
          </p>
          <p className="text-red-500 text-sm mt-2">
            This could be due to an invalid ID, network issues, or the patient
            may not exist in the system.
          </p>
        </div>
      </div>
    );
  }

  return <PatientDetailPage patient={patient} />;
}
