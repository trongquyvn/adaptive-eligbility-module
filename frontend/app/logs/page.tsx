// app/logs/page.tsx
"use client";

import Logs from "@/components/logs";
import { usePatients } from "@/context/PatientContext";

export default function LogsPage() {
  const { logs } = usePatients();

  return <Logs logs={logs} loading={false} />;
}
