"use client";

import TabsMenu from "@/components/common/TabsMenu";

import OverviewTab from "@/components/eligibility/OverviewTab";
import IDCheckTab from "@/components/eligibility/IDCheckTab";
import PlatformTab from "@/components/eligibility/PlatformTab";
import DomainTab from "@/components/eligibility/DomainTab";
import RegimenTab from "@/components/eligibility/RegimenTab";
import ConsentTab from "@/components/eligibility/ConsentTab";
import VariableCreator from "@/components/variable/VariableCreator";
import DomainCreator from "@/components/variable/DomainCreator";
import RegimenCreator from "@/components/variable/RegimenCreator";

import { useState } from "react";
import { usePatients } from "@/context/PatientContext";

const tabs = [
  { id: "overview", label: "Overview", component: OverviewTab },
  { id: "id-check", label: "ID check", component: IDCheckTab },
  { id: "platform", label: "Platform", component: PlatformTab },
  { id: "domain", label: "Domain", component: DomainTab },
  { id: "regimen", label: "Regimen", component: RegimenTab },
  { id: "consent", label: "Consent", component: ConsentTab },
];

export default function RoadmapPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const { rule } = usePatients();
  const domains = rule?.domain_catalog || [];

  return (
    <section>
      <div className="mb-4 flex justify-between">
        <h2 className="text-xl">
          Eligibility Logic Builder
          <span className="text-xs"> v2.4</span>
        </h2>

        {activeTab === "overview" && (
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Validate
          </button>
        )}

        {activeTab === "domain" && (
          <DomainCreator />
        )}

        {activeTab === "regimen" && <RegimenCreator domains={domains}/>}
      </div>

      <TabsMenu tabs={tabs} callBack={setActiveTab} />
    </section>
  );
}
