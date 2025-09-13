"use client";

import { useParams } from "next/navigation";
import PatientLogModal from "@/components/patient/PatientLogModal";

export default function PatientPage() {
  const { patient_id } = useParams<{ patient_id: string }>();

  // return <PatientLogModal />;
}
