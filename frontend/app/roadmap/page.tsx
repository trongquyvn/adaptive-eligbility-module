"use client";

import PatientWorkflowFlow from "@/components/workflow/PatientWorkflowFlow";

export default function RoadmapPage() {
  return (
    <section>
      <div className="mb-4 flex justify-between">
        <h2 className="text-xl">Eligibility Logic Builder v2.4</h2>

        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Validate
        </button>
      </div>

      <PatientWorkflowFlow />
    </section>
  );
}
