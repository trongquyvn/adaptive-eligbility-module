"use client";
import { usePatients } from "@/context/PatientContext";
import RegimenTable from "@/components/variable/RegimenTable";
import NodesTable from "@/components/variable/NodesTable";

export default function Index() {
  const { rule } = usePatients();
  const regimens = rule?.regimen_catalog || [];
  const nodes = rule?.logic?.nodes || [];

  return (
    <div>
      <div>
        <h2 className="text-lg font-semibold mb-2">Regimens</h2>
        <RegimenTable regimens={regimens} />
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Nodes</h2>
        <NodesTable nodes={nodes} cate="4" />
      </div>
    </div>
  );
}
