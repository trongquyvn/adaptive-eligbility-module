"use client";

import TabsMenu from "@/components/common/TabsMenu";

import OverviewTab from "@/components/eligibility/OverviewTab";
import IDCheckTab from "@/components/eligibility/IDCheckTab";
import PlatformTab from "@/components/eligibility/PlatformTab";
import DomainTab from "@/components/eligibility/DomainTab";
import RegimenTab from "@/components/eligibility/RegimenTab";
import ConsentTab from "@/components/eligibility/ConsentTab";
import VariablesTab from "@/components/eligibility/VariablesTab";
import NodesTab from "@/components/eligibility/NotesTab";

import VariableCreator from "@/components/variable/VariableCreator";
import DomainCreator from "@/components/variable/DomainCreator";
import RegimenCreator from "@/components/variable/RegimenCreator";
import NodesCreator from "@/components/variable/NodesCreator";

import { useState } from "react";
import { usePatients } from "@/context/PatientContext";
import { useNodes } from "@/context/NodeContext";

const tabs = [
  { id: "overview", label: "Overview", component: OverviewTab },
  { id: "id-check", label: "ID check", component: IDCheckTab },
  { id: "platform", label: "Platform", component: PlatformTab },
  { id: "domain", label: "Domain", component: DomainTab },
  { id: "regimen", label: "Regimen", component: RegimenTab },
  { id: "consent", label: "Consent", component: ConsentTab },
  { id: "variables", label: "Variables", component: VariablesTab },
  { id: "node", label: "Nodes", component: NodesTab },
];

export default function RoadmapPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const { rule } = usePatients();
  const { initType, initForm, setNoteForm, initVariableForm, setVariableForm } =
    useNodes();
  console.log("initVariableForm: ", initVariableForm);

  const domainNodes: string[] = [];
  const nodes: string[] = [];
  Object.keys(rule?.logic?.nodes || {}).forEach((e) => {
    const node = rule?.logic?.nodes[e];
    if (node.type === "DOMAIN_MAP") {
      domainNodes.push(e);
    } else {
      if (node.type !== "DATABASE") {
        nodes.push(e);
      }
    }
  });

  const domainsCatalog = rule?.domain_catalog || [];
  const domains: string[] = [];

  domainsCatalog.map((e: any) => {
    domains.push(e.id);
  });

  const regimens: string[] = [];
  (rule?.regimen_catalog || []).map((e: any) => {
    regimens.push(e.id);
  });

  const variables: string[] = [];
  (rule?.variables || []).map((e: any) => {
    if (e.type !== "DATABASE") {
      variables.push(e.id);
    }
  });

  return (
    <section>
      <div className="mb-4 flex justify-between">
        <h2 className="text-xl">
          Eligibility Logic Builder
          <span className="text-xs"> v2.4</span>
        </h2>

        {/* {activeTab === "overview" && (
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Validate
          </button>
        )} */}

        {(activeTab === "overview" ||
          activeTab === "id-check" ||
          activeTab === "platform" ||
          activeTab === "consent") && (
          <div style={{ height: "40px" }}>&nbsp;</div>
        )}

        {activeTab === "domain" && <DomainCreator />}
        {activeTab === "variables" && (
          <VariableCreator
            initForm={initVariableForm}
            onClose={() => {
              setVariableForm();
            }}
          />
        )}
        {activeTab === "regimen" && <RegimenCreator domains={domainsCatalog} />}
        {activeTab === "node" && (
          <NodesCreator
            nodes={nodes}
            domainNodes={domainNodes}
            domains={domains}
            regimens={regimens}
            variables={variables}
            initType={initType}
            initForm={initForm}
            onClose={() => {
              setNoteForm({});
            }}
          />
        )}
      </div>

      <TabsMenu tabs={tabs} callBack={setActiveTab} />
    </section>
  );
}
