"use client";
import { usePatients } from "@/context/PatientContext";
import DomainTable from "@/components/variable/DomainTable";
import NodesTable from "@/components/variable/NodesTable";

export default function Index() {
  const { rule } = usePatients();
  const domains = rule?.domain_catalog || [];
  const nodes = rule?.logic?.nodes || {};

  return (
    <div>
      <div>
        <h2 className="text-lg font-semibold mb-2">Domains</h2>
        <DomainTable domains={domains} />
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Nodes</h2>
        <NodesTable nodes={nodes} cate="3" />
      </div>
    </div>
  );
}
