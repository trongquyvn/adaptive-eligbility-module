"use client";
import VariableTable from "@/components/variable/VariableTable";
import { usePatients } from "@/context/PatientContext";

export default function Index() {
  const { rule } = usePatients();
  const variables = rule?.variables || []

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Variables</h2>
      <VariableTable variables={variables} cate="1" />
    </div>
  );
}
