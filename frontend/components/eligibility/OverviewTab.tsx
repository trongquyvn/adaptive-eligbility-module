"use client";

import { usePatients } from "@/context/PatientContext";
import PatientWorkflowFlow from "@/components/workflow/PatientWorkflowFlow";
import TabsMenu from "@/components/common/TabsMenu";

import { Edge, MarkerType, Node } from "reactflow";
import getLayoutElements from "@/lib/elk";
import { useEffect, useState } from "react";
import { exportJsonToFile } from "@/lib/common";
import JsonEditor from "../common/JsonEditor";
import { updateRule } from "@/lib/rule";
import { useToast } from "@/context/ToastContext";

const renderOutcome = (data: any) => {
  return (
    <div>
      <div>{data?.outcome}</div>
      {data?.message && <div>{data.message}</div>}
    </div>
  );
};

const MyPatientWorkflowFlow = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const { rule, ruleUpdate } = usePatients();
  const flow = rule?.logic?.flow;
  const ruleNodes = rule?.logic?.nodes || {};
  const nodeKeys = Object.keys(ruleNodes);

  const getNodeFlow = (id: string) => flow.find((e: any) => e.id === id);

  function isNodeInFlow(nodeId: string) {
    return flow.some((step: any) => {
      if (step.id === nodeId) return true;
      if (step.on_pass && step.on_pass.next === nodeId) return true;
      if (step.on_fail && step.on_fail.next === nodeId) return true;
      return false;
    });
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const rawNodes: Node[] = [
    {
      id: "start",
      type: "circleNode",
      data: {
        label: "Start",
      },
      position: { x: 0, y: 0 },
    },
  ];

  nodeKeys.forEach((e) => {
    if (isNodeInFlow(e)) {
      const node = ruleNodes[e];
      const nodeFlow = getNodeFlow(e);

      const nodeNew = {
        id: e,
        type: "roundedRectangleNode",
        data: {
          label: node.name,
          cate: node.cate,
          first: nodeFlow?.start,
          yes: nodeFlow?.on_pass,
          no: nodeFlow?.on_fail,
        },
        position: { x: 0, y: 0 },
      };
      rawNodes.push(nodeNew);

      if (nodeFlow?.on_pass?.outcome) {
        rawNodes.push({
          id: e + "_on_pass",
          type: "roundedRectangleNode",
          data: {
            label: renderOutcome(nodeFlow?.on_pass),
            message: true,
          },
          position: { x: 0, y: 0 },
        });
      }

      if (nodeFlow?.on_fail?.outcome) {
        rawNodes.push({
          id: e + "_on_fail",
          type: "roundedRectangleNode",
          data: {
            label: renderOutcome(nodeFlow?.on_fail),
            message: true,
          },
          position: { x: 0, y: 0 },
        });
      }
    }
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const rawEdges: Edge[] = [];
  flow.forEach((e: any, i: number) => {
    let hasIf: boolean = false;
    if (e?.on_fail && e?.on_pass) {
      hasIf = true;
    }
    const isStart = Boolean(e?.start);
    if (isStart) {
      rawEdges.push({
        id: "start_edge",
        source: "start",
        target: e.id,
        markerEnd: { type: MarkerType.Arrow },
      });
    }

    if (e?.on_fail?.outcome) {
      const edge = {
        id: "e" + i + "_on_fail_outcome",
        source: e.id,
        sourceHandle: "yes",
        target: e.id + "_on_fail",
        markerEnd: { type: MarkerType.Arrow },
        ...(hasIf
          ? {
              type: "custom",
              label: "No",
            }
          : {}),
      };

      rawEdges.push(edge);
    }

    if (e?.on_fail?.next) {
      const edge = {
        id: "e" + i + "_on_fail",
        source: e.id,
        sourceHandle: "yes",
        target: e?.on_fail?.next,
        markerEnd: { type: MarkerType.Arrow },
        ...(hasIf
          ? {
              type: "custom",
              label: "No",
            }
          : {}),
      };

      rawEdges.push(edge);
    }

    if (e?.on_pass?.outcome) {
      const edge = {
        id: "e" + i + "_on_pass_outcome",
        source: e.id,
        sourceHandle: "yes",
        target: e.id + "_on_pass",
        markerEnd: { type: MarkerType.Arrow },
        ...(hasIf
          ? {
              type: "custom",
              label: "Yes",
            }
          : {}),
      };

      rawEdges.push(edge);
    }

    if (e?.on_pass?.next) {
      const edge = {
        id: "e" + i + "_on_pass",
        source: e.id,
        sourceHandle: "yes",
        target: e?.on_pass?.next,
        markerEnd: { type: MarkerType.Arrow },
        ...(hasIf
          ? {
              type: "custom",
              label: "Yes",
            }
          : {}),
      };

      rawEdges.push(edge);
    }
  });

  // if (rawEdges.length) {
  //   rawEdges.unshift({
  //     id: "start_edge",
  //     source: "start",
  //     target: rawEdges?.[0]?.source,
  //     markerEnd: { type: MarkerType.Arrow },
  //   });
  // }

  useEffect(() => {
    console.log("Diagram update: ", ruleUpdate);
    getLayoutElements(rawNodes, rawEdges).then(({ nodes, edges }) => {
      setNodes(nodes);
      setEdges(edges);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ruleUpdate]);

  return (
    <div className="relative">
      <div className="absolute right-0 z-10">
        <button
          className="text-gray-500 hover:text-gray-700 cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5"
            />
          </svg>
        </button>
      </div>

      <div
        className={
          isOpen
            ? "fixed inset-0 bg-black/80 flex justify-center items-center z-50"
            : ""
        }
      >
        <div
          className={
            isOpen
              ? "bg-white rounded-lg h-full w-full p-6 relative"
              : "h-[600px] overflow-auto bg-white relative"
          }
        >
          <PatientWorkflowFlow nodes={nodes} edges={edges} />

          {isOpen && (
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const JSONFile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { rule, updateActiveRule } = usePatients();
  const { showToast } = useToast();

  const onSave = async (data: any) => {
    const result = await updateRule(rule._id, data);
    if (result) {
      updateActiveRule(result);
      showToast("Updated!", "success");
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded relative">
      <div className="absolute right-4 z-10">
        <button
          className="text-gray-500 hover:text-gray-700 cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5"
            />
          </svg>
        </button>
      </div>

      <div
        className={
          isOpen
            ? "fixed inset-0 bg-black/50 flex justify-center items-center z-50"
            : ""
        }
      >
        <div
          className={
            isOpen
              ? "bg-white rounded-lg w-11/12 p-6 h-11/12 overflow-auto relative"
              : ""
          }
        >
          <div className="text-xl font-semibold">Trial builder</div>
          <JsonEditor onSave={onSave} value={rule} />

          {isOpen && (
            <button
              onClick={() => setIsOpen(false)}
              className="fixed top-2 right-2 cursor-pointer text-3xl"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function OverviewTab() {
  const { rule } = usePatients();

  return (
    <div className="bg-white p-5">
      <div className="flex justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold mb-2">Overview</h2>
          <p className="text-gray-600 text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore
          </p>
        </div>
        <div>
          <button
            className="px-4 py-2 rounded-lg border"
            onClick={() => {
              exportJsonToFile(rule, "diagram.json");
            }}
          >
            Validate & Export
          </button>
        </div>
      </div>

      <TabsMenu
        tabs={[
          {
            id: "visual_diagram",
            label: "Visual Diagram",
            component: MyPatientWorkflowFlow,
          },
          {
            id: "json",
            label: "JSON File",
            component: JSONFile,
          },
        ]}
      />
    </div>
  );
}
