"use client";
import { usePatients } from "@/context/PatientContext";
import NodesTable from "@/components/variable/NodesTable";

export default function Index() {
  const { rule } = usePatients();
  const nodes = rule?.logic?.nodes || [];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Nodes</h2>
      <NodesTable nodes={nodes} cate="5"/>
    </div>
  );
}
