"use client";

import { ruleToMermaid } from "@/lib/ruleToMermaid";
import MermaidChart from "@/components/MermaidChart";
import { usePatients } from "@/context/PatientContext";

export default function DiagramPage() {
  const { rule } = usePatients();
  const chart = ruleToMermaid(rule as any);
  console.log('chart: ', chart);

  return (
    <div style={{ padding: 20 }}>
      <h1>Eligibility Flow Diagram</h1>
      <MermaidChart chart={chart} />
    </div>
  );
}
