"use client";

import PatientDetailPage from "@/components/patient/PatientDetailPage";
import { usePatients } from "@/context/PatientContext";
import { useParams } from "next/navigation";

export default function PatientPage() {
  const { patient_id } = useParams<{ patient_id: string }>();
  const { patients } = usePatients();

  const patient = patients.find((e) => e.patient_id === "#" + patient_id);

  if (!patient) {
    return <div>Not found</div>;
  }

  return <PatientDetailPage patient={patient} />;
}
